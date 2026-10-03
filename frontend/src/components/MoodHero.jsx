import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MoodHero — Zero-Flash Layered Crossfade Background Artwork.
 *
 * Architecture:
 * - Layer A (Base): Stays 100% opaque underneath at all times so there is never a black or white gap.
 * - Layer B (Incoming Overlay): Preloads the new image, then smoothly fades in over Layer A.
 * - Once faded in, Layer A seamlessly updates to the new image.
 *
 * Responsive Focal Points:
 * - Dynamically evaluates desktop, tablet, and mobile focal coordinates so character faces
 *   and headphones are never cropped awkwardly.
 */
export default function MoodHero({ mood }) {
  const [baseMood, setBaseMood] = useState(mood);
  const [incomingMood, setIncomingMood] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const isTransitioningRef = useRef(false);

  // Track window resize for responsive focal points
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive focal point helper
  const getObjectPosition = (posObj) => {
    if (!posObj) return 'center center';
    if (typeof posObj === 'string') return posObj;
    if (windowWidth < 640) return posObj.mobile || posObj.desktop || 'center center';
    if (windowWidth < 1024) return posObj.tablet || posObj.desktop || 'center center';
    return posObj.desktop || 'center center';
  };

  // Preload and trigger layered crossfade whenever active mood changes
  useEffect(() => {
    if (mood.id === baseMood.id) return;

    let isCancelled = false;
    const img = new Image();
    img.src = mood.background;

    img.onload = () => {
      if (isCancelled) return;
      isTransitioningRef.current = true;
      setIncomingMood(mood);
    };

    return () => {
      isCancelled = true;
    };
  }, [mood, baseMood.id]);

  const handleFadeComplete = () => {
    if (incomingMood) {
      setBaseMood(incomingMood);
      setIncomingMood(null);
      isTransitioningRef.current = false;
    }
  };

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Base Layer: Always 100% visible beneath */}
      <img
        src={baseMood.background}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-[object-position] duration-500"
        style={{
          objectPosition: getObjectPosition(baseMood.backgroundPosition),
        }}
        loading="eager"
        fetchPriority="high"
      />

      {/* Incoming Crossfade Layer: Fades in over the base layer */}
      <AnimatePresence>
        {incomingMood && (
          <motion.img
            key={incomingMood.id}
            src={incomingMood.background}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            onAnimationComplete={handleFadeComplete}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: getObjectPosition(incomingMood.backgroundPosition),
            }}
          />
        )}
      </AnimatePresence>

      {/* Cinematic Vignette Overlay — preserves artwork contrast and text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, rgba(17,17,17,0.45) 0%, rgba(17,17,17,0.0) 25%, rgba(17,17,17,0.0) 50%, rgba(17,17,17,0.75) 100%),
            linear-gradient(90deg, rgba(17,17,17,0.2) 0%, rgba(17,17,17,0.0) 30%, rgba(17,17,17,0.0) 70%, rgba(17,17,17,0.2) 100%)
          `,
        }}
      />
    </div>
  );
}
