import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const next = requestUrl.searchParams.get('next');
  const destination = next?.startsWith('/') && !next.startsWith('//')
    ? next
    : '/register/verify-phone';

  try {
    const supabase = await getSupabaseServerClient();
    const code = requestUrl.searchParams.get('code');
    const tokenHash = requestUrl.searchParams.get('token_hash');
    const type = requestUrl.searchParams.get('type');

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    } else if (tokenHash && (type === 'signup' || type === 'email')) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      });
      if (error) throw error;
    } else {
      throw new Error('The email verification link is invalid or has expired.');
    }

    return NextResponse.redirect(new URL(destination, request.url));
  } catch (error) {
    console.error('Email verification callback failed:', error);
    return NextResponse.redirect(new URL('/register?error=email_verification_failed', request.url));
  }
}
