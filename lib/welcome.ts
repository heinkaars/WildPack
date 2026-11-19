import { useSyncExternalStore } from 'react';

export type Welcome = { kind: 'signed-in' | 'created'; email: string };

/**
 * Held outside React on purpose. The welcome is raised on the screen the user
 * is leaving, and signing in tears the tree down behind them — component state
 * does not survive that, so the message would vanish before it was ever drawn.
 * Module state outlives the remount.
 */
let current: Welcome | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/**
 * Raises the welcome. It stays pending until Home is on screen with the
 * account's real profile to show it — the raiser deliberately does not start
 * the clock, because it is called from the screen the user is leaving.
 */
export function showWelcome(next: Welcome): void {
  current = next;
  emit();
}

export function clearWelcome(): void {
  current = null;
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Welcome | null {
  return current;
}

export function useWelcome(): Welcome | null {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
