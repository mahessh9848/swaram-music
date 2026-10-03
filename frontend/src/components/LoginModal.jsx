import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

const DEMO_EMAIL = 'demo@swaram.local';
const DEMO_PASSWORD = 'Swaram@123';

/**
 * LoginModal — Minimalist translucent modal for demo authentication.
 * Fully theme-aware with accessible focus states.
 */
export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      if (
        email.trim().toLowerCase() === DEMO_EMAIL.toLowerCase() &&
        password === DEMO_PASSWORD
      ) {
        onLoginSuccess({
          email: DEMO_EMAIL,
          name: 'Demo User',
          rememberMe,
        });
        onClose();
        setEmail('');
        setPassword('');
      } else {
        setError('Invalid email or password.');
      }
      setIsSubmitting(false);
    }, 300);
  };

  const handleQuickFill = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-sm rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl"
          style={{
            background: 'var(--modal-bg)',
            border: '1px solid var(--modal-border)',
            color: 'var(--text-primary)',
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 p-1.5 rounded-full opacity-50 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            <X size={16} strokeWidth={1.5} />
          </button>

          {/* Header */}
          <div className="mb-6 text-center">
            <h2
              className="font-display text-2xl font-medium tracking-tight mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              Welcome back
            </h2>
            <p className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>
              Sign in to save your moods & favorites.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-500"
            >
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-[11px] uppercase tracking-wider mb-1.5 font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40"
                  style={{ color: 'var(--text-primary)' }}
                />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@swaram.local"
                  className="w-full rounded-xl text-xs focus:outline-none transition-colors"
                  style={{
                    paddingLeft: '2.5rem',
                    paddingRight: '1rem',
                    paddingTop: '0.65rem',
                    paddingBottom: '0.65rem',
                    background: 'var(--modal-input)',
                    border: '1px solid var(--border-card)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-[11px] uppercase tracking-wider mb-1.5 font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
                  style={{ color: 'var(--text-primary)' }}
                />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl text-xs focus:outline-none transition-colors"
                  style={{
                    paddingLeft: '2.5rem',
                    paddingRight: '1rem',
                    paddingTop: '0.65rem',
                    paddingBottom: '0.65rem',
                    background: 'var(--modal-input)',
                    border: '1px solid var(--border-card)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label
                className="flex items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text-primary)' }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded cursor-pointer accent-amber-700 dark:accent-cream"
                />
                <span>Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 mt-2 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 disabled:opacity-60 shadow-sm"
              style={{
                background: 'var(--accent-btn)',
                color: 'var(--accent-btn-text)',
              }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Helper Hint */}
          <div
            className="mt-5 pt-4 text-center"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <button
              type="button"
              onClick={handleQuickFill}
              className="inline-flex items-center gap-1.5 text-[11px] opacity-70 hover:opacity-100 transition-opacity underline decoration-dotted"
              style={{ color: 'var(--text-primary)' }}
            >
              <Sparkles size={12} />
              Auto-fill demo credentials
            </button>
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              demo@swaram.local · Swaram@123
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
