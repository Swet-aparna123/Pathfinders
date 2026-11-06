import { getSupabaseBrowserClient } from './client';

export function formatPhoneNumber(countryCode, phone) {
  const digits = phone.replace(/\D/g, '');
  return `${countryCode}${digits}`;
}

export function registrationErrorMessage(error) {
  const message = error?.message || 'Unable to create your account. Please try again.';
  const normalized = message.toLowerCase();

  if (
    normalized.includes('already registered') ||
    normalized.includes('already been registered') ||
    normalized.includes('user exists') ||
    normalized.includes('email_exists') ||
    normalized.includes('duplicate key')
  ) {
    return 'An account with this email already exists. Sign in or use a different email address.';
  }
  if (normalized.includes('invalid email')) return 'Enter a valid email address.';
  if (normalized.includes('password')) return 'Choose a password that meets the listed requirements.';
  if (normalized.includes('phone')) return 'Enter a valid phone number in international format.';
  return message;
}

export async function registerWithSupabase({ email, password, profile }) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: profile,
      emailRedirectTo: `${window.location.origin}/auth/callback?next=/register/verify-phone`,
    },
  });

  if (error) throw new Error(registrationErrorMessage(error));
  if (data.user && data.user.identities?.length === 0) {
    throw new Error(registrationErrorMessage({ message: 'User already registered' }));
  }
  if (!data.user) throw new Error('Supabase did not return an account. Please try again.');
  return data;
}

export async function resendSignupConfirmation(email) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email.trim().toLowerCase(),
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback?next=/register/verify-phone`,
    },
  });
  if (error) throw new Error(registrationErrorMessage(error));
}
