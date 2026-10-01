type UserLike = { email?: string; user_metadata?: Record<string, unknown> };

export function displayName(user: UserLike) {
  const meta = user.user_metadata ?? {};
  return (meta.full_name as string) || (meta.name as string) || user.email || "";
}

export function firstName(user: UserLike): string | null {
  const meta = user.user_metadata ?? {};
  const explicit = meta.first_name as string | undefined;
  if (explicit) return explicit;
  const full = (meta.full_name as string) || (meta.name as string);
  return full ? full.split(" ")[0] : null;
}
