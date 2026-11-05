'use client';

import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { RegisterProvider } from '@/components/RegisterContext';
import RegisterDrawer from '@/components/RegisterDrawer';
import LoginDrawer from '@/components/LoginDrawer';

export default function Providers({ children }) {
  return (
    <LanguageProvider>
      <RegisterProvider>
        {children}
        <RegisterDrawer />
        <LoginDrawer />
      </RegisterProvider>
    </LanguageProvider>
  );
}
