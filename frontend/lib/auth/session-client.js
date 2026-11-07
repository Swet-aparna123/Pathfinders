import { userProfileService } from '@/lib/userProfileService';

export async function fetchCurrentProfile() {
  const demoProfile = userProfileService.getDemoProfile();
  if (demoProfile) return demoProfile;

  const response = await fetch('/api/auth/me', {
    cache: 'no-store',
    credentials: 'same-origin',
  });
  if (response.status === 401) return null;

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Unable to load your session.');
  return result.user || null;
}

export async function signInWithPassword(email, password, rememberMe = false) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ email, password, rememberMe }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Unable to sign in.');
  if (!result.profile) throw new Error('Sign-in completed without a user profile. Please try again.');
  userProfileService.clearDemoSession();
  userProfileService.clearTransientState();
  return result.profile;
}
