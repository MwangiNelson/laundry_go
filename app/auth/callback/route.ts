import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { createSupabaseServer } from "@/api/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  console.log({ code, next, allParams: Object.fromEntries(searchParams) });

  if (code) {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      // if (forwardedHost && !isLocalEnv) {
      // return NextResponse.redirect(`https://${forwardedHost}/${next}`);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/${next}`
      );
      // }
      // return NextResponse.redirect(`${origin}/${next}`);
      // }
      // console.error("Error exchanging code for session:", error);
    }

    // If no code, redirect to login
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/vendor/signin`
    );
  }
}
