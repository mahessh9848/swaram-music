import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

/**
 * SongCard — an individual song row in the mood playlist.
 * Fully theme-aware with clean typography and interactive feedback.
 */
export default function SongCard({
  song,
  index,
  isCurrentSong,
  isPlaying,
  onPlay,
}) {
  const isCurrentlyPlaying = isCurrentSong && isPlaying;

  const formatDuration = (seconds) => {
    if (!seconds) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.button
      key={song.id}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      onClick={() => onPlay(index)}
      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 text-left group cursor-pointer"
      style={{
        background: isCurrentSong ? 'var(--active-item)' : 'transparent',
        border: isCurrentSong ? '1px solid var(--active-ring)' : '1px solid transparent',
      }}
      aria-label={`Play ${song.title} by ${song.artist}`}
    >
      {/* Track number / playing animation / play icon */}
      <div className="w-8 h-8 flex items-center justify-center shrink-0">
        {isCurrentlyPlaying ? (
          <div className="flex items-end gap-[3px] h-4">
            <span
              className="w-[3px] rounded-full animate-[equalizer_0.8s_ease-in-out_infinite]"
              style={{ height: '60%', background: 'var(--accent-btn)' }}
            />
            <span
              className="w-[3px] rounded-full animate-[equalizer_0.6s_ease-in-out_infinite_0.2s]"
              style={{ height: '100%', background: 'var(--accent-btn)' }}
            />
            <span
              className="w-[3px] rounded-full animate-[equalizer_0.7s_ease-in-out_infinite_0.1s]"
              style={{ height: '40%', background: 'var(--accent-btn)' }}
            />
          </div>
        ) : (
          <>
            <span
              className="text-xs font-medium group-hover:hidden transition-colors"
              style={{ color: isCurrentSong ? 'var(--text-primary)' : 'var(--text-muted)' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <Play
              size={14}
              strokeWidth={2}
              className="hidden group-hover:block ml-0.5"
              style={{ color: 'var(--text-primary)' }}
            />
          </>
        )}
      </div>

      {/* Song details */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate transition-colors"
          style={{ color: 'var(--text-primary)' }}
        >
          {song.title}
        </p>
        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {song.artist}
        </p>
      </div>

      {/* Duration */}
      <span className="text-xs tabular-nums shrink-0" style={{ color: 'var(--text-muted)' }}>
        {formatDuration(song.duration)}
      </span>
    </motion.button>
  );
}
