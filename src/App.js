import React, { useState, useEffect } from 'react';
import WebcamEmotionDetector from './components/WebcamEmotionDetector';
import MusicPlayer from './components/MusicPlayer';
import EmotionTrendsChart from './components/EmotionTrendsChart';
import TechStackDisplay from './components/TechStackDisplay';
import FavoritesManager from './components/FavoritesManager';
import HistoryLog from './components/HistoryLog';
import {
  fetchCurrentEmotion,
  fetchBackendSong,
  fetchEmotionTrends,
  fetchPlaybackConfig,
  fetchCSVHistory
} from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('live'); // live, stack, config, logs
  
  // App core telemetry states
  const [currentEmotion, setCurrentEmotion] = useState('Neutral');
  const [confidence, setConfidence] = useState(0.85);
  const [currentSong, setCurrentSong] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [playbackMethod, setPlaybackMethod] = useState('Spotify');
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status simulation heartbeats
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // 1. Fetch initial emotion & recommended track
      const emotionData = await fetchCurrentEmotion();
      setCurrentEmotion(emotionData.emotion);
      setConfidence(emotionData.confidence);

      const songData = await fetchBackendSong(
  emotionData.emotion
);

setCurrentSong({
  title: songData.song,
  artist: "Aura Music Engine",
  emotion: songData.emotion,
  audioUrl: `http://localhost:8000/song/${songData.emotion}/${songData.song}`,
  albumArt:
    "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f92d"
});
      // 2. Fetch config playback method
      const config = await fetchPlaybackConfig();
      setPlaybackMethod(config.method);

      // 3. Fetch logs and chart trends
      const logs = await fetchCSVHistory();
      setHistoryLogs(logs);

      const trends = await fetchEmotionTrends();
      setChartData(trends);
    } catch (error) {
      console.error("Error initializing dashboard panels:", error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch music when emotion changes
  const handleEmotionUpdate = async (newEmotion, newConfidence) => {
    setCurrentEmotion(newEmotion);
    setConfidence(newConfidence);
    setCameraActive(true);
    
    try {
      const songData = await fetchBackendSong(
  newEmotion
);
console.log("SONG DATA:", songData);
setCurrentSong({
  title: songData.song,
  artist: "Aura Music Engine",
  emotion: songData.emotion,
  audioUrl: `http://localhost:8000/song/${songData.emotion}/${songData.song}`,
  albumArt:
    "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f92d"
});
      
      // Update history logs state & trends instantly for real-time responsiveness
      const updatedLogs = await fetchCSVHistory();
      setHistoryLogs(updatedLogs);
      
      const trends = await fetchEmotionTrends();
      setChartData(trends);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfigChange = (newMethod) => {
    setPlaybackMethod(newMethod);
    // Refresh history entries to display correct routing channel
    fetchCSVHistory().then(setHistoryLogs);
  };

  const handleFavoritesChange = async () => {
  if (currentEmotion) {
    const songData = await fetchBackendSong(currentEmotion);

    setCurrentSong({
      title: songData.song,
      artist: "Aura Music Engine",
      emotion: songData.emotion,
      audioUrl: `http://localhost:8000/song/${songData.emotion}/${songData.song}`,
      albumArt:
        "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f92d"
    });
  }
};

  const handleLogsPurged = () => {
    setHistoryLogs([]);
    fetchEmotionTrends().then(setChartData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b19] flex flex-col items-center justify-center font-sans">
        <div className="animate-pulse flex flex-col items-center relative">
          {/* Cyber concentric loading circles */}
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-6"></div>
          <h2 className="text-sm font-semibold tracking-widest text-cyan-400 cyber-text uppercase animate-bounce">
            Initializing Aura Engine
          </h2>
          <p className="text-slate-500 text-xs mt-2">Checking Flask APIs & Pygame Mixer Status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans transition-all selection:bg-cyan-500/20">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Grid */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-950/40 p-5 rounded-2xl border border-slate-900 shadow-xl">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 via-primary to-secondary bg-clip-text text-transparent">
                AuraCam AI Dashboard
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-400 font-bold border border-cyan-400/20 uppercase tracking-wider cyber-text animate-pulse">
                v2.1 Stable
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              Real-time emotion classification using DeepFace (VGG-Face) & OpenCV with Pygame audio routing.
            </p>
          </div>
          
          {/* Live Telemetry Health Indicators */}
          <div className="flex flex-wrap gap-3 font-mono text-[10px] cyber-text">
            
            {/* Webcam indicator */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className="text-slate-400">CAMERA:</span>
              <span className={cameraActive ? 'text-emerald-400' : 'text-amber-400'}>
                {cameraActive ? 'STREAMING' : 'STANDBY'}
              </span>
            </div>

            {/* Flask API indicator */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-400">FLASK_API:</span>
              <span className="text-emerald-400">ONLINE</span>
            </div>

            {/* Pygame status */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-400">PYGAME_MIXER:</span>
              <span className="text-emerald-400">CONNECTED</span>
            </div>

          </div>
        </header>

        {/* Dashboard Tab Navigation Bar */}
        <nav className="flex space-x-2 bg-slate-950/20 p-1.5 rounded-2xl border border-slate-900 overflow-x-auto">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 flex items-center space-x-2 shrink-0 ${
              activeTab === 'live'
                ? 'bg-gradient-to-r from-cyan-500/20 to-primary/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <span>🎥</span>
            <span>Webcam Scan View</span>
          </button>

          <button
            onClick={() => setActiveTab('stack')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 flex items-center space-x-2 shrink-0 ${
              activeTab === 'stack'
                ? 'bg-gradient-to-r from-cyan-500/20 to-primary/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <span>🎯</span>
            <span>Technology Blueprint</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 flex items-center space-x-2 shrink-0 ${
              activeTab === 'config'
                ? 'bg-gradient-to-r from-cyan-500/20 to-primary/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <span>💾</span>
            <span>JSON & Playback Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 flex items-center space-x-2 shrink-0 ${
              activeTab === 'logs'
                ? 'bg-gradient-to-r from-cyan-500/20 to-primary/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <span>📊</span>
            <span>CSV History Logs</span>
          </button>
        </nav>

        {/* Core Tab Panels view routing */}
        <main className="transition-all duration-300">
          
          {/* TAB 1: Live Webcam Detection & Music */}
          {activeTab === 'live' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Webcam column */}
              <div className="lg:col-span-5 flex flex-col h-full">
                <WebcamEmotionDetector 
                  currentEmotion={currentEmotion} 
                  confidence={confidence} 
                  onEmotionDetected={handleEmotionUpdate}
                  currentSongName={currentSong?.title}
                />
              </div>

              {/* Music Player & Trend charts column */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Music Player */}
                <div className="flex-1">
                  <MusicPlayer 
                    currentSong={currentSong} 
                    playbackMethod={playbackMethod} 
                  />
                </div>

                {/* Live Trends Chart */}
                <div className="h-[280px]">
                  <EmotionTrendsChart data={chartData} />
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: System Architecture / Technology Stack display */}
          {activeTab === 'stack' && (
            <div className="min-h-[500px]">
              <TechStackDisplay />
            </div>
          )}

          {/* TAB 3: Favorites JSON configs & Playback method selection */}
          {activeTab === 'config' && (
            <div className="min-h-[500px]">
              <FavoritesManager 
                onConfigChange={handleConfigChange}
                onFavoritesChange={handleFavoritesChange}
              />
            </div>
          )}

          {/* TAB 4: CSV Database history datatable logs */}
          {activeTab === 'logs' && (
            <div className="min-h-[500px]">
              <HistoryLog 
                historyData={historyLogs}
                onHistoryCleared={handleLogsPurged}
              />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;
