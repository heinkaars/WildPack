import { createClient } from '@supabase/supabase-js';
import { guard } from '../../lib/api-guard';

/**
 * "Delete account" on the profile screen. Removes the caller's photos, then the
 * account itself; the database cascades that to their profile, sightings and
 * chat messages (`on delete cascade` in supabase/schema.sql). The shared
 * species catalog is nobody's and stays.
 *
 * Needs the service role key: only an admin can delete a user, and the caller
 * is only ever allowed to delete themselves — the id comes from their verified
 * session, never from the request body.
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const BUCKET = 'sightings';
const PAGE = 100;

/** Generous: a real user calls this once, ever. */
const PER_USER_PER_MINUTE = 3;
const PER_IP_PER_MINUTE = 10;

export async function POST(request: Request) {
  try {
    return await deleteAccount(request);
  } catch (error) {
    console.error('[delete-account]', error);
    return Response.json({ error: 'Could not delete the account right now' }, { status: 500 });
  }
}

async function deleteAccount(request: Request): Promise<Response> {
  const caller = await guard(request, 'delete-account', PER_USER_PER_MINUTE, PER_IP_PER_MINUTE);
  if (caller.response) return caller.response;
  const { userId } = caller;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[delete-account] SUPABASE_SERVICE_ROLE_KEY is not set');
    return Response.json({ error: 'Could not delete the account right now' }, { status: 500 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  // Photos first: once the user is gone nothing points at their folder, and
  // an orphaned photo would be personal data nobody can reach to delete.
  // Always read the first page, since each pass removes what it listed.
  for (;;) {
    const { data: files, error: listError } = await admin.storage.from(BUCKET).list(userId, { limit: PAGE });
    if (listError) throw listError;
    if (!files || files.length === 0) break;

    const { error: removeError } = await admin.storage
      .from(BUCKET)
      .remove(files.map((file) => `${userId}/${file.name}`));
    if (removeError) throw removeError;
    if (files.length < PAGE) break;
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
  if (deleteError) throw deleteError;

  return Response.json({ deleted: true });
}
