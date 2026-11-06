import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { profileFromSupabaseUser } from '@/lib/supabase/profile';

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error?.status >= 500) throw error;
    if (error) return NextResponse.json({ user: null }, { status: 401 });
    if (!data.user) return NextResponse.json({ user: null }, { status: 401 });
    return NextResponse.json({ user: profileFromSupabaseUser(data.user) });
  } catch (error) {
    console.error('Session lookup failed:', error);
    return NextResponse.json({ error: 'Unable to load session.' }, { status: 500 });
  }
}
