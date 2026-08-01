import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const baseUrl = process.env.APP_BASE_URL ?? requestUrl.origin;
  const destination = new URL("/", baseUrl);
  const code = requestUrl.searchParams.get("code");
  if (!code || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    destination.searchParams.set("auth", "unavailable");
    return NextResponse.redirect(destination);
  }

  const response = NextResponse.redirect(destination);
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.headers.get("cookie")?.split(";").map((item) => {
        const [name, ...value] = item.trim().split("=");
        return { name, value: value.join("=") };
      }) ?? [],
      setAll: (items: Array<{ name: string; value: string; options: CookieOptions }>) => items.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
    },
  });
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) destination.searchParams.set("auth", "failed");
  else destination.searchParams.set("auth", "confirmed");
  response.headers.set("location", destination.toString());
  return response;
}
