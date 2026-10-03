/**
 * Swaram Playback Adapters
 *
 * Provider-agnostic abstraction layer for audio playback.
 * Decouples the UI from the underlying audio engine.
 *
 * Supported Provider Types:
 * - DIRECT_AUDIO: HTML5 Audio for local and direct streaming files (.mp3, .wav, .ogg)
 * - YOUTUBE: Adapter stub for YouTube IFrame Player API
 * - SPOTIFY: Adapter stub for Spotify Web Playback SDK
 */

export const PROVIDER_TYPES = {
  DIRECT_AUDIO: 'DIRECT_AUDIO',
  YOUTUBE: 'YOUTUBE',
  SPOTIFY: 'SPOTIFY',
};

/**
 * Base Playback Adapter Interface
 */
export class PlaybackAdapter {
  constructor(options = {}) {
    this.options = options;
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, ...args) {
    if (this.listeners.has(event)) {
      for (const cb of this.listeners.get(event)) {
        try {
          cb(...args);
        } catch (err) {
          console.error(`[PlaybackAdapter] Error in event listener '${event}':`, err);
        }
      }
    }
  }

  load(_song) {
    throw new Error('Method load() must be implemented.');
  }

  play() {
    throw new Error('Method play() must be implemented.');
  }

  pause() {
    throw new Error('Method pause() must be implemented.');
  }

  seek(_seconds) {
    throw new Error('Method seek() must be implemented.');
  }

  setVolume(_percent) {
    throw new Error('Method setVolume() must be implemented.');
  }

  destroy() {
    this.listeners.clear();
  }
}

/**
 * DirectAudioAdapter — HTML5 Audio provider
 */
export class DirectAudioAdapter extends PlaybackAdapter {
  constructor(options = {}) {
    super(options);
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.currentSong = null;

    this._bindEvents();
  }

  _bindEvents() {
    this.audio.addEventListener('timeupdate', () => {
      this.emit('timeupdate', this.audio.currentTime);
    });

    this.audio.addEventListener('durationchange', () => {
      if (this.audio.duration && isFinite(this.audio.duration)) {
        this.emit('durationchange', this.audio.duration);
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio.duration && isFinite(this.audio.duration)) {
        this.emit('durationchange', this.audio.duration);
      }
    });

    this.audio.addEventListener('canplay', () => {
      this.emit('ready');
    });

    this.audio.addEventListener('waiting', () => {
      this.emit('loading', true);
    });

    this.audio.addEventListener('playing', () => {
      this.emit('loading', false);
      this.emit('playing');
    });

    this.audio.addEventListener('pause', () => {
      this.emit('paused');
    });

    this.audio.addEventListener('ended', () => {
      this.emit('ended');
    });

    this.audio.addEventListener('error', (e) => {
      this.emit('loading', false);
      console.warn('[DirectAudioAdapter] Playback error for:', this.audio.src);
      this.emit('error', e);
    });
  }

  load(song) {
    this.currentSong = song;
    if (song?.sourceUrl) {
      this.audio.src = song.sourceUrl;
      this.audio.load();
    } else {
      this.audio.src = '';
    }
  }

  async play() {
    if (!this.audio.src) return;
    try {
      await this.audio.play();
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('[DirectAudioAdapter] Auto-play was prevented or interrupted:', err);
      }
    }
  }

  pause() {
    this.audio.pause();
  }

  seek(seconds) {
    if (isFinite(seconds) && this.audio.src) {
      this.audio.currentTime = seconds;
    }
  }

  setVolume(percent) {
    this.audio.volume = Math.max(0, Math.min(1, percent / 100));
  }

  destroy() {
    super.destroy();
    this.audio.pause();
    this.audio.src = '';
  }
}

/**
 * YouTubeAdapter — Placeholder for future YouTube API integration
 */
export class YouTubeAdapter extends PlaybackAdapter {
  constructor(options = {}) {
    super(options);
    console.info('[YouTubeAdapter] Initialized in stub mode. Embed API key/player to activate.');
  }

  load(song) {
    console.info(`[YouTubeAdapter] Queued video: ${song.title} (${song.sourceId})`);
  }

  async play() {
    console.info('[YouTubeAdapter] Play triggered');
  }

  pause() {
    console.info('[YouTubeAdapter] Pause triggered');
  }

  seek(seconds) {
    console.info(`[YouTubeAdapter] Seek to ${seconds}s`);
  }

  setVolume(percent) {
    console.info(`[YouTubeAdapter] Set volume to ${percent}%`);
  }
}

/**
 * SpotifyAdapter — Placeholder for future Spotify Web Playback SDK integration
 */
export class SpotifyAdapter extends PlaybackAdapter {
  constructor(options = {}) {
    super(options);
    console.info('[SpotifyAdapter] Initialized in stub mode. Provide OAuth token to activate.');
  }

  load(song) {
    console.info(`[SpotifyAdapter] Queued track: ${song.title} (${song.sourceId})`);
  }

  async play() {
    console.info('[SpotifyAdapter] Play triggered');
  }

  pause() {
    console.info('[SpotifyAdapter] Pause triggered');
  }

  seek(seconds) {
    console.info(`[SpotifyAdapter] Seek to ${seconds}s`);
  }

  setVolume(percent) {
    console.info(`[SpotifyAdapter] Set volume to ${percent}%`);
  }
}

/**
 * Factory helper to get the appropriate adapter
 */
export function createPlaybackAdapter(type = PROVIDER_TYPES.DIRECT_AUDIO, options = {}) {
  switch (type) {
    case PROVIDER_TYPES.YOUTUBE:
      return new YouTubeAdapter(options);
    case PROVIDER_TYPES.SPOTIFY:
      return new SpotifyAdapter(options);
    case PROVIDER_TYPES.DIRECT_AUDIO:
    default:
      return new DirectAudioAdapter(options);
  }
}
