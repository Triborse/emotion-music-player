import axios from 'axios';

export const fetchBackendSong = async (emotion) => {
  const response = await axios.get(
    `http://localhost:8000/recommend/${emotion}`
  );

  return response.data;
};

// Example Axios instance that can connect to the Flask backend later
const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
  timeout: 5000,
});

export const predictEmotion = async (imageBlob) => {
  const formData = new FormData();

  formData.append("file", imageBlob, "frame.jpg");

  const response = await axios.post(
    "http://localhost:8000/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


// Storage keys for persisting data in browser to ensure premium demo experience
const STORAGE_KEYS = {
  FAVORITES: 'aura_favorites',
  HISTORY: 'aura_history',
  PLAYBACK_CONFIG: 'aura_playback_config',
};

// Initial default JSON favorites mapping matching user requirements
const DEFAULT_FAVORITES = {
  Happy: [
    { id: 'h1', title: 'Walking on Sunshine', artist: 'Katrina & The Waves', url: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7a6GXYe', localPath: 'C:/music/happy/walking_on_sunshine.mp3' },
    { id: 'h2', title: 'Happy', artist: 'Pharrell Williams', url: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs', localPath: 'C:/music/happy/happy.mp3' }
  ],
  Sad: [
    { id: 's1', title: 'Someone Like You', artist: 'Adele', url: 'https://open.spotify.com/playlist/37i9dQZF1DX3YSRfvuo9cu', localPath: 'C:/music/sad/someone_like_you.mp3' },
    { id: 's2', title: 'Fix You', artist: 'Coldplay', url: 'https://www.youtube.com/watch?v=k4V3_G27qGE', localPath: 'C:/music/sad/fix_you.mp3' }
  ],
  Energetic: [
    { id: 'e1', title: 'Eye of the Tiger', artist: 'Survivor', url: 'https://open.spotify.com/playlist/37i9dQZF1DX76t638V6eg8', localPath: 'C:/music/energetic/eye_of_the_tiger.mp3' },
    { id: 'e2', title: 'Don\'t Stop Me Now', artist: 'Queen', url: 'https://www.youtube.com/watch?v=HgzGwKwLmgM', localPath: 'C:/music/energetic/dont_stop_me_now.mp3' }
  ],
  Calm: [
    { id: 'c1', title: 'Weightless', artist: 'Marconi Union', url: 'https://open.spotify.com/playlist/37i9dQZF1DX1s9vksOW376', localPath: 'C:/music/calm/weightless.mp3' },
    { id: 'c2', title: 'Strawberry Swing', artist: 'Coldplay', url: 'https://www.youtube.com/watch?v=h3pJZSTQqIg', localPath: 'C:/music/calm/strawberry_swing.mp3' }
  ],
  Neutral: [
    { id: 'n1', title: 'Clocks', artist: 'Coldplay', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO', localPath: 'C:/music/neutral/clocks.mp3' },
    { id: 'n2', title: 'Shape of You', artist: 'Ed Sheeran', url: 'https://www.youtube.com/watch?v=JGwWNGJdvx8', localPath: 'C:/music/neutral/shape_of_you.mp3' }
  ]
};

// Initial default CSV logs simulation
const DEFAULT_HISTORY = [
  { timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(), emotion: 'Neutral', confidence: 0.82, playbackMethod: 'Spotify', songPlayed: 'Clocks' },
  { timestamp: new Date(Date.now() - 3600000 * 2.8).toISOString(), emotion: 'Sad', confidence: 0.74, playbackMethod: 'Spotify', songPlayed: 'Someone Like You' },
  { timestamp: new Date(Date.now() - 3600000 * 2.1).toISOString(), emotion: 'Calm', confidence: 0.89, playbackMethod: 'Pygame', songPlayed: 'Weightless' },
  { timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(), emotion: 'Happy', confidence: 0.91, playbackMethod: 'Spotify', songPlayed: 'Walking on Sunshine' },
  { timestamp: new Date(Date.now() - 3600000 * 0.4).toISOString(), emotion: 'Energetic', confidence: 0.95, playbackMethod: 'Pygame', songPlayed: 'Eye of the Tiger' },
];

// Fallback image map
const ALBUM_ARTS = {
  Happy: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
  Sad: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f92d?w=400&h=400&fit=crop',
  Energetic: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
  Calm: 'https://images.unsplash.com/photo-1507502707541-f369a3b18502?w=400&h=400&fit=crop',
  Neutral: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
};

// State initializers
const getStoredData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error('Error reading localStorage:', error);
    return fallback;
  }
};

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing localStorage:', error);
  }
};

// Initialize State
let favorites = getStoredData(STORAGE_KEYS.FAVORITES, DEFAULT_FAVORITES);
let history = getStoredData(STORAGE_KEYS.HISTORY, DEFAULT_HISTORY);
let playbackConfig = getStoredData(STORAGE_KEYS.PLAYBACK_CONFIG, { method: 'Spotify' }); // Spotify or Pygame

let mockEmotionState = {
  emotion: 'Neutral',
  confidence: 0.88,
  active: false
};

// Simulated APIs
export const fetchCurrentEmotion = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { 
    emotion: mockEmotionState.emotion, 
    confidence: mockEmotionState.confidence,
    active: mockEmotionState.active
  };
};

