import React, { useState, useEffect } from 'react';
import EmotionDisplay from './components/EmotionDisplay';
import MusicPlayer from './components/MusicPlayer';
import EmotionTrendsChart from './components/EmotionTrendsChart';
import { fetchCurrentEmotion, fetchRecommendedMusic, fetchEmotionTrends, setMockEmotion } from './services/api';
import './App.css';

function App() {
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const emotionData = await fetchCurrentEmotion();
        setCurrentEmotion(emotionData.emotion);
        setConfidence(emotionData.confidence);

        const song = await fetchRecommendedMusic(emotionData.emotion);
        setCurrentSong(song);

        const trends = await fetchEmotionTrends();
        setChartData(trends);
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Effect to update music when emotion changes
  useEffect(() => {
    if (!currentEmotion) return;
    
    const updateMusic = async () => {
      try {
        const song = await fetchRecommendedMusic(currentEmotion);
        setCurrentSong(song);
      } catch (error) {
        console.error("Error updating music:", error);
      }
    };

    updateMusic();
  }, [currentEmotion]);

  // Handler for the demo emotion buttons
  const handleSimulateEmotion = async (emotion) => {
    setMockEmotion(emotion);
    const emotionData = await fetchCurrentEmotion();
    setCurrentEmotion(emotionData.emotion);
    setConfidence(emotionData.confidence);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400">Calibrating Emotion Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-100 p-4 sm:p-8 font-sans selection:bg-primary/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Aura Player
            </h1>
            <p className="text-slate-400 text-sm mt-1">Emotion-Based Music Experience</p>
          </div>
          
          {/* Demo Controls (for simulating backend) */}
          <div className="glass-panel rounded-full px-4 py-2 flex items-center space-x-2">
            <span className="text-xs text-slate-500 mr-2 uppercase tracking-wider">Simulate:</span>
            {['Happy', 'Sad', 'Energetic', 'Calm'].map(emo => (
              <button 
                key={emo}
                onClick={() => handleSimulateEmotion(emo)}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  currentEmotion === emo 
                  ? 'bg-primary text-white' 
                  : 'bg-surface hover:bg-slate-700 text-slate-300'
                }`}
              >
                {emo}
              </button>
            ))}
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Emotion & Trends */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <EmotionDisplay emotion={currentEmotion} confidence={confidence} />
            <div className="flex-1 min-h-[300px]">
              <EmotionTrendsChart data={chartData} />
            </div>
          </div>

          {/* Right Column: Music Player */}
          <div className="lg:col-span-2">
            <MusicPlayer currentSong={currentSong} />
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;
