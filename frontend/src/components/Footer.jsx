import { BRAND, NAV_LINKS } from '../data/moods';

const CURRENT_YEAR = 2026;

/**
 * Footer — Extremely minimal Swaram footer without marketing clutter.
 * Theme-aware.
 */
export default function Footer() {
  return (
    <footer
      id="about"
      className="relative z-10 py-10 md:py-14 px-4 sm:px-6 lg:px-8 scroll-mt-16 transition-colors"
      style={{ borderTop: '1px solid var(--border-subtle)' }}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Brand */}
        <div>
          <h3
            className="font-display text-base font-medium tracking-[0.15em] mb-0.5"
            style={{ color: 'var(--text-primary)' }}
          >
            {BRAND.name}
          </h3>
          <p className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>
            {BRAND.tagline}
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs transition-colors duration-200 tracking-wide hover:opacity-100 opacity-60"
              style={{ color: 'var(--text-primary)' }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-[11px] font-light" style={{ color: 'var(--text-muted)' }}>
          © {CURRENT_YEAR} Swaram
        </p>
      </div>
    </footer>
  );
}