export const setMockEmotion = (emotion, confidence = 0.85) => {
  mockEmotionState = {
    emotion,
    confidence: Math.min(Math.max(confidence, 0.1), 1),
    active: true
  };
};

export const fetchRecommendedMusic = async (emotion) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/recommend/${emotion}`
    );

    const data = response.data;

    return {
      title: data.song,
      artist: "Aura Music Engine",
      emotion: data.emotion,

      albumArt:
        ALBUM_ARTS[data.emotion] ||
        ALBUM_ARTS.Neutral,

      audioUrl:
        `http://localhost:8000/song/${data.emotion}/${data.song}`
    };
  } catch (error) {
    console.error(
      "Failed to fetch music:",
      error
    );

    return null;
  }
};

// Playback configurations
export const fetchPlaybackConfig = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return playbackConfig;
};

export const updatePlaybackConfig = async (method) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  playbackConfig = { method };
  setStoredData(STORAGE_KEYS.PLAYBACK_CONFIG, playbackConfig);
  return playbackConfig;
};

// Favorites JSON endpoints
export const fetchFavorites = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return favorites;
};

export const updateFavorites = async (updatedFavorites) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  favorites = updatedFavorites;
  setStoredData(STORAGE_KEYS.FAVORITES, favorites);
  return favorites;
};

// CSV logs endpoints
export const fetchCSVHistory = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return history;
};

export const addCSVHistoryEntry = async (emotion, confidence, songPlayed) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const newEntry = {
    timestamp: new Date().toISOString(),
    emotion,
    confidence: parseFloat(confidence),
    playbackMethod: playbackConfig.method,
    songPlayed
  };
  history = [newEntry, ...history];
  setStoredData(STORAGE_KEYS.HISTORY, history);
  return history;
};

export const clearCSVHistory = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  history = [];
  setStoredData(STORAGE_KEYS.HISTORY, history);
  return history;
};

// Trends calculations based on CSV logs
export const fetchEmotionTrends = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create last 7 hourly labels or just use the log timestamps
  const lastLogs = [...history].reverse().slice(-7);
  
  const labels = lastLogs.map(log => {
    const d = new Date(log.timestamp);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  });

  // Calculate trends for standard positive emotion levels vs negative
  const happinessData = lastLogs.map(log => {
    if (log.emotion === 'Happy') return Math.round(log.confidence * 100);
    if (log.emotion === 'Energetic') return Math.round(log.confidence * 85);
    if (log.emotion === 'Calm') return Math.round(log.confidence * 60);
    if (log.emotion === 'Neutral') return Math.round(log.confidence * 50);
    return Math.round(log.confidence * 20); // Sad
  });

  const sadnessData = lastLogs.map(log => {
    if (log.emotion === 'Sad') return Math.round(log.confidence * 100);
    if (log.emotion === 'Neutral') return Math.round(log.confidence * 30);
    if (log.emotion === 'Calm') return Math.round(log.confidence * 20);
    return Math.round(log.confidence * 10);
  });

  return {
    labels: labels.length > 0 ? labels : ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    datasets: [
      {
        label: 'Happiness Index',
        data: happinessData.length > 0 ? happinessData : [30, 45, 55, 60, 80, 85, 90],
        borderColor: '#3b82f6', // primary blue
        tension: 0.4,
      },
      {
        label: 'Sadness Index',
        data: sadnessData.length > 0 ? sadnessData : [50, 40, 30, 25, 10, 15, 5],
        borderColor: '#8b5cf6', // secondary violet
        tension: 0.4,
      }
    ]
  };
};

export default api;
