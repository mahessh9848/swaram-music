import { motion } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Heart, Music2, Loader2,
} from 'lucide-react';
import VolumeControl from './VolumeControl';

/**
 * MusicPlayer — Proportionally balanced, fixed floating player.
 * Supports DIRECT_AUDIO with real time tracking, seeking, volume, and responsive mobile layout.
 * Fully theme-aware for light and dark modes.
 */
export default function MusicPlayer({ player }) {
  const {
    currentSong,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    progress,
    volume,
    isFavorited,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleFavorite,
  } = player;

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const seekPercent = Number(e.target.value);
    const seekTime = (seekPercent / 100) * duration;
    seek(seekTime);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
      className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-1 sm:px-6 sm:pb-4 sm:pt-1 pointer-events-none"
    >
      <div
        className="mx-auto max-w-4xl rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 flex items-center gap-3 sm:gap-4 pointer-events-auto shadow-2xl transition-all backdrop-blur-xl"
        style={{
          background: 'var(--glass-player)',
          border: '1px solid var(--glass-player-border)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Track Thumbnail & Info — Left */}
        <div className="flex items-center gap-3 min-w-0 w-36 sm:w-48 shrink-0">
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors"
            style={{
              background: 'var(--hover-item)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {isLoading ? (
              <Loader2 size={15} className="animate-spin opacity-70" />
            ) : (
              <Music2 size={15} className="opacity-70" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
              {currentSong?.title || 'Select a song'}
            </p>
            <p className="text-[10px] sm:text-xs truncate" style={{ color: 'var(--text-muted)' }}>
              {currentSong?.artist || 'Swaram Music'}
            </p>
          </div>
        </div>

        {/* Center Controls & Progress */}
        <div className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              onClick={previous}
              aria-label="Previous"
              className="p-1.5 opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--text-primary)' }}
            >
              <SkipBack size={14} strokeWidth={1.5} />
            </button>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              disabled={!currentSong?.sourceUrl}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 shadow-sm"
              style={{
                background: 'var(--accent-btn)',
                color: 'var(--accent-btn-text)',
              }}
            >
              {isLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : isPlaying ? (
                <Pause size={14} strokeWidth={2} />
              ) : (
                <Play size={14} strokeWidth={2} className="ml-0.5" />
              )}
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="p-1.5 opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--text-primary)' }}
            >
              <SkipForward size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* Current Time */}
          <span
            className="text-[10px] w-7 text-right tabular-nums shrink-0 hidden sm:block"
            style={{ color: 'var(--text-muted)' }}
          >
            {formatTime(currentTime)}
          </span>

          {/* Seek Bar */}
          <div className="flex-1 relative min-w-0">
            <input
              type="range"
              min="0"
              max="100"
              value={progress || 0}
              onChange={handleSeek}
              className="w-full h-1 cursor-pointer"
              aria-label="Seek"
              style={{
                background: `linear-gradient(to right, var(--accent-btn) 0%, var(--accent-btn) ${progress}%, var(--border-card) ${progress}%, var(--border-card) 100%)`,
              }}
            />
          </div>

          {/* Duration */}
          <span
            className="text-[10px] w-7 tabular-nums shrink-0 hidden sm:block"
            style={{ color: 'var(--text-muted)' }}
          >
            {formatTime(duration)}
          </span>
        </div>

        {/* Right Side: Favorite & Volume Controls */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            onClick={toggleFavorite}
            aria-label={isFavorited ? 'Remove favorite' : 'Add to favorite'}
            className="p-1.5 transition-colors"
          >
            <Heart
              size={15}
              strokeWidth={1.5}
              className={
                isFavorited
                  ? 'text-red-500 fill-red-500'
                  : 'opacity-50 hover:opacity-100'
              }
              style={!isFavorited ? { color: 'var(--text-primary)' } : {}}
            />
          </button>
          <VolumeControl volume={volume} onChange={setVolume} onToggleMute={toggleMute} />
        </div>
      </div>
    </motion.div>
  );
}
