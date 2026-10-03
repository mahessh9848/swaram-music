import { motion } from 'framer-motion';
import {
  CloudRain, Sun, Leaf, Heart, Zap, Waves, Moon, MapPin,
} from 'lucide-react';

const ICON_MAP = {
  CloudRain, Sun, Leaf, Heart, Zap, Waves, Moon, MapPin,
};

/**
 * MoodLabel — Minimal, editorial mood typography in hero negative space.
 * Proportional font sizing avoiding the zoomed appearance.
 */
export default function MoodLabel({ mood }) {
  const isLeft = mood.contentAlign === 'left';
  const Icon = ICON_MAP[mood.icon] || CloudRain;

  return (
    <motion.div
      key={mood.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`
        absolute top-20 sm:top-24 md:top-28 lg:top-32 z-10 max-w-xs sm:max-w-sm px-6
        ${isLeft
          ? 'left-4 sm:left-10 md:left-14 lg:left-20 text-left'
          : 'right-4 sm:right-10 md:right-14 lg:right-20 text-right'
        }
      `}
    >
      {/* Small uppercase category label */}
      <div className={`flex items-center gap-1.5 mb-2 ${isLeft ? 'justify-start' : 'justify-end'}`}>
        <Icon size={13} strokeWidth={1.5} className="text-cream/70" />
        <span
          className="text-[10px] tracking-[0.25em] uppercase font-medium text-cream/70"
        >
          {mood.label || 'CURRENT MOOD'}
        </span>
      </div>

      {/* Mood name — editorial serif */}
      <h2
        className="font-display text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-2 text-swaram-white drop-shadow-sm"
      >
        {mood.name}
      </h2>

      {/* Supporting text */}
      <p
        className="text-xs sm:text-sm font-light leading-relaxed text-swaram-white/60 drop-shadow-sm max-w-[280px] sm:max-w-xs ml-auto"
        style={{ marginLeft: isLeft ? '0' : 'auto' }}
      >
        {mood.tagline}
      </p>
    </motion.div>
  );
}
