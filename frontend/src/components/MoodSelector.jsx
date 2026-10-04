import { motion } from 'framer-motion';
import MoodCard from './MoodCard';
import LanguageSelector from './LanguageSelector';

/**
 * MoodSelector — Section 2: Choose your mood.
 * Compact, secondary to the artwork, with restrained typography and padding.
 * Includes inline language toggle for quick seamless access.
 */
export default function MoodSelector({ moods, activeMoodId, onSelect, language, setLanguage }) {
  return (
    <section id="moods" className="relative z-10 py-12 md:py-16 px-4 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="w-full max-w-5xl mx-auto">
        {/* Section Heading with Language Selector */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10"
        >
          <div>
            <h2
              className="font-display text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight mb-1.5"
              style={{ color: 'var(--text-primary)' }}
            >
              Choose your mood.
            </h2>
            <p className="text-xs sm:text-sm font-light" style={{ color: 'var(--text-muted)' }}>
              Music for the moment.
            </p>
          </div>

          {/* Language Selector Pills */}
          <div className="self-start sm:self-auto">
            <LanguageSelector language={language} setLanguage={setLanguage} variant="pills" />
          </div>
        </motion.div>

        {/* Compact Mood Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {moods.map((mood, i) => (
            <MoodCard
              key={mood.id}
              mood={mood}
              index={i}
              isActive={mood.id === activeMoodId}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
