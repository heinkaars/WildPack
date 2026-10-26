import OpenAI from 'openai';
import { guard, readJson } from '../../lib/api-guard';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/** Text-only, so cheaper than an identification and allowed a longer leash. */
const PER_USER_PER_MINUTE = 20;
const PER_IP_PER_MINUTE = 60;

const MAX_HISTORY = 20;
const MAX_MESSAGE_CHARS = 2_000;
const MAX_QUESTION_CHARS = 500;
const MAX_NAME_CHARS = 120;
const MAX_ANSWER_TOKENS = 500;
const MAX_BODY_BYTES = 64 * 1024;

/**
 * Control and format characters, plus the Unicode line and paragraph
 * separators. Stripping only \r\n\t left U+2028, U+0085, \v and \f, all of
 * which still read as a line break, and bidi overrides that make a name look
 * like something it is not.
 */
const NOT_ONE_LINE = /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu;

/** A name fit for the system prompt: one line, so it cannot start a new instruction. */
function promptSafeName(value: unknown): string {
  return String(value ?? '').replace(NOT_ONE_LINE, ' ').slice(0, MAX_NAME_CHARS);
}

export async function POST(request: Request) {
  try {
    return await answer(request);
  } catch (error) {
    // As in the identify route: the real error is for the log, not the client.
    console.error('[ama]', error);
    return Response.json({ error: 'Could not answer that right now' }, { status: 500 });
  }
}

async function answer(request: Request): Promise<Response> {
  const caller = await guard(request, 'ama', PER_USER_PER_MINUTE, PER_IP_PER_MINUTE);
  if (caller.response) return caller.response;

  const body = (await readJson(request, MAX_BODY_BYTES)) as Record<string, any> | null;
  if (!body) return Response.json({ error: 'Request too large' }, { status: 413 });
  const { entry, question, history } = body;

  if (!entry || typeof question !== 'string' || question.trim().length === 0) {
    return Response.json({ error: 'entry and question are required' }, { status: 400 });
  }

  // Everything below crosses into the prompt, so nothing crosses unmeasured.
  const commonName = promptSafeName(entry.commonName);
  const scientificName = promptSafeName(entry.scientificName);

  /**
   * The roles are rebuilt rather than passed through. A client that sends
   * `role: 'system'` would otherwise be writing this app's instructions —
   * replacing the wildlife expert with anything it liked, on our OpenAI bill.
   * Only the two roles the app itself writes survive the filter.
   */
  const safeHistory = (Array.isArray(history) ? history : [])
    .slice(-MAX_HISTORY)
    .filter(
      (message) =>
        message &&
        (message.role === 'user' || message.role === 'assistant') &&
        typeof message.text === 'string',
    )
    .map((message) => ({
      role: message.role as 'user' | 'assistant',
      content: message.text.slice(0, MAX_MESSAGE_CHARS),
    }));

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: MAX_ANSWER_TOKENS,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          `You are a wildlife expert helping a user in a nature app understand a species they just identified: ` +
          `${commonName} (${scientificName}). Answer questions about this animal: behavior, habitat, diet, ` +
          `look-alikes, conservation status, safety around it, keeping or seeing it, its name, and its place in ` +
          `culture. Questions comparing it with other animals, and general wildlife identification questions, are ` +
          `welcome too. Keep answers conversational and concise (2-4 sentences unless the question needs more). ` +
          `Only when the latest question has nothing to do with this animal or wildlife (for example geography, ` +
          `sport, homework or coding), do not answer it; politely steer back to the ${commonName} instead. ` +
          // The flag colours the answer red in the app. It used to come back true for answered questions
          // that were merely unusual (pets, zoos, the name), so it is tied to whether the model declined.
          `Reply with a JSON object: {"answer": string, "off_topic": boolean}. Set off_topic to true only when ` +
          `you declined the latest question and steered back; whenever you answered it, off_topic is false. ` +
          `Earlier messages do not affect it.`,
      },
      ...safeHistory,
      { role: 'user', content: question.slice(0, MAX_QUESTION_CHARS) },
    ],
  });

  // The model is asked for JSON; plain text still makes a usable answer.
  const content = completion.choices[0]?.message?.content;
  let reply: unknown = content;
  let offTopic = false;
  try {
    const parsed = JSON.parse(content ?? '');
    reply = parsed.answer;
    offTopic = parsed.off_topic === true;
  } catch {
    // keep the raw text
  }
  if (typeof reply !== 'string' || reply.trim().length === 0) {
    return Response.json({ error: 'No answer returned' }, { status: 502 });
  }

  return Response.json({ answer: reply, offTopic });
}
