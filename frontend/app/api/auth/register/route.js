import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request) {
  try {
    const raw = await request.text();
    if (raw.length > 2_500_000) {
      return NextResponse.json({ error: 'Registration details are too large.' }, { status: 413 });
    }

    const body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Registration details are required.' }, { status: 400 });
    }
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const role = body.role;
    const phone = typeof body.phone === 'string' ? body.phone.replace(/[^\d+]/g, '') : '';

    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      return NextResponse.json({ error: 'Password must be 8+ characters and include an uppercase letter, number, and symbol.' }, { status: 400 });
    }
    if (!['student', 'parent', 'switch'].includes(role)) {
      return NextResponse.json({ error: 'Select a valid account role.' }, { status: 400 });
    }
    if (!/^\+[1-9]\d{6,14}$/.test(phone)) {
      return NextResponse.json({ error: 'Enter a valid phone number in international format.' }, { status: 400 });
    }
    if (typeof body.avatarUrl === 'string' && body.avatarUrl.length > 250_000) {
      return NextResponse.json({ error: 'Profile image is too large.' }, { status: 413 });
    }

    const profile = {
      fullName: String(body.fullName || '').trim().slice(0, 160),
      firstName: String(body.firstName || '').trim().slice(0, 80),
      middleName: String(body.middleName || '').trim().slice(0, 80),
      lastName: String(body.lastName || '').trim().slice(0, 80),
      phone,
      role,
      createdAt: new Date().toISOString(),
      avatarUrl: body.avatarUrl || null,
    };

    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: profile,
        emailRedirectTo: new URL('/auth/callback?next=/register/verify-phone', request.url).toString(),
      },
    });

    if (error) {
      const message = error.message.toLowerCase();
      const duplicate = message.includes('already registered') || message.includes('already been registered') || message.includes('email_exists');
      return NextResponse.json({
        error: duplicate
          ? 'An account with this email already exists.'
          : 'Unable to create your account. Check your details and try again.',
      }, { status: duplicate ? 409 : 400 });
    }
    if (!data.user) {
      return NextResponse.json({ error: 'Supabase did not return an account. Please try again.' }, { status: 502 });
    }
    if (data.user.identities?.length === 0) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      verificationRequired: !data.session,
      user: { id: data.user.id, email: data.user.email },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
    }
    console.error('Registration failed:', error);
    return NextResponse.json({ error: 'Unable to create your account right now.' }, { status: 500 });
  }
}
