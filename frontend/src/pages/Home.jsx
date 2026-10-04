import { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MOODS, getMoodById } from '../data/moods';
import Navbar from '../components/Navbar';
import MoodHero from '../components/MoodHero';
import MoodLabel from '../components/MoodLabel';
import MoodSelector from '../components/MoodSelector';
import PlaylistSection from '../components/PlaylistSection';
import MusicLibrary from '../components/MusicLibrary';
import MusicPlayer from '../components/MusicPlayer';
import LoginModal from '../components/LoginModal';
import Footer from '../components/Footer';
import { usePlayer } from '../hooks/usePlayer';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { getAllImportedTracks } from '../storage/musicStorage';

/**
 * Home — Refined Swaram Experience with Language Selection & Mood Discovery.
 *
 * Page Architecture:
 * - Fixed background: Zero-flash layered crossfade MoodHero
 * - Fixed navbar with theme switcher, language selector, demo login, and account state
 * - Section 1: Hero (full-viewport background artwork + minimal editorial mood typography)
 * - Section 2: Mood Selector (compact, non-zoomed 8-mood visual grid + inline language pills)
 * - Section 3: Recommended for this mood + language (curated tracks from real MP3s)
 * - Section 4: Your Library (Local MP3 imports with language metadata & IndexedDB persistence)
 * - Section 5: Minimal Footer
 * - Fixed bottom: Proportionately balanced floating MusicPlayer
 */
export default function Home() {
  const [activeMoodId, setActiveMoodId] = useState('sad');
  const [localTracks, setLocalTracks] = useState([]);
  const mood = getMoodById(activeMoodId);
  const player = usePlayer();
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  // Load persistent local MP3 tracks from IndexedDB on startup
  useEffect(() => {
    getAllImportedTracks().then((tracks) => {
      if (tracks && tracks.length > 0) {
        setLocalTracks(tracks);
      }
    });
  }, []);

  // Filter mood playlist by active language
  const currentMoodSongs = useMemo(() => {
    if (!mood?.playlist?.songs) return [];
    return mood.playlist.songs.filter(
      (song) => !song.language || song.language === language
    );
  }, [mood, language]);

  // Load the mood's filtered playlist into the player queue when mood or language changes
  useEffect(() => {
    if (currentMoodSongs.length > 0) {
      player.loadQueue(currentMoodSongs);
    } else {
      player.loadQueue([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMoodId, language]);

  const handleMoodSelect = useCallback((moodId) => {
    if (moodId === activeMoodId) return;
    setActiveMoodId(moodId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeMoodId]);

  return (
    <>
      {/* Fixed background artwork layer with zero-flash crossfade */}
      <MoodHero mood={mood} />

      {/* Fixed navigation layer with theme toggle and language selector */}
      <Navbar
        auth={auth}
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Naturally scrollable content wrapper */}
      <div className="relative z-10">
        {/* Section 1: Hero — allows the artwork to be the hero */}
        <section
          id="home"
          className="relative min-h-[100svh] flex items-end"
          aria-label="Current mood hero"
        >
          {/* Mood label dynamically positioned based on artwork composition */}
          <AnimatePresence mode="wait">
            <MoodLabel key={mood.id} mood={mood} />
          </AnimatePresence>

          {/* Subtle scroll indicator */}
          <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40 hover:opacity-80 transition-opacity">
            <span className="text-[9px] tracking-[0.2em] uppercase text-swaram-white/70">
              Scroll to explore
            </span>
            <div className="w-[1px] h-6 bg-gradient-to-b from-swaram-white/40 to-transparent" />
          </div>
        </section>

        {/* Seamless gradient transition from artwork to content */}
        <div
          className="relative h-24 md:h-36 -mt-24 md:-mt-36 z-10 pointer-events-none transition-all duration-300"
          style={{
            background: 'var(--hero-gradient)',
          }}
          aria-hidden="true"
        />

        {/* Content Body with theme background */}
        <div
          className="relative transition-colors duration-300"
          style={{ background: 'var(--bg-content)' }}
        >
          {/* Section 2: Choose your mood & Language selection */}
          <MoodSelector
            moods={MOODS}
            activeMoodId={activeMoodId}
            onSelect={handleMoodSelect}
            language={language}
            setLanguage={setLanguage}
          />

          {/* Section 3: Recommended for this mood + language */}
          <PlaylistSection
            mood={mood}
            language={language}
            player={player}
          />

          {/* Section 4: Your Library (Local MP3 Upload & Management) */}
          <MusicLibrary
            localTracks={localTracks}
            setLocalTracks={setLocalTracks}
            player={player}
            language={language}
          />

          {/* Section 5: Minimal Footer */}
          <Footer />

          {/* Spacer to prevent fixed music player from overlapping footer content */}
          <div className="h-24 sm:h-28" aria-hidden="true" />
        </div>
      </div>

      {/* Fixed Music Player — always accessible while scrolling */}
      <MusicPlayer player={player} />

      {/* Demo Authentication Modal */}
      <LoginModal
        isOpen={auth.isLoginModalOpen}
        onClose={auth.closeLoginModal}
        onLoginSuccess={auth.login}
      />
    </>
  );
}
