/**
 * Swaram Local Music Storage — IndexedDB Persistence for Imported MP3s
 *
 * Saves local user MP3 files as Blobs with metadata.
 * Restores safe Object URLs on page reload without third-party databases.
 *
 * Song model:
 * {
 *   id              — unique stable key
 *   title           — user-facing display title (can be renamed)
 *   originalTitle   — parsed from filename, never changed by user
 *   artist          — parsed from filename or 'Local Artist'
 *   duration        — seconds
 *   blob            — raw File/Blob for audio playback
 *   fileName        — original file name (e.g. "song_01.mp3")
 *   fileSize        — bytes
 *   dateAdded       — timestamp
 *   sourceType      — always 'DIRECT_AUDIO' for local files
 *   isLocal         — true
 * }
 */

const DB_NAME = 'swaram_local_music_db';
const DB_VERSION = 2; // Bumped to add originalTitle support
const STORE_NAME = 'tracks';

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      // Migration: existing records get originalTitle set from title on next read
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Format a filename into a clean Title and Artist fallback
 * Example: "Ludovico Einaudi - Nuvole Bianche.mp3" -> Title: "Nuvole Bianche", Artist: "Ludovico Einaudi"
 */
export function parseFileName(fileName) {
  const cleanName = fileName.replace(/\.[^/.]+$/, '').trim();
  if (cleanName.includes(' - ')) {
    const [artistPart, ...rest] = cleanName.split(' - ');
    return {
      artist: artistPart.trim(),
      title: rest.join(' - ').trim(),
    };
  }
  return {
    artist: 'Local Artist',
    title: cleanName,
  };
}

/**
 * Extract audio duration from a File using HTMLAudioElement
 */
export function extractAudioDuration(file) {
  return new Promise((resolve) => {
    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    const tempUrl = URL.createObjectURL(file);
    audio.src = tempUrl;

    const cleanup = () => {
      URL.revokeObjectURL(tempUrl);
      audio.remove();
    };

    audio.onloadedmetadata = () => {
      const dur = Math.round(audio.duration || 0);
      cleanup();
      resolve(dur);
    };

    audio.onerror = () => {
      cleanup();
      resolve(0);
    };

    // Timeout fallback if metadata fails to load within 3 seconds
    setTimeout(() => {
      cleanup();
      resolve(0);
    }, 3000);
  });
}

/**
 * Save an imported MP3 file to IndexedDB
 */
export async function saveImportedTrack(file) {
  const db = await openDB();
  const parsed = parseFileName(file.name);
  const duration = await extractAudioDuration(file);

  const trackId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const record = {
    id: trackId,
    title: parsed.title,
    originalTitle: parsed.title,
    artist: parsed.artist,
    duration,
    blob: file,
    fileName: file.name,
    fileSize: file.size,
    dateAdded: Date.now(),
    sourceType: 'LOCAL_MP3',
    isLocal: true,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);

    req.onsuccess = () => {
      // Return track with usable objectUrl
      const objectUrl = URL.createObjectURL(file);
      resolve({
        ...record,
        sourceUrl: objectUrl,
      });
    };

    req.onerror = () => reject(req.error);
  });
}

/**
 * Load all imported tracks from IndexedDB and regenerate Object URLs
 */
export async function getAllImportedTracks() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const records = req.result || [];
        // Map records into player-compatible objects with fresh Object URLs
        const tracks = records.map((rec) => {
          let sourceUrl = '';
          if (rec.blob) {
            sourceUrl = URL.createObjectURL(rec.blob);
          }
          return {
            id: rec.id,
            title: rec.title,
            originalTitle: rec.originalTitle || rec.title,
            artist: rec.artist,
            duration: rec.duration || 0,
            sourceType: 'LOCAL_MP3',
            sourceUrl,
            blob: rec.blob,
            isLocal: true,
            dateAdded: rec.dateAdded,
            fileName: rec.fileName,
          };
        });
        resolve(tracks);
      };

      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[musicStorage] Could not load tracks from IndexedDB:', err);
    return [];
  }
}

/**
 * Rename a track in IndexedDB.
 * Only updates the display title — originalTitle and fileName are preserved.
 */
export async function renameImportedTrack(trackId, newTitle) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(trackId);

      getReq.onsuccess = () => {
        const record = getReq.result;
        if (!record) {
          resolve(false);
          return;
        }
        const updated = {
          ...record,
          title: newTitle.trim(),
        };
        const putReq = store.put(updated);
        putReq.onsuccess = () => resolve(true);
        putReq.onerror = () => reject(putReq.error);
      };

      getReq.onerror = () => reject(getReq.error);
    });
  } catch (err) {
    console.warn('[musicStorage] Could not rename track:', err);
    return false;
  }
}

/**
 * Delete a track from IndexedDB
 */
export async function deleteImportedTrack(trackId) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(trackId);

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[musicStorage] Could not delete track from IndexedDB:', err);
    return false;
  }
}
