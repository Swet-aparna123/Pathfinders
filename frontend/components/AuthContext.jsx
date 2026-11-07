'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { fetchCurrentProfile } from '@/lib/auth/session-client';
import { userProfileService } from '@/lib/userProfileService';

const AuthContext = createContext(null);

function updateProfile(profile) {
  if (profile?.id) {
    userProfileService.hydrateProfile(profile);
    return profile;
  }
  userProfileService.clearAuthenticatedProfile();
  return null;
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const userRef = useRef(null);
  const authRevision = useRef(0);

  const setAuthenticatedUser = useCallback((profile) => {
    authRevision.current += 1;
    const authenticatedUser = profile?.id
      ? updateProfile(profile)
      : userRef.current?.id
        ? updateProfile(null)
        : null;
    userRef.current = authenticatedUser;
    setUser(authenticatedUser);
    setStatus(authenticatedUser ? 'authenticated' : 'unauthenticated');
    return authenticatedUser;
  }, []);

  const refresh = useCallback(async () => {
    try {
      const profile = await fetchCurrentProfile();
      setAuthenticatedUser(profile);
      return profile;
    } catch (error) {
      setStatus((current) => current === 'loading' ? 'error' : current);
      throw error;
    }
  }, [setAuthenticatedUser]);

  const logout = useCallback(async () => {
    if (user?.authMode === 'demo') {
      userProfileService.clearDemoSession();
      userProfileService.clearAuthenticatedProfile();
      setAuthenticatedUser(null);
      return;
    }

    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to sign out.');
    setAuthenticatedUser(null);
  }, [setAuthenticatedUser, user]);

  useEffect(() => {
    let active = true;
    const syncProfile = async () => {
      const requestRevision = authRevision.current;
      try {
        const profile = await fetchCurrentProfile();
        if (active && authRevision.current === requestRevision) {
          const hadSession = Boolean(userRef.current?.id);
          setAuthenticatedUser(profile);
          const isProtected = [
            '/dashboard',
            '/student-dashboard',
            '/academic-background',
            '/parent-dashboard',
            '/career-switcher-dashboard',
            '/rapid-fire',
            '/register/verify-phone',
          ].some((route) => pathname === route || pathname.startsWith(`${route}/`));
          if (!profile && hadSession && isProtected) {
            const next = `${pathname}${window.location.search}`;
            router.replace(`/login?reason=session_expired&next=${encodeURIComponent(next)}`);
          }
        }
      } catch {
        if (active && authRevision.current === requestRevision) {
          setStatus((current) => current === 'loading' ? 'error' : current);
        }
      }
    };

    syncProfile();
    const onFocus = () => {
      if (document.visibilityState === 'visible') syncProfile();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);

    return () => {
      active = false;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [pathname, router, setAuthenticatedUser]);

  const value = useMemo(() => ({
    user,
    status,
    isAuthenticated: status === 'authenticated',
    setAuthenticatedUser,
    refresh,
    logout,
  }), [user, status, setAuthenticatedUser, refresh, logout]);

  return (
    <AuthContext.Provider value={value}>
      {user?.authMode === 'demo' && (
        <div
          role="status"
          className="fixed bottom-3 left-1/2 z-[120] -translate-x-1/2 rounded-full border border-amber-400/40 bg-slate-950/90 px-4 py-2 text-center text-xs text-amber-100 shadow-lg"
        >
          Local demo session · synthetic data stays in this browser
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
