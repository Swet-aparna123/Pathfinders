import { NextResponse } from 'next/server';
import { clearSessionCookieOptions } from '@/lib/auth';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    const response = NextResponse.json({ success: true });
    response.cookies.set('pathfinders_session', '', clearSessionCookieOptions);
    return response;
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ error: 'Unable to sign out right now.' }, { status: 500 });
  }
}
