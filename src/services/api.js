import axios from 'axios';

// Example Axios instance that we'll mock for now
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Mock backend URL
  timeout: 5000,
});

// Mock data
const mockEmotions = ['Happy', 'Sad', 'Energetic', 'Calm', 'Neutral'];

const mockSongs = [
  { id: 1, title: 'Walking on Sunshine', artist: 'Katrina & The Waves', emotion: 'Happy', albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop' },
  { id: 2, title: 'Someone Like You', artist: 'Adele', emotion: 'Sad', albumArt: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f92d?w=300&h=300&fit=crop' },
  { id: 3, title: 'Eye of the Tiger', artist: 'Survivor', emotion: 'Energetic', albumArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop' },
  { id: 4, title: 'Weightless', artist: 'Marconi Union', emotion: 'Calm', albumArt: 'https://images.unsplash.com/photo-1507502707541-f369a3b18502?w=300&h=300&fit=crop' },
  { id: 5, title: 'Clocks', artist: 'Coldplay', emotion: 'Neutral', albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop' },
];

let currentEmotionIndex = 0;

export const fetchCurrentEmotion = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a mock emotion that changes occasionally
  const emotion = mockEmotions[currentEmotionIndex];
  
  // We'll keep the same emotion for a bit in a real scenario, but let's just cycle it for demo purposes if we wanted to
  // currentEmotionIndex = (currentEmotionIndex + 1) % mockEmotions.length;
  
  return { emotion, confidence: 0.85 + (Math.random() * 0.1) };
};

export const fetchRecommendedMusic = async (emotion) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const recommended = mockSongs.filter(song => song.emotion.toLowerCase() === emotion.toLowerCase());
  // If no match, return a random song
  if (recommended.length === 0) {
    return mockSongs[Math.floor(Math.random() * mockSongs.length)];
  }
  return recommended[Math.floor(Math.random() * recommended.length)];
};

export const fetchEmotionTrends = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    labels: ['10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30'],
    datasets: [
      {
        label: 'Happiness',
        data: [20, 30, 60, 80, 85, 70, 90],
        borderColor: '#3b82f6', // primary
        tension: 0.4,
      },
      {
        label: 'Sadness',
        data: [60, 50, 30, 10, 5, 20, 10],
        borderColor: '#8b5cf6', // secondary
        tension: 0.4,
      }
    ]
  };
};

// Expose setMockEmotion for the demo UI to change the current emotion manually
export const setMockEmotion = (emotion) => {
  const index = mockEmotions.findIndex(e => e.toLowerCase() === emotion.toLowerCase());
  if (index !== -1) {
    currentEmotionIndex = index;
  }
};

export default api;
