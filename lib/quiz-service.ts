import { supabase } from './supabase';
import { QuizQuestion } from './quiz';
import { LifelistEntry } from './types';

/** Asks the server to write one question per species, in the same order. */
export async function fetchQuizQuestions(species: LifelistEntry[], avoid: string[]): Promise<QuizQuestion[]> {
  // The server checks this before it spends anything at OpenAI.
  const { data } = await supabase.auth.getSession();

  const response = await fetch('/api/quiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.session?.access_token ?? ''}`,
    },
    body: JSON.stringify({
      species: species.map(({ commonName, scientificName }) => ({ commonName, scientificName })),
      avoid,
    }),
  });

  // These messages reach the user, so they are written for one.
  if (response.status === 401) {
    throw new Error('We could not confirm your account. Close WildPack and open it again.');
  }
  if (response.status === 429) {
    throw new Error('That is a lot of tries at once. Give it a minute, then try again.');
  }
  if (!response.ok) {
    throw new Error('Could not write today’s quiz right now. Try again in a moment.');
  }

  const { questions } = await response.json();
  return (questions as Omit<QuizQuestion, 'speciesSlug' | 'speciesName'>[]).map((question, i) => ({
    ...question,
    speciesSlug: species[i].id,
    speciesName: species[i].commonName,
  }));
}
