import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses RLS and can manage auth users. Never import
 * this from client code; `server-only` makes that a build error. Used only
 * for privileged operations Supabase doesn't expose to a user's own session
 * (e.g. deleting their own auth account in Settings).
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
