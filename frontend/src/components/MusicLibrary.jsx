import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Play, Trash2, Music, Loader2, AlertCircle, MoreHorizontal, Pencil } from 'lucide-react';
import { saveImportedTrack, deleteImportedTrack, renameImportedTrack } from '../storage/musicStorage';

/**
 * MusicLibrary — Section for managing and playing locally imported MP3 files.
 * Persisted in IndexedDB.
 * Supports: delete, rename with modal, three-dot context menu, theme transitions.
 */
export default function MusicLibrary({ localTracks, setLocalTracks, player, language }) {
  const [isImporting, setIsImporting] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  const [songToRename, setSongToRename] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState('');
  const [isSavingRename, setIsSavingRename] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const fileInputRef = useRef(null);

  const { currentSong, isPlaying, playFromIndex, loadQueue, queue } = player;

  // ─── Import ────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []).filter(
      (f) => f.type === 'audio/mpeg' || f.name.toLowerCase().endsWith('.mp3')
    );
    if (files.length === 0) return;

    setIsImporting(true);
    try {
      const newSaved = [];
      for (const file of files) {
        const track = await saveImportedTrack(file, { language: language || 'ENGLISH' });
        newSaved.push(track);
      }
      setLocalTracks((prev) => [...prev, ...newSaved]);
    } catch (err) {
      console.error('[MusicLibrary] Error importing files:', err);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ─── Playback ─────────────────────────────────────────────────────
  const handlePlayLocalSong = (index) => {
    const isLocalQueue = queue.length === localTracks.length && queue[0]?.id === localTracks[0]?.id;
    if (!isLocalQueue) {
      loadQueue(localTracks, index);
      setTimeout(() => player.play(), 50);
    } else {
      playFromIndex(index);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────
  const requestDelete = (e, song) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setSongToDelete(song);
  };

  const confirmDelete = async () => {
    if (!songToDelete) return;
    const trackId = songToDelete.id;
    await deleteImportedTrack(trackId);
    setLocalTracks((prev) => prev.filter((t) => t.id !== trackId));
    setSongToDelete(null);
  };

  const cancelDelete = () => setSongToDelete(null);

  // ─── Rename ───────────────────────────────────────────────────────
  const openRename = (e, song) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setSongToRename(song);
    setRenameValue(song.title);
    setRenameError('');
  };

  const handleRenameChange = (e) => {
    setRenameValue(e.target.value);
    if (renameError) setRenameError('');
  };

  const confirmRename = async () => {
    const trimmed = renameValue.trim();
    if (!trimmed) {
      setRenameError('Enter a song title.');
      return;
    }
    if (trimmed === songToRename.title) {
      setSongToRename(null);
      return;
    }

    setIsSavingRename(true);
    try {
      await renameImportedTrack(songToRename.id, trimmed);
      // Update local state
      setLocalTracks((prev) =>
        prev.map((t) => (t.id === songToRename.id ? { ...t, title: trimmed } : t))
      );
      // Update player queue if currently loaded
      player.renameSongInQueue(songToRename.id, trimmed);
    } catch (err) {
      console.error('[MusicLibrary] Rename failed:', err);
    } finally {
      setIsSavingRename(false);
      setSongToRename(null);
    }
  };

  const cancelRename = () => {
    setSongToRename(null);
    setRenameError('');
  };

  // ─── Three-dot menu toggle ────────────────────────────────────────
  const toggleMenu = (e, songId) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === songId ? null : songId));
  };

  // ─── Utilities ────────────────────────────────────────────────────
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section
      id="library"
      className="relative z-10 py-12 md:py-16 px-4 sm:px-6 lg:px-8 scroll-mt-16 transition-colors"
      style={{ borderTop: '1px solid var(--border-subtle)' }}
      onClick={() => openMenuId && setOpenMenuId(null)}
    >
      <div className="w-full max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span
              className="text-[10px] tracking-[0.2em] uppercase font-medium block mb-1"
              style={{ color: 'var(--text-muted)' }}
            >
              Your Library
            </span>
            <h2
              className="font-display text-2xl sm:text-3xl font-medium tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Imported Songs
            </h2>
          </div>

          {/* Import MP3 Button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".mp3,audio/mpeg"
              multiple
              className="hidden"
              id="mp3-file-input"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all duration-200"
              style={{
                border: '1px solid var(--border-card)',
                background: 'var(--active-item)',
                color: 'var(--text-primary)',
              }}
            >
              {isImporting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload size={14} strokeWidth={1.5} />
                  Import MP3
                </>
              )}
            </button>
          </div>
        </div>

        {/* Songs List / Empty State */}
        {localTracks.length === 0 ? (
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
              <Music size={18} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              No songs yet
            </p>
            <p className="text-xs font-light max-w-sm mx-auto mb-5" style={{ color: 'var(--text-muted)' }}>
              Add music to build this playlist. Import any .mp3 file from your computer.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all"
              style={{
                border: '1px solid var(--border-card)',
                background: 'var(--active-item)',
                color: 'var(--text-primary)',
              }}
            >
              <Upload size={13} strokeWidth={1.5} />
              Import MP3
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <AnimatePresence>
              {localTracks.map((song, i) => {
                const isCurrentSong = currentSong?.id === song.id;
                const isCurrentlyPlaying = isCurrentSong && isPlaying;
                const isMenuOpen = openMenuId === song.id;

                return (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="relative w-full flex items-center gap-3 sm:gap-4 px-3.5 py-2.5 rounded-lg transition-all duration-200 text-left group cursor-pointer"
                    style={{
                      background: isCurrentSong ? 'var(--active-item)' : 'transparent',
                      border: isCurrentSong ? '1px solid var(--active-ring)' : '1px solid transparent',
                    }}
                    onClick={() => handlePlayLocalSong(i)}
                  >
                    {/* Index / Play / Equalizer */}
                    <div className="w-7 h-7 flex items-center justify-center shrink-0">
                      {isCurrentlyPlaying ? (
                        <div className="flex items-end gap-[2px] h-3.5">
                          <span
                            className="w-[2.5px] rounded-full animate-[equalizer_0.8s_ease-in-out_infinite]"
                            style={{ height: '60%', background: 'var(--accent-btn)' }}
                          />
                          <span
                            className="w-[2.5px] rounded-full animate-[equalizer_0.6s_ease-in-out_infinite_0.2s]"
                            style={{ height: '100%', background: 'var(--accent-btn)' }}
                          />
                          <span
                            className="w-[2.5px] rounded-full animate-[equalizer_0.7s_ease-in-out_infinite_0.1s]"
                            style={{ height: '40%', background: 'var(--accent-btn)' }}
                          />
                        </div>
                      ) : (
                        <>
                          <span
                            className="text-xs font-medium group-hover:hidden"
                            style={{ color: isCurrentSong ? 'var(--text-primary)' : 'var(--text-muted)' }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <Play
                            size={13}
                            strokeWidth={2}
                            className="hidden group-hover:block ml-0.5"
                            style={{ color: 'var(--text-primary)' }}
                          />
                        </>
                      )}
                    </div>

                    {/* Track info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs sm:text-sm font-medium truncate"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {song.title}
                      </p>
                      <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
                        {song.artist}
                      </p>
                    </div>

                    {/* Duration */}
                    <span className="text-xs tabular-nums shrink-0" style={{ color: 'var(--text-muted)' }}>
                      {formatDuration(song.duration)}
                    </span>

                    {/* Three-dot menu button */}
                    <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => toggleMenu(e, song.id)}
                        title="Song options"
                        className="p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-60 hover:!opacity-100"
                        style={{ color: 'var(--text-muted)' }}
                        aria-label="Song options"
                      >
                        <MoreHorizontal size={14} strokeWidth={1.5} />
                      </button>

                      {/* Dropdown menu */}
                      <AnimatePresence>
                        {isMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            transition={{ duration: 0.12 }}
                            className="absolute right-0 top-full mt-1 w-36 rounded-xl py-1 z-30 shadow-xl backdrop-blur-xl"
                            style={{
                              background: 'var(--modal-bg)',
                              border: '1px solid var(--modal-border)',
                            }}
                          >
                            <button
                              onClick={() => { handlePlayLocalSong(i); setOpenMenuId(null); }}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium transition-colors text-left"
                              style={{ color: 'var(--text-primary)' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-item)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = ''}
                            >
                              <Play size={12} strokeWidth={2} />
                              Play
                            </button>
                            <button
                              onClick={(e) => openRename(e, song)}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium transition-colors text-left"
                              style={{ color: 'var(--text-primary)' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-item)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = ''}
                            >
                              <Pencil size={12} strokeWidth={1.5} />
                              Rename
                            </button>
                            <div
                              className="my-1 mx-2"
                              style={{ height: '1px', background: 'var(--border-subtle)' }}
                            />
                            <button
                              onClick={(e) => requestDelete(e, song)}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium transition-colors text-left text-red-500 hover:text-red-400"
                              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-item)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = ''}
                            >
                              <Trash2 size={12} strokeWidth={1.5} />
                              Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ─── Rename Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {songToRename && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelRename}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl backdrop-blur-xl z-10"
              style={{
                background: 'var(--modal-bg)',
                border: '1px solid var(--modal-border)',
                color: 'var(--text-primary)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center gap-2.5 mb-4">
                <Pencil size={15} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                <h3 className="font-display text-base font-medium">Rename song</h3>
              </div>

              {/* Input */}
              <input
                type="text"
                value={renameValue}
                onChange={handleRenameChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmRename();
                  if (e.key === 'Escape') cancelRename();
                }}
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none transition-all mb-1"
                style={{
                  background: 'var(--modal-input)',
                  border: renameError
                    ? '1px solid rgba(239,68,68,0.6)'
                    : '1px solid var(--modal-border)',
                  color: 'var(--text-primary)',
                }}
                placeholder="Song title"
                maxLength={120}
              />

              {/* Validation */}
              <div className="h-4 mb-4">
                {renameError && (
                  <p className="text-[11px] text-red-400">{renameError}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={cancelRename}
                  className="px-4 py-2 rounded-xl text-xs font-medium transition-colors"
                  style={{
                    background: 'var(--hover-item)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmRename}
                  disabled={isSavingRename}
                  className="px-4 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
                  style={{
                    background: 'var(--accent-btn)',
                    color: 'var(--accent-btn-text)',
                  }}
                >
                  {isSavingRename ? 'Saving…' : 'Save'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirmation Dialog ───────────────────────────────── */}
      <AnimatePresence>
        {songToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelDelete}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl backdrop-blur-xl z-10"
              style={{
                background: 'var(--modal-bg)',
                border: '1px solid var(--modal-border)',
                color: 'var(--text-primary)',
              }}
            >
              <div className="flex items-center gap-3 mb-3 text-red-500">
                <AlertCircle size={20} />
                <h3 className="font-display text-lg font-medium">Remove this song?</h3>
              </div>
              <p className="text-xs font-light mb-6" style={{ color: 'var(--text-secondary)' }}>
                Are you sure you want to remove &ldquo;<span className="font-medium" style={{ color: 'var(--text-primary)' }}>{songToDelete.title}</span>&rdquo; from your library?
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-xl text-xs font-medium transition-colors"
                  style={{
                    background: 'var(--hover-item)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
