import { Volume2, VolumeX, Volume1 } from 'lucide-react';

/**
 * VolumeControl — compact volume slider with mute toggle.
 * Fully theme-aware.
 */
export default function VolumeControl({ volume, onChange, onToggleMute }) {
  const isMuted = volume === 0;
  const isLow = volume > 0 && volume < 40;

  const handleToggle = () => {
    if (onToggleMute) onToggleMute();
    else onChange(isMuted ? 70 : 0);
  };

  const VolumeIcon = isMuted ? VolumeX : isLow ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        className="p-1 opacity-60 hover:opacity-100 transition-opacity"
        style={{ color: 'var(--text-primary)' }}
      >
        <VolumeIcon size={16} strokeWidth={1.5} />
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20 h-1 cursor-pointer"
        aria-label="Volume"
        style={{
          background: `linear-gradient(to right, var(--accent-btn) 0%, var(--accent-btn) ${volume}%, var(--border-card) ${volume}%, var(--border-card) 100%)`,
        }}
      />
    </div>
  );
}
