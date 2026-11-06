import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { profileFromSupabaseUser } from '@/lib/supabase/profile';

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password || email.length > 254 || password.length > 1024) {
      return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
    }

    const rememberMe = body.rememberMe === true;
    const supabase = await getSupabaseServerClient({
      cookieOptions: {
        maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 8,
      },
    });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      const message = error?.message.toLowerCase().includes('email not confirmed')
        ? 'Verify your email address before signing in.'
        : 'Email or password is incorrect.';
      return NextResponse.json({ error: message }, { status: 401 });
    }

    if (data.user.user_metadata?.phone && !data.user.phone_confirmed_at) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: 'Verify your mobile number before signing in.' }, { status: 403 });
    }

    return NextResponse.json({ success: true, profile: profileFromSupabaseUser(data.user) });
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json({ error: 'Unable to sign in right now.' }, { status: 500 });
  }
}
