'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const RegisterContext = createContext({
  isRegisterOpen: false,
  registerRole: 'student',
  openRegister: (role = 'student') => {},
  closeRegister: () => {},
  isLoginOpen: false,
  openLogin: () => {},
  closeLogin: () => {},
  switchToLogin: () => {},
  switchToRegister: (role = 'student') => {},
});

export function RegisterProvider({ children }) {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerRole, setRegisterRole] = useState('student');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openRegister = (role = 'student') => {
    if (['student', 'parent', 'switch'].includes(role)) {
      setRegisterRole(role);
    } else {
      setRegisterRole('student');
    }
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const closeRegister = () => {
    setIsRegisterOpen(false);
  };

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setTimeout(() => {
      setIsLoginOpen(true);
    }, 150);
  };

  const switchToRegister = (role = 'student') => {
    setIsLoginOpen(false);
    setTimeout(() => {
      openRegister(role);
    }, 150);
  };

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (isRegisterOpen || isLoginOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isRegisterOpen, isLoginOpen]);

  // Handle ESC key press to close active modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isRegisterOpen) closeRegister();
        if (isLoginOpen) closeLogin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRegisterOpen, isLoginOpen]);

  return (
    <RegisterContext.Provider
      value={{
        isRegisterOpen,
        registerRole,
        openRegister,
        closeRegister,
        isLoginOpen,
        openLogin,
        closeLogin,
        switchToLogin,
        switchToRegister,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {
  return useContext(RegisterContext);
}
