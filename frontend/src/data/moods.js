/**
 * Swaram — Mood Configuration Data
 *
 * Each mood defines its visual environment, copy, and real MP3 playlist.
 * Real audio files are loaded directly from /songs/<mood-folder>/<song>.mp3.
 * No fabricated or demo song titles are used.
 */

export const MOODS = [
  {
    id: 'sad',
    name: 'Sad',
    label: 'CURRENT MOOD',
    tagline: 'A thoughtful soundtrack for quieter moments.',
    description: 'Let the rain wash away the noise. Sink into the sound.',
    background: '/assets/backgrounds/sad.png',
    backgroundPosition: {
      desktop: '25% center',
      tablet: '30% center',
      mobile: '35% center',
    },
    contentAlign: 'right', // character is center-left
    icon: 'CloudRain',
    playlist: {
      title: 'Sad Reflections',
      songs: [
        {
          id: 'sad_1',
          title: 'Sad',
          artist: 'Swaram',
          duration: 277,
          sourceType: 'STATIC_AUDIO',
          sourceUrl: '/songs/sad/sad.mp3',
        },
      ],
    },
  },
  {
    id: 'happy',
    name: 'Happy',
    label: 'CURRENT MOOD',
    tagline: 'Music for brighter moments.',
    description: 'Turn up the warmth. Let the golden hour play.',
    background: '/assets/backgrounds/happy.png',
    backgroundPosition: {
      desktop: '25% center',
      tablet: '28% center',
      mobile: '32% center',
    },
    contentAlign: 'right', // character is center-left
    icon: 'Sun',
    playlist: {
      title: 'Golden Hour Harmony',
      songs: [
        {
          id: 'happy_1',
          title: 'Happy',
          artist: 'Swaram',
          duration: 270,
          sourceType: 'STATIC_AUDIO',
          sourceUrl: '/songs/happy/happy.mp3',
        },
      ],
    },
  },
  {
    id: 'calm',
    name: 'Calm',
    label: 'CURRENT MOOD',
    tagline: 'A peaceful soundtrack for a clearer mind.',
    description: 'Breathe. Settle in. Let the world slow down around you.',
    background: '/assets/backgrounds/calm.jpg',
    backgroundPosition: {
      desktop: '30% 35%',
      tablet: '30% 35%',
      mobile: '35% 35%',
    },
    contentAlign: 'right', // character is on left bed
    icon: 'Leaf',
    playlist: {
      title: 'Serene Sanctuary',
      songs: [
        {
          id: 'calm_1',
          title: 'Calm',
          artist: 'Swaram',
          duration: 180,
          sourceType: 'STATIC_AUDIO',
          sourceUrl: '/songs/calm/calm.mp3',
        },
      ],
    },
  },
  {
    id: 'romantic',
    name: 'Romantic',
    label: 'CURRENT MOOD',
    tagline: 'Warm melodies for intimate evenings.',
    description: 'Soft lights and honest feelings. Music made to be shared.',
    background: '/assets/backgrounds/romantic.jpg',
    backgroundPosition: {
      desktop: '65% center',
      tablet: '60% center',
      mobile: '55% center',
    },
    contentAlign: 'left', // couple is center-right
    icon: 'Heart',
    playlist: {
      title: 'For Two',
      songs: [
        {
          id: 'romantic_1',
          title: 'Romantic',
          artist: 'Swaram',
          duration: 303,
          sourceType: 'STATIC_AUDIO',
          sourceUrl: '/songs/romantic/romantic.mp3',
        },
      ],
    },
  },
  {
    id: 'energetic',
    name: 'Energetic',
    label: 'CURRENT MOOD',
    tagline: 'High-tempo tracks to fuel your momentum.',
    description: 'Turn the volume up. Feel the pulse of the city.',
    background: '/assets/backgrounds/energetic.jpg',
    backgroundPosition: {
      desktop: '50% center',
      tablet: '50% center',
      mobile: '50% center',
    },
    contentAlign: 'left', // dancer is center-right
    icon: 'Zap',
    playlist: {
      title: 'Neon Pulse',
      songs: [
        {
          id: 'energetic_1',
          title: 'Energetic',
          artist: 'Swaram',
          duration: 145,
          sourceType: 'STATIC_AUDIO',
          sourceUrl: '/songs/energetic/energetic.mp3',
        },
        {
          id: 'energetic_2',
          title: 'Energetic 2',
          artist: 'Swaram',
          duration: 297,
          sourceType: 'STATIC_AUDIO',
          sourceUrl: '/songs/energetic/energetic-2.mp3',
        },
      ],
    },
  },
  {
    id: 'chill',
    name: 'Chill',
    label: 'CURRENT MOOD',
    tagline: 'Mellow beats for unwinding after hours.',
    description: 'Kick back, put your feet up. Nothing is urgent here.',
    background: '/assets/backgrounds/chill.jpg',
    backgroundPosition: {
      desktop: '65% center',
      tablet: '60% center',
      mobile: '55% center',
    },
    contentAlign: 'left', // person is on right hammock
    icon: 'Waves',
    playlist: {
      title: 'Balcony Sunset',
      songs: [
        {
          id: 'chill_1',
          title: 'Chill',
          artist: 'Swaram',
          duration: 215,
          sourceType: 'STATIC_AUDIO',
          sourceUrl: '/songs/chill/chill.mp3',
        },
      ],
    },
  },
  {
    id: 'lonely',
    name: 'Lonely',
    label: 'CURRENT MOOD',
    tagline: 'Quiet melodies for moments of solitude.',
    description: 'You are not alone in feeling alone. Let the sound keep you company.',
    background: '/assets/backgrounds/lonely.jpg',
    backgroundPosition: {
      desktop: '35% center',
      tablet: '35% center',
      mobile: '40% center',
    },
    contentAlign: 'right', // person is center-left on bench
    icon: 'Moon',
    playlist: {
      title: 'Solitary Solace',
      songs: [
        {
          id: 'lonely_1',
          title: 'Lonely',
          artist: 'Swaram',
          duration: 245,
          sourceType: 'STATIC_AUDIO',
          sourceUrl: '/songs/lonely/lonely.mp3',
        },
      ],
    },
  },
  {
    id: 'roadTrip',
    name: 'Road Trip',
    label: 'CURRENT MOOD',
    tagline: 'Soundtracks for the journey ahead.',
    description: 'Roll the windows down. The horizon is calling.',
    background: '/assets/backgrounds/roadtrip.jpg',
    backgroundPosition: {
      desktop: '40% center',
      tablet: '40% center',
      mobile: '45% center',
    },
    contentAlign: 'right', // van is center-left
    icon: 'MapPin',
    playlist: {
      title: 'Open Highway',
      songs: [
        {
          id: 'roadtrip_1',
          title: 'Road Trip',
          artist: 'Swaram',
          duration: 362,
          sourceType: 'STATIC_AUDIO',
          sourceUrl: '/songs/road-trip/roadtrip.mp3',
        },
      ],
    },
  },
];

export const BRAND = {
  name: 'SWARAM',
  tagline: 'Music that flows with your mood.',
};

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Explore', href: '#moods' },
  { label: 'Playlists', href: '#playlists' },
  { label: 'Library', href: '#library' },
];

/**
 * Helper to get responsive background position
 */
export function getFocalPosition(position) {
  if (!position) return 'center center';
  if (typeof position === 'string') return position;
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 640) return position.mobile || position.desktop || 'center center';
    if (window.innerWidth < 1024) return position.tablet || position.desktop || 'center center';
    return position.desktop || 'center center';
  }
  return position.desktop || 'center center';
}

/**
 * Get a mood by its id.
 */
export function getMoodById(id) {
  return MOODS.find((m) => m.id === id) || MOODS[0];
}
