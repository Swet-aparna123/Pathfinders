'use client';

import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { RegisterProvider } from '@/components/RegisterContext';
import RegisterDrawer from '@/components/RegisterDrawer';
import LoginDrawer from '@/components/LoginDrawer';
import { AuthProvider } from '@/components/AuthContext';

export default function Providers({ children }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RegisterProvider>
          {children}
          <RegisterDrawer />
          <LoginDrawer />
        </RegisterProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
