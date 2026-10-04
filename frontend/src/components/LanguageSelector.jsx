import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { LANGUAGES } from '../data/languages';

/**
 * LanguageSelector — Compact, elegant language selector for Swaram.
 * Options: Telugu, Hindi, English.
 * Styled with Swaram's minimalist glassmorphism and subtle theme tokens.
 */
export default function LanguageSelector({ language, setLanguage, variant = 'nav' }) {
  if (variant === 'pills') {
    return (
      <div className="flex items-center gap-1.5 p-1 rounded-2xl transition-colors backdrop-blur-md"
        style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
        }}
        role="radiogroup"
        aria-label="Select language"
      >
        <div className="flex items-center gap-1 pl-2.5 pr-1.5 py-1 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          <Globe size={13} strokeWidth={1.5} />
          <span className="text-[11px] tracking-wider uppercase">Language</span>
        </div>
        <div className="flex items-center gap-1">
          {LANGUAGES.map((lang) => {
            const isActive = language === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                role="radio"
                aria-checked={isActive}
                className="relative px-3 py-1 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer"
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-language-pill"
                    className="absolute inset-0 rounded-xl shadow-sm"
                    style={{
                      background: 'var(--active-item)',
                      border: '1px solid var(--border-card)',
                    }}
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{lang.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Default navbar variant: clean dropdown / inline toggle
  return (
    <div
      className="inline-flex items-center gap-0.5 p-0.5 rounded-full backdrop-blur-md transition-colors"
      style={{
        background: 'var(--hover-item)',
        border: '1px solid var(--border-subtle)',
      }}
      role="radiogroup"
      aria-label="Select language"
    >
      {LANGUAGES.map((lang) => {
        const isActive = language === lang.id;
        return (
          <button
            key={lang.id}
            onClick={() => setLanguage(lang.id)}
            role="radio"
            aria-checked={isActive}
            className="relative px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer"
            style={{
              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
            }}
          >
            {isActive && (
              <motion.div
                layoutId="active-nav-language-pill"
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'var(--active-item)',
                  border: '1px solid var(--border-card)',
                }}
                transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{lang.label}</span>
          </button>
        );
      })}
    </div>
  );
}
