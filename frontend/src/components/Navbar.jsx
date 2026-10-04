import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, LogOut, ChevronDown } from 'lucide-react';
import { BRAND, NAV_LINKS } from '../data/moods';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';

export default function Navbar({ auth, theme, toggleTheme, language, setLanguage }) {
  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const { user, isAuthenticated, openLoginModal, logout } = auth;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-3 md:px-8 lg:px-12 transition-all duration-300 backdrop-blur-xl"
      style={{
        background: scrolled ? 'var(--glass-nav)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        boxShadow: scrolled ? '0 10px 30px -10px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      {/* Brand */}
      <div className="flex flex-col">
        <a href="#home" className="flex items-center gap-2">
          {/* Logo audio bars */}
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="opacity-90" style={{ color: 'var(--text-primary)' }}>
            <rect x="4" y="14" width="2.5" height="10" rx="1.25" fill="currentColor" opacity="0.5" />
            <rect x="9" y="8" width="2.5" height="16" rx="1.25" fill="currentColor" opacity="0.75" />
            <rect x="14" y="5" width="2.5" height="22" rx="1.25" fill="currentColor" />
            <rect x="19" y="9" width="2.5" height="14" rx="1.25" fill="currentColor" opacity="0.75" />
            <rect x="24" y="12" width="2.5" height="8" rx="1.25" fill="currentColor" opacity="0.5" />
          </svg>
          <div>
            <h1
              className="font-display text-base md:text-lg font-medium tracking-[0.18em] leading-none"
              style={{ color: 'var(--text-primary)' }}
            >
              {BRAND.name}
            </h1>
            <p
              className="text-[9px] tracking-wide font-light mt-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              {BRAND.tagline}
            </p>
          </div>
        </a>
      </div>

      {/* Navigation — desktop */}
      <nav
        className="hidden md:flex items-center gap-7"
        aria-label="Main navigation"
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-xs font-medium tracking-wide transition-colors duration-200 relative group py-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {link.label}
            <span
              className="absolute -bottom-0.5 left-0 w-0 h-[1px] transition-all duration-200 group-hover:w-full"
              style={{ background: 'var(--text-primary)' }}
            />
          </a>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Selector */}
        <LanguageSelector language={language} setLanguage={setLanguage} />

        {/* Theme Toggle Button */}
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

        <button
          aria-label="Search"
          className="p-2 rounded-full transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <Search size={15} strokeWidth={1.5} />
        </button>

        {/* Authentication State */}
        {isAuthenticated ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              aria-label="Account menu"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors"
              style={{
                border: '1px solid var(--border-card)',
                background: 'var(--active-item)',
                color: 'var(--text-primary)',
              }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                style={{ background: 'var(--border-card)', color: 'var(--text-primary)' }}
              >
                <User size={12} strokeWidth={1.5} />
              </span>
              <span className="hidden sm:inline">{user?.name || 'Demo User'}</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl p-2 shadow-2xl backdrop-blur-xl z-50"
                  style={{
                    background: 'var(--modal-bg)',
                    border: '1px solid var(--modal-border)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <div
                    className="px-2.5 py-1.5 mb-1"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                    <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                  >
                    <LogOut size={13} />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button
            onClick={openLoginModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200"
            style={{
              background: 'var(--active-item)',
              border: '1px solid var(--border-card)',
              color: 'var(--text-primary)',
            }}
            aria-label="Sign in"
          >
            <User size={13} strokeWidth={1.5} />
            Sign In
          </button>
        )}
      </div>
    </motion.header>
  );
}
