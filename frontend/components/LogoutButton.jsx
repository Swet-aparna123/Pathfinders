'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';

export default function LogoutButton({ className = '', onLoggedOut }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    setError('');
    try {
      await logout();
      onLoggedOut?.();
      router.replace('/');
      router.refresh();
    } catch (logoutError) {
      setError(logoutError.message || 'Unable to sign out. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" onClick={handleLogout} disabled={loading} className={className}>
        <LogOut className="h-4 w-4" />
        <span>{loading ? 'Signing out…' : 'Log out'}</span>
      </button>
      {error && <p role="alert" className="mt-2 text-xs text-red-300">{error}</p>}
    </>
  );
}
