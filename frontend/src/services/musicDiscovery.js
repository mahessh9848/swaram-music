/**
 * Swaram — Music Discovery Service
 *
 * Provider-agnostic abstraction for future music discovery.
 * Designed to connect Language + Mood to curated feeds or official providers
 * (e.g. YouTube IFrame Player API, Spotify Web SDK) without scraping.
 *
 * Architecture:
 * Language + Mood -> Discovery Service -> Music Provider -> Queue -> Player
 */

export class MusicDiscoveryService {
  constructor(options = {}) {
    this.options = options;
    this.providers = new Map();
  }

  registerProvider(id, provider) {
    this.providers.set(id, provider);
  }

  /**
   * Discover tracks for a specific language and mood combination.
   * Currently retrieves bundled static tracks and filters by language + mood metadata.
   */
  async getTracksForMoodAndLanguage({ moodId, languageId, localTracks = [], bundledSongs = [] }) {
    // 1. Filter bundled static library
    const filteredBundled = bundledSongs.filter((song) => {
      const matchMood = !moodId || song.moodId === moodId || song.mood === moodId;
      const matchLang = !languageId || song.language === languageId || !song.language;
      return matchMood && matchLang;
    });

    // 2. Filter local imported tracks
    const filteredLocal = localTracks.filter((track) => {
      const matchMood = !moodId || track.mood === moodId;
      const matchLang = !languageId || track.language === languageId;
      return matchMood && matchLang;
    });

    return {
      moodId,
      languageId,
      songs: [...filteredBundled, ...filteredLocal],
      timestamp: Date.now(),
    };
  }
}

export const musicDiscovery = new MusicDiscoveryService();
