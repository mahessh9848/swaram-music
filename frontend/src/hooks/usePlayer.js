import { useState, useCallback, useRef, useEffect } from 'react';
import { audioEngine } from '../player/audioEngine';

/**
 * usePlayer — manages real audio playback via the Swaram AudioEngine.
 *
 * Features:
 * - Real play/pause/skip/seek
 * - Real volume and mute controls
 * - Event-driven time, duration, and buffering updates
 * - Queue management and auto-advance
 * - Persistent favorites state
 */
export function usePlayer() {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(80);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isPlayingRef = useRef(false);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const currentSong = queue[currentIndex] || null;

  // Subscribe to AudioEngine events
  useEffect(() => {
    const unsubTime = audioEngine.on('timeupdate', (t) => setCurrentTime(t));
    const unsubDur = audioEngine.on('durationchange', (d) => setDuration(d));
    const unsubPlaying = audioEngine.on('playing', () => {
      setIsPlaying(true);
      setIsLoading(false);
    });
    const unsubPaused = audioEngine.on('paused', () => setIsPlaying(false));
    const unsubBuffering = audioEngine.on('buffering', (loading) => setIsLoading(loading));
    const unsubCanPlay = audioEngine.on('canplay', () => setIsLoading(false));
    const unsubError = audioEngine.on('error', () => setIsLoading(false));
    const unsubEnded = audioEngine.on('ended', () => {
      // Auto-advance
      setCurrentIndex((prev) => {
        if (queue.length <= 1) return prev;
        return (prev + 1) % queue.length;
      });
    });

    return () => {
      unsubTime();
      unsubDur();
      unsubPlaying();
      unsubPaused();
      unsubBuffering();
      unsubCanPlay();
      unsubError();
      unsubEnded();
    };
  }, [queue.length]);

  // Handle track loading when currentIndex or queue changes
  useEffect(() => {
    const song = queue[currentIndex];
    if (!song) {
      audioEngine.loadTrack(null);
      setCurrentTime(0);
      setDuration(0);
      setIsLoading(false);
      return;
    }

    if (song.sourceUrl) {
      setIsLoading(true);
      setCurrentTime(0);
      setDuration(song.duration || 0);
      audioEngine.loadTrack(song);

      if (isPlayingRef.current) {
        audioEngine.play();
      }
    } else {
      audioEngine.loadTrack(null);
      setCurrentTime(0);
      setDuration(0);
      setIsLoading(false);
    }
  }, [currentIndex, queue]);

  const play = useCallback(() => {
    if (!currentSong) return;
    if (currentSong.sourceUrl) {
      audioEngine.loadTrack(currentSong);
      audioEngine.play();
    }
    setIsPlaying(true);
  }, [currentSong]);

  const pause = useCallback(() => {
    audioEngine.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const next = useCallback(() => {
    if (queue.length === 0) return;
    const wasPlaying = isPlaying;
    setCurrentIndex((prev) => (prev + 1) % queue.length);
    if (wasPlaying) {
      setIsPlaying(true);
    }
  }, [queue.length, isPlaying]);

  const previous = useCallback(() => {
    if (queue.length === 0) return;
    if (audioEngine.getCurrentTime() > 3) {
      audioEngine.seek(0);
      setCurrentTime(0);
      return;
    }
    const wasPlaying = isPlaying;
    setCurrentIndex((prev) => (prev - 1 + queue.length) % queue.length);
    if (wasPlaying) {
      setIsPlaying(true);
    }
  }, [queue.length, isPlaying]);

  const seek = useCallback((timeInSeconds) => {
    if (isFinite(timeInSeconds)) {
      audioEngine.seek(timeInSeconds);
      setCurrentTime(timeInSeconds);
    }
  }, []);

  const setVolume = useCallback((val) => {
    setVolumeState(val);
    audioEngine.setVolume(val);
  }, []);

  const toggleMute = useCallback(() => {
    audioEngine.toggleMute();
    setVolumeState(audioEngine.audio.volume * 100);
  }, []);

  const toggleFavorite = useCallback(() => {
    setIsFavorited((prev) => !prev);
  }, []);

  const loadQueue = useCallback((songs, startIndex = 0) => {
    audioEngine.pause();
    setQueue(songs || []);
    setCurrentIndex(startIndex);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const playFromIndex = useCallback((index) => {
    if (index >= 0 && index < queue.length) {
      setCurrentIndex(index);
      setIsPlaying(true);
      const song = queue[index];
      if (song?.sourceUrl) {
        audioEngine.loadTrack(song);
        audioEngine.play();
      }
    }
  }, [queue]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  /**
   * Rename a song title in the active queue without restarting playback.
   * Used when a local song is renamed while the player is active.
   */
  const renameSongInQueue = useCallback((trackId, newTitle) => {
    setQueue((prev) =>
      prev.map((s) => (s.id === trackId ? { ...s, title: newTitle } : s))
    );
  }, []);

  return {
    currentSong,
    queue,
    currentIndex,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    progress,
    volume,
    isFavorited,
    play,
    pause,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleFavorite,
    loadQueue,
    playFromIndex,
    renameSongInQueue,
  };
}
