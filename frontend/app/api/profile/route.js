import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { profileFromSupabaseUser } from '@/lib/supabase/profile';

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error?.status >= 500) throw error;
    if (error || !data.user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    return NextResponse.json({ profile: profileFromSupabaseUser(data.user) });
  } catch (error) {
    console.error('Profile read failed:', error);
    return NextResponse.json({ error: 'Unable to load profile.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const raw = await request.text();
    if (raw.length > 2_500_000) {
      return NextResponse.json({ error: 'Profile update is too large.' }, { status: 413 });
    }
    const body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body) || !body.profile || typeof body.profile !== 'object') {
      return NextResponse.json({ error: 'A profile object is required.' }, { status: 400 });
    }

    const supabase = await getSupabaseServerClient();
    const { data: current, error: authError } = await supabase.auth.getUser();
    if (authError?.status >= 500) throw authError;
    if (authError || !current.user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const patch = { ...body.profile };
    ['id', 'email', 'phone', 'role', 'createdAt', 'updatedAt', 'emailVerified', 'phoneVerified', 'passwordHash', 'password'].forEach((key) => {
      delete patch[key];
    });

    const { data, error } = await supabase.auth.updateUser({
      data: { ...current.user.user_metadata, ...patch },
    });
    if (error) throw error;
    return NextResponse.json({ success: true, profile: profileFromSupabaseUser(data.user) });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
    console.error('Profile update failed:', error);
    return NextResponse.json({ error: 'Unable to save profile.' }, { status: 500 });
  }
}
