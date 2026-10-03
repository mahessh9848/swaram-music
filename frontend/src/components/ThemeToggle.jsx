import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, toggleTheme }) {
  const isLight = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      className="p-2 rounded-full transition-all duration-300 text-swaram-text-secondary hover:text-swaram-text-primary hover:bg-white/10 dark:hover:bg-white/5 active:scale-95"
    >
      {isLight ? (
        <Moon size={16} strokeWidth={1.75} className="text-amber-900 transition-transform duration-300 rotate-0" />
      ) : (
        <Sun size={16} strokeWidth={1.75} className="text-cream transition-transform duration-300 rotate-0" />
      )}
    </button>
  );
}
