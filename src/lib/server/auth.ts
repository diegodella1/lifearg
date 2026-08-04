import "server-only";

export function adminEmailAllowed(email: string | null | undefined) {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAIL_ALLOWLIST ?? "").split(",").map((value) => value.trim().toLocaleLowerCase("en")).filter(Boolean);
  return allowed.includes(email.trim().toLocaleLowerCase("en"));
}
