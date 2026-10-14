import { useCallback, useEffect, useState } from 'react';
import * as db from './db';
import { sync } from './sync';
import { useAuth } from './auth';
import { useLifelist } from './lifelist-store';
import { uuid } from './uuid';
import { AmaMessage } from './types';

/**
 * One AMA conversation, read from the local database so reopening a species
 * shows the previous chat instantly instead of an empty thread.
 */
export function useAmaThread(speciesSlug: string) {
  const { userId } = useAuth();
  const { refresh } = useLifelist();
  const [messages, setMessages] = useState<AmaMessage[]>([]);

  useEffect(() => {
    let cancelled = false;
    db.readAmaMessages(speciesSlug).then((loaded) => {
      if (!cancelled) setMessages(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [speciesSlug]);

  const append = useCallback(
    async (role: 'user' | 'assistant', text: string): Promise<AmaMessage> => {
      const message: AmaMessage = { id: uuid(), role, text };
      const createdAt = new Date().toISOString();

      setMessages((prev) => [...prev, message]);

      await db.insertAmaMessage({ id: message.id, speciesSlug, role, body: text, createdAt });
      await db.enqueue('ama.insert', { id: message.id, speciesSlug, role, body: text, createdAt });
      // A question is worth Explorer XP, so the home screen's total moves with it.
      if (role === 'user') refresh();

      if (userId) sync(userId);
      return message;
    },
    [speciesSlug, userId, refresh],
  );

  return { messages, append };
}
