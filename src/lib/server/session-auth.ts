import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { adminEmailAllowed } from "./auth";

export async function currentUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => undefined,
    },
  });
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
}

export async function currentAdmin() {
  const user = await currentUser();
  return user && adminEmailAllowed(user.email) ? user : null;
}
