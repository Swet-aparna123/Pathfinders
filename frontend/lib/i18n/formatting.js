/**
 * Locale-Aware Formatting Utilities for PathFinders
 *
 * Rules:
 * 1. Numbers formatted using Intl.NumberFormat according to active language locale
 * 2. Currency values always preserve the Indian Rupee symbol (₹)
 * 3. Dates formatted gracefully by locale
 */

const LOCALE_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  or: 'or-IN',
  bn: 'bn-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  ur: 'ur-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
};

export function getLocale(langCode = 'en') {
  return LOCALE_MAP[langCode] || 'en-IN';
}

/**
 * Format a number using locale conventions (e.g., grouping)
 */
export function formatNumber(value, langCode = 'en') {
  if (value === null || value === undefined || isNaN(value)) return '';
  try {
    const locale = getLocale(langCode);
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    return String(value);
  }
}

/**
 * Format currency while strictly preserving the ₹ symbol
 * e.g., formatCurrency(150000, 'hi') => "₹1,50,000"
 */
export function formatCurrency(amount, langCode = 'en') {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  try {
    const locale = getLocale(langCode);
    const formatted = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(amount);
    return `₹${formatted}`;
  } catch {
    return `₹${amount}`;
  }
}

/**
 * Format date by locale
 */
export function formatDate(date, langCode = 'en', options = {}) {
  if (!date) return '';
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const locale = getLocale(langCode);
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    };
    return new Intl.DateTimeFormat(locale, defaultOptions).format(d);
  } catch {
    return String(date);
  }
}

