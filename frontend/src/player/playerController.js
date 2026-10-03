import { createPlaybackAdapter, PROVIDER_TYPES } from './playbackAdapter';

/**
 * PlayerController
 *
 * Coordinates playback adapters, queue management, track transitions,
 * and state notifications for the UI.
 */
export class PlayerController {
  constructor() {
    this.adapters = new Map();
    this.currentAdapterType = PROVIDER_TYPES.DIRECT_AUDIO;
    this.activeAdapter = createPlaybackAdapter(this.currentAdapterType);
    this.queue = [];
    this.currentIndex = 0;
    this.volume = 80;
    this.subscribers = new Set();

    this._bindAdapterEvents(this.activeAdapter);
  }

  _bindAdapterEvents(adapter) {
    adapter.on('timeupdate', (time) => this._notify('timeupdate', time));
    adapter.on('durationchange', (dur) => this._notify('durationchange', dur));
    adapter.on('ready', () => this._notify('ready'));
    adapter.on('loading', (isLoading) => this._notify('loading', isLoading));
    adapter.on('playing', () => this._notify('playing'));
    adapter.on('paused', () => this._notify('paused'));
    adapter.on('ended', () => {
      this._notify('ended');
      this.next();
    });
    adapter.on('error', (err) => this._notify('error', err));
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  _notify(type, payload) {
    for (const sub of this.subscribers) {
      try {
        sub(type, payload);
      } catch (e) {
        console.error('[PlayerController] Subscriber error:', e);
      }
    }
  }

  getCurrentSong() {
    return this.queue[this.currentIndex] || null;
  }

  setQueue(songs, startIndex = 0) {
    this.queue = songs || [];
    this.currentIndex = startIndex;
    const song = this.getCurrentSong();
    if (song) {
      this._prepareSong(song);
    }
  }

  _prepareSong(song) {
    const desiredType = song.sourceType || PROVIDER_TYPES.DIRECT_AUDIO;
    if (desiredType !== this.currentAdapterType) {
      this.activeAdapter.destroy();
      this.currentAdapterType = desiredType;
      this.activeAdapter = createPlaybackAdapter(desiredType);
      this._bindAdapterEvents(this.activeAdapter);
    }
    this.activeAdapter.load(song);
    this.activeAdapter.setVolume(this.volume);
  }

  play() {
    return this.activeAdapter.play();
  }

  pause() {
    this.activeAdapter.pause();
  }

  seek(seconds) {
    this.activeAdapter.seek(seconds);
  }

  setVolume(percent) {
    this.volume = Math.max(0, Math.min(100, percent));
    this.activeAdapter.setVolume(this.volume);
  }

  playFromIndex(index) {
    if (index >= 0 && index < this.queue.length) {
      this.currentIndex = index;
      const song = this.getCurrentSong();
      if (song) {
        this._prepareSong(song);
        this.play();
      }
    }
  }

  next() {
    if (this.queue.length === 0) return;
    const nextIdx = (this.currentIndex + 1) % this.queue.length;
    this.playFromIndex(nextIdx);
  }

  previous() {
    if (this.queue.length === 0) return;
    const prevIdx = (this.currentIndex - 1 + this.queue.length) % this.queue.length;
    this.playFromIndex(prevIdx);
  }

  destroy() {
    this.activeAdapter.destroy();
    this.subscribers.clear();
  }
}
