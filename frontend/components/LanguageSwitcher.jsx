'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function LanguageSwitcher({
  compact = false,
  className = '',
  align = 'right',
  direction = 'down'
}) {
  const { language, currentLanguage, languages, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const isUp = direction === 'up';
  const isLeft = align === 'left';

  return (
    <div ref={containerRef} className={`relative z-[90] inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('switcher.label', {}, 'Language')}
        className={`group inline-flex items-center gap-2 rounded-full border border-parchment/25 bg-ink/90 px-3.5 py-1.5 text-xs font-medium text-parchment transition-all hover:border-brass-bright hover:bg-ink hover:text-brass-bright focus:outline-none focus:ring-1 focus:ring-brass-bright cursor-pointer shadow-sm active:scale-95 ${
          isOpen ? 'border-brass-bright text-brass-bright ring-1 ring-brass-bright/50' : ''
        }`}
      >
        <Globe className="h-3.5 w-3.5 text-brass-bright transition-transform duration-300 group-hover:rotate-45" />
        <span className="font-semibold tracking-wide">
          {compact ? currentLanguage.nativeName : `${currentLanguage.nativeName} (${currentLanguage.englishName})`}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-fog/70 transition-transform duration-200 group-hover:text-brass-bright ${
            isOpen ? 'rotate-180 text-brass-bright' : ''
          }`}
        />
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: isUp ? -8 : 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isUp ? -6 : 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="listbox"
            className={`absolute ${
              isLeft ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
            } ${
              isUp ? 'bottom-full mb-2 origin-bottom-right' : 'top-full mt-2 origin-top-right'
            } w-72 sm:w-80 max-w-[calc(100vw-24px)] rounded-2xl border-2 border-brass-bright/40 p-2 shadow-[0_25px_60px_rgba(0,0,0,0.98),0_0_24px_rgba(212,160,52,0.25)] z-[9999] text-parchment ring-1 ring-brass-bright/30`}
            style={{ backgroundColor: '#0c1322', opacity: 1 }}
          >
            {/* Header / Subtitle */}
            <div className="px-3.5 py-2.5 border-b border-parchment/15 mb-1.5 flex items-center justify-between gap-2">
              <span className="font-mono text-[0.7rem] uppercase tracking-wider text-brass-bright font-semibold truncate">
                {t('switcher.label', {}, 'Language')}
              </span>
              <span className="text-[0.62rem] font-mono text-fog/80 px-2 py-0.5 rounded-full bg-parchment/10 shrink-0 whitespace-nowrap">
                {languages.length} {t('nav.routes', {}, 'routes')}
              </span>
            </div>

            {/* Language Options List with custom sleek scrollbar */}
            <div className="space-y-1 max-h-72 sm:max-h-80 overflow-y-auto pr-1">
              {languages.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-brass-bright/20 text-brass-bright border border-brass-bright/60 shadow-sm'
                        : 'text-parchment/80 hover:bg-parchment/15 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tracking-wide text-parchment">
                          {lang.nativeName}
                        </span>
                        {lang.code !== 'en' && (
                          <span className="text-xs text-parchment/60 font-normal">
                            ({lang.englishName})
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[0.62rem] text-fog/70 uppercase tracking-wider mt-0.5">
                        {lang.script} script
                      </span>
                    </div>

                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brass-bright text-ink-deep shrink-0 shadow-xs">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

