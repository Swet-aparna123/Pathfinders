'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Compass, Mail, Phone } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { profileFromSupabaseUser } from '@/lib/supabase/profile';
import { userProfileService } from '@/lib/userProfileService';
import GrainOverlay from '@/components/GrainOverlay';

export default function VerifyPhonePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadUser() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!data.user) {
          router.replace('/register?error=verification_session_missing');
          return;
        }
        if (active) setUser(data.user);
      } catch (loadError) {
        if (active) setError(loadError.message || 'Unable to load your verification session.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadUser();
    return () => {
      active = false;
    };
  }, [router]);

  const phone = user?.user_metadata?.phone;

  const sendCode = async () => {
    setSending(true);
    setError('');
    setNotice('');
    try {
      if (!phone) throw new Error('Your account does not have a phone number. Return to registration and try again.');
      const supabase = getSupabaseBrowserClient();
      const { error: sendError } = codeSent
        ? await supabase.auth.resend({ type: 'phone_change', phone })
        : await supabase.auth.updateUser({ phone });
      if (sendError) throw sendError;
      setCodeSent(true);
      setNotice(`A verification code was sent to ${phone}.`);
    } catch (sendError) {
      setError(sendError.message || 'Unable to send a verification code. Check your phone number and try again.');
    } finally {
      setSending(false);
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    setSending(true);
    setError('');
    setNotice('');
    try {
      if (!phone) throw new Error('Your account does not have a phone number. Return to registration and try again.');
      if (!/^\d{6,8}$/.test(code.trim())) throw new Error('Enter the verification code from your SMS.');

      const supabase = getSupabaseBrowserClient();
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone,
        token: code.trim(),
        type: 'phone_change',
      });
      if (verifyError) {
        const message = verifyError.message.toLowerCase();
        throw new Error(
          message.includes('token') || message.includes('otp') || message.includes('expired')
            ? 'That verification code is invalid or expired. Request a new code and try again.'
            : verifyError.message
        );
      }
      if (!data.user?.phone_confirmed_at) {
        throw new Error('Phone verification did not complete. Please request a new code and try again.');
      }

      const profile = profileFromSupabaseUser(data.user);
      userProfileService.clearTransientState();
      userProfileService.hydrateProfile(profile);
      const destination = profile.role === 'parent'
        ? '/parent-dashboard'
        : profile.role === 'switch'
          ? '/career-switcher-dashboard'
          : '/academic-background';
      setNotice('Email and phone verified. Your profile is ready.');
      router.replace(destination);
    } catch (verifyError) {
      setError(verifyError.message || 'Unable to verify your phone number.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-deep px-4 py-12 text-parchment">
      <div className="absolute inset-0 bg-cover bg-center opacity-30 bg-[url('/hero-bg.png')]" />
      <div className="absolute inset-0 bg-ink-deep/75" />
      <GrainOverlay />
      <section className="relative z-10 w-full max-w-md rounded-3xl border border-parchment/15 bg-ink-deep/90 p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-brass/50 bg-brass/10 text-brass-bright">
            {loading ? <Compass className="h-7 w-7 animate-spin" /> : <Phone className="h-7 w-7" />}
          </div>
          <h1 className="font-display text-2xl font-semibold">Verify your phone</h1>
          <p className="mt-2 text-sm text-fog/75">
            Your email is verified. Confirm your mobile number to finish setting up your account.
          </p>
        </div>

        {error && <p role="alert" className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        {notice && <p role="status" className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">{notice}</p>}

        {!loading && (
          <form onSubmit={verifyCode} className="space-y-4">
            <p className="text-center text-sm text-fog/80">{phone || 'No phone number is associated with this account.'}</p>
            <button
              type="button"
              onClick={sendCode}
              disabled={sending || !phone}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-brass/50 px-5 py-3 text-sm font-semibold text-brass-bright hover:bg-brass/10 disabled:opacity-50"
            >
              <Mail className="h-4 w-4" />
              {sending ? 'Sending code…' : 'Send or resend SMS code'}
            </button>
            <label htmlFor="phone-otp" className="block text-xs font-mono uppercase tracking-wider text-fog/75">SMS verification code</label>
            <input
              id="phone-otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="w-full rounded-xl border border-parchment/20 bg-ink/60 px-4 py-3 text-center font-mono text-lg tracking-[0.4em] text-parchment focus:border-brass focus:outline-none"
              placeholder="000000"
            />
            <button
              type="submit"
              disabled={sending || !code.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brass px-5 py-3 text-sm font-semibold text-ink-deep hover:bg-brass-bright disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              {sending ? 'Verifying…' : 'Verify and finish registration'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-fog/60">
          Need to start over? <Link href="/register" className="text-brass-bright hover:underline">Return to registration</Link>
        </p>
      </section>
    </main>
  );
}
