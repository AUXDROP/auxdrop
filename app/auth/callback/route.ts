import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureUserRow } from "@/lib/user";

// Supabase Auth redirects here after a signup confirmation, password-reset,
// or magic-link email is clicked, with a `code` to exchange for a session.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/onboarding";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await ensureUserRow(data.user);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
