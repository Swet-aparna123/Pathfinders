import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { getRoleHome } from '@/lib/auth/navigation';

const protectedRoutes = [
  { pattern: /^\/(?:dashboard|student-dashboard|academic-background)(?:\/|$)/, role: 'student' },
  { pattern: /^\/parent-dashboard(?:\/|$)/, role: 'parent' },
  { pattern: /^\/career-switcher-dashboard(?:\/|$)/, role: 'switch' },
  { pattern: /^\/rapid-fire(?:\/|$)/, role: 'student' },
  { pattern: /^\/api\/profile$/ },
  { pattern: /^\/register\/verify-phone(?:\/|$)/, phoneVerification: true },
];

function preserveUpdatedCookies(source, destination) {
  source.cookies.getAll().forEach(({ name, value, ...options }) => {
    destination.cookies.set(name, value, options);
  });
  return destination;
}

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const route = protectedRoutes.find(({ pattern }) => pattern.test(pathname));
  const isLoginPage = pathname === '/login';
  const demoRole = request.cookies.get('pathfinders_demo_role')?.value;
  const isLocalDemo = process.env.NODE_ENV !== 'production'
    && ['student', 'parent', 'switch'].includes(demoRole);

  if (isLocalDemo) {
    if (isLoginPage) return NextResponse.next();
    if (route?.phoneVerification) {
      return NextResponse.redirect(new URL(getRoleHome({ role: demoRole }), request.url));
    }
    if (route?.role && route.role !== demoRole) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'This local demo profile cannot access that role.' }, { status: 403 });
      }
      return NextResponse.redirect(new URL(getRoleHome({ role: demoRole }), request.url));
    }
    return NextResponse.next();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Authentication is not configured.' }, { status: 503 });
    }
    return new NextResponse('Authentication is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).', {
      status: 503,
    });
  }

  if (!route && !isLoginPage) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  let user;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error && error.status >= 500) throw error;
    user = data.user;
  } catch (error) {
    console.error('Route authentication failed:', error);
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unable to verify your session.' }, { status: 503 });
    }
    return new NextResponse('Unable to verify your session. Please try again.', { status: 503 });
  }

  if (!user && route) {
    const hasAuthCookie = request.cookies.getAll().some(({ name }) => name.startsWith('sb-') && name.includes('-auth-token'));
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
    if (hasAuthCookie) loginUrl.searchParams.set('reason', 'session_expired');
    return preserveUpdatedCookies(response, NextResponse.redirect(loginUrl));
  }

  if (!user) return response;
  if (route?.phoneVerification) {
    if (!user.email_confirmed_at) {
      return preserveUpdatedCookies(response, NextResponse.redirect(new URL('/login?reason=session_expired', request.url)));
    }
    if (!user.user_metadata?.phone || user.phone_confirmed_at) {
      return preserveUpdatedCookies(response, NextResponse.redirect(new URL(getRoleHome(user.user_metadata), request.url)));
    }
    return response;
  }
  if (!user.email_confirmed_at || (user.user_metadata?.phone && !user.phone_confirmed_at)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Verify your email and phone before continuing.' }, { status: 403 });
    }
    const verificationUrl = new URL('/register/verify-phone', request.url);
    return preserveUpdatedCookies(response, NextResponse.redirect(verificationUrl));
  }

  if (isLoginPage) {
    return preserveUpdatedCookies(response, NextResponse.redirect(new URL(getRoleHome(user.user_metadata), request.url)));
  }

  if (route?.role && user.user_metadata?.role !== route.role) {
    return preserveUpdatedCookies(response, NextResponse.redirect(new URL(getRoleHome(user.user_metadata), request.url)));
  }

  return response;
}

export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*',
    '/student-dashboard/:path*',
    '/parent-dashboard/:path*',
    '/career-switcher-dashboard/:path*',
    '/academic-background/:path*',
    '/rapid-fire/:path*',
    '/api/profile',
    '/register/verify-phone/:path*',
  ],
};
