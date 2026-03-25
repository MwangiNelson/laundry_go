import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/api/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/${next}`
      );
    }
  }

  // No code (e.g. expired/invalid magic link) or code exchange failed
  // Redirect to the appropriate signin page
  const isVendorFlow = next.includes("/vendor");
  const signinPath = isVendorFlow ? "/auth/vendor/signin" : "/auth/signin";
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}${signinPath}`
  );
}
