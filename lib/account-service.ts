import { supabase } from './supabase';

/**
 * Deletes the signed-in account and everything it saved, on the server
 * (`app/api/delete-account+api.ts`). The caller then signs out, which hands the
 * phone a fresh account and clears the local copy.
 */
export async function deleteAccount(): Promise<void> {
  const { data } = await supabase.auth.getSession();

  let response: Response;
  try {
    response = await fetch('/api/delete-account', {
      method: 'POST',
      headers: { Authorization: `Bearer ${data.session?.access_token ?? ''}` },
    });
  } catch {
    throw new Error('WildPack can’t reach the internet. Connect and try again.');
  }

  // These messages reach the user, so they are written for one.
  if (response.status === 401) {
    throw new Error('We could not confirm your account. Close WildPack and open it again.');
  }
  if (!response.ok) {
    throw new Error('Your account could not be deleted right now. Try again in a moment.');
  }
}
