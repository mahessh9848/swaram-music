import { motion } from 'framer-motion';
import {
  CloudRain, Sun, Leaf, Heart, Zap, Waves, Moon, MapPin,
} from 'lucide-react';
import { getFocalPosition } from '../data/moods';

const ICON_MAP = {
  CloudRain, Sun, Leaf, Heart, Zap, Waves, Moon, MapPin,
};

/**
 * MoodCard — compact interactive card for mood selection.
 * Fully theme-aware with clear active state and responsive focal thumbnail.
 */
export default function MoodCard({ mood, isActive, index, onSelect }) {
  const Icon = ICON_MAP[mood.icon] || CloudRain;

  return (
    <motion.button
      key={mood.id}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      onClick={() => onSelect(mood.id)}
      className="group relative overflow-hidden rounded-xl aspect-[16/11] sm:aspect-[4/3] cursor-pointer text-left transition-all duration-300"
      style={{
        boxShadow: isActive ? '0 10px 25px -5px rgba(0,0,0,0.3)' : 'none',
        outline: isActive ? '2px solid var(--accent-btn)' : '1px solid var(--border-card)',
        outlineOffset: '0px',
      }}
      aria-label={`Select ${mood.name} mood`}
      aria-pressed={isActive}
    >
      {/* Background artwork thumbnail */}
      <img
        src={mood.background}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ objectPosition: getFocalPosition(mood.backgroundPosition) }}
        loading="lazy"
      />

      {/* Translucent overlay */}
      <div
        className={`
          absolute inset-0 transition-colors duration-300
          ${isActive
            ? 'bg-black/40'
            : 'bg-black/55 group-hover:bg-black/45'
          }
        `}
      />

      {/* Card Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
        <Icon
          size={18}
          strokeWidth={1.5}
          className={`mb-1.5 transition-colors duration-200 ${
            isActive ? 'text-cream' : 'text-swaram-white/70 group-hover:text-swaram-white'
          }`}
        />
        <span
          className={`font-display text-base sm:text-lg font-medium tracking-tight transition-colors duration-200 ${
            isActive ? 'text-cream' : 'text-swaram-white group-hover:text-swaram-white'
          }`}
        >
          {mood.name}
        </span>
        <span className="text-[10px] text-swaram-white/50 mt-0.5 font-light">
          {mood.playlist?.songs?.length || 0} tracks
        </span>
      </div>

      {/* Subtle active indicator dot */}
      {isActive && (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-cream/25 backdrop-blur-sm border border-cream/40">
          <span className="w-1.5 h-1.5 rounded-full bg-cream" />
          <span className="text-[8px] uppercase tracking-wider text-cream font-medium">Active</span>
        </div>
      )}
    </motion.button>
  );
}
