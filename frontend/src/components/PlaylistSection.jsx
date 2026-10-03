import { motion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';
import SongCard from './SongCard';

/**
 * PlaylistSection — Section 3: Recommended for this mood.
 * Minimalist track list with refined padding and typography.
 * Displays dedicated empty state when a mood (e.g. Romantic) has no preset tracks.
 */
export default function PlaylistSection({ mood, player }) {
  const { playlist } = mood;
  const { currentSong, isPlaying, playFromIndex, loadQueue, queue } = player;

  const handlePlaySong = (index) => {
    if (queue.length === 0 || queue[0]?.id !== playlist.songs[0]?.id) {
      loadQueue(playlist.songs, index);
      setTimeout(() => player.play(), 50);
    } else {
      playFromIndex(index);
    }
  };

  return (
    <section
      id="playlists"
      className="relative z-10 py-12 md:py-16 px-4 sm:px-6 lg:px-8 scroll-mt-16 transition-colors"
    >
      <span id="playlist" className="sr-only" />
      <div className="w-full max-w-5xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-10"
        >
          <span
            className="text-[10px] tracking-[0.2em] uppercase font-medium block mb-1"
            style={{ color: 'var(--text-muted)' }}
          >
            Recommended for this mood
          </span>
          <h2
            className="font-display text-2xl sm:text-3xl font-medium tracking-tight mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {playlist.title}
          </h2>
          <p className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>
            {playlist.songs.length > 0
              ? `${playlist.songs.length} curated track${playlist.songs.length > 1 ? 's' : ''} · ${mood.name} atmosphere`
              : `Personalize your ${mood.name} atmosphere`}
          </p>
        </motion.div>

        {/* Song list or empty state */}
        {playlist.songs.length === 0 ? (
          <div
            className="p-8 sm:p-10 rounded-2xl text-center transition-colors"
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ background: 'var(--hover-item)', color: 'var(--text-muted)' }}
            >
              <Heart size={18} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              No songs yet
            </p>
            <p className="text-xs font-light max-w-sm mx-auto mb-5" style={{ color: 'var(--text-muted)' }}>
              Add music to build this playlist. Import an MP3 to your library.
            </p>
            <a
              href="#library"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all"
              style={{
                border: '1px solid var(--border-card)',
                background: 'var(--active-item)',
                color: 'var(--text-primary)',
              }}
            >
              <Plus size={14} />
              Import MP3 to Library
            </a>
          </div>
        ) : (
          <div className="space-y-1">
            {playlist.songs.map((song, i) => (
              <SongCard
                key={song.id}
                song={song}
                index={i}
                isCurrentSong={currentSong?.id === song.id}
                isPlaying={isPlaying}
                onPlay={handlePlaySong}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
