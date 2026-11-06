export function profileFromSupabaseUser(user) {
  const metadata = user?.user_metadata || {};
  return {
    ...metadata,
    id: user.id,
    email: user.email || '',
    phone: user.phone || metadata.phone || '',
    createdAt: metadata.createdAt || user.created_at,
    emailVerified: Boolean(user.email_confirmed_at),
    phoneVerified: Boolean(user.phone_confirmed_at),
  };
}
