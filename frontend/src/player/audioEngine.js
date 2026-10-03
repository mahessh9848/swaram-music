/**
 * AudioEngine — Clean, resilient HTML5 Audio abstraction for Swaram.
 *
 * Provides a unified API for:
 * - Playback control (play, pause, seek)
 * - Volume and mute management
 * - Event bus (timeupdate, durationchange, ended, waiting, playing, error)
 * - Safe handling of browser auto-play policies and interruption states
 */

export class AudioEngine {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.listeners = new Map();
    this.currentTrack = null;
    this.isMuted = false;
    this.previousVolume = 80;

    this._bindNativeEvents();
  }

  _bindNativeEvents() {
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
      this.emit('canplay');
    });

    this.audio.addEventListener('waiting', () => {
      this.emit('buffering', true);
    });

    this.audio.addEventListener('playing', () => {
      this.emit('buffering', false);
      this.emit('playing');
    });

    this.audio.addEventListener('pause', () => {
      this.emit('paused');
    });

    this.audio.addEventListener('ended', () => {
      this.emit('ended');
    });

    this.audio.addEventListener('error', (e) => {
      this.emit('buffering', false);
      if (this.audio.src && !this.audio.src.endsWith('/') && this.audio.src !== window.location.href) {
        console.warn('[AudioEngine] Playback error for URL:', this.audio.src);
      }
      this.emit('error', e);
    });
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
          console.error(`[AudioEngine] Listener error on '${event}':`, err);
        }
      }
    }
  }

  loadTrack(track) {
    this.currentTrack = track;
    if (track?.sourceUrl) {
      if (this.audio.src !== track.sourceUrl && !this.audio.src.endsWith(track.sourceUrl)) {
        this.audio.src = track.sourceUrl;
        this.audio.load();
      }
    } else {
      this.audio.removeAttribute('src');
    }
  }

  async play() {
    if (!this.audio.src) return;
    try {
      await this.audio.play();
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('[AudioEngine] Play request prevented by policy:', err.message);
      }
    }
  }

  pause() {
    this.audio.pause();
  }

  seek(seconds) {
    if (this.audio.src && isFinite(seconds)) {
      this.audio.currentTime = Math.max(0, seconds);
    }
  }

  setVolume(percent) {
    const clamped = Math.max(0, Math.min(100, percent));
    this.audio.volume = clamped / 100;
    if (clamped > 0) {
      this.previousVolume = clamped;
      this.isMuted = false;
    } else {
      this.isMuted = true;
    }
    this.emit('volumechange', clamped);
  }

  toggleMute() {
    if (this.isMuted || this.audio.volume === 0) {
      this.setVolume(this.previousVolume || 80);
    } else {
      this.setVolume(0);
    }
  }

  getCurrentTime() {
    return this.audio.currentTime;
  }

  getDuration() {
    return this.audio.duration && isFinite(this.audio.duration) ? this.audio.duration : 0;
  }

  destroy() {
    this.audio.pause();
    this.audio.removeAttribute('src');
    this.listeners.clear();
  }
}

// Export singleton instance
export const audioEngine = new AudioEngine();
