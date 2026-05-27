import React, { useState, useEffect } from 'react';
import { fetchPlaybackConfig, updatePlaybackConfig, fetchFavorites, updateFavorites } from '../services/api';

const FavoritesManager = ({ onConfigChange, onFavoritesChange }) => {
  const [playbackMethod, setPlaybackMethod] = useState('Spotify'); // Spotify vs Pygame
  const [favorites, setFavorites] = useState({});
  const [selectedEmotion, setSelectedEmotion] = useState('Happy');
  const [loading, setLoading] = useState(true);
  
  // Form input state
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newLocalPath, setNewLocalPath] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const config = await fetchPlaybackConfig();
      setPlaybackMethod(config.method);
      
      const favs = await fetchFavorites();
      setFavorites(favs);
    } catch (err) {
      console.error("Error loading config settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlayback = async (method) => {
    try {
      const updated = await updatePlaybackConfig(method);
      setPlaybackMethod(updated.method);
      if (onConfigChange) onConfigChange(updated.method);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSong = async (e) => {
    e.preventDefault();
    if (!newTitle || !newArtist) return;

    const newSong = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      artist: newArtist,
      url: newUrl || 'https://open.spotify.com',
      localPath: newLocalPath || `C:/music/${selectedEmotion.toLowerCase()}/${newTitle.toLowerCase().replace(/\s+/g, '_')}.mp3`
    };

    const updatedFavs = {
      ...favorites,
      [selectedEmotion]: [...(favorites[selectedEmotion] || []), newSong]
    };

    try {
      await updateFavorites(updatedFavs);
      setFavorites(updatedFavs);
      
      // Reset inputs
      setNewTitle('');
      setNewArtist('');
      setNewUrl('');
      setNewLocalPath('');
      setIsAdding(false);
      
      if (onFavoritesChange) onFavoritesChange(updatedFavs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSong = async (songId) => {
    const updatedFavs = {
      ...favorites,
      [selectedEmotion]: favorites[selectedEmotion].filter(song => song.id !== songId)
    };

    try {
      await updateFavorites(updatedFavs);
      setFavorites(updatedFavs);
      if (onFavoritesChange) onFavoritesChange(updatedFavs);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-6 h-96 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col border border-slate-700/40 relative shadow-2xl overflow-hidden h-full">
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Playback & Config Manager</h2>
          <p className="text-xs text-slate-400 mt-1">Manage database JSON favorites and system playback methods.</p>
        </div>
      </div>

      {/* 1. Playback Mode Selection (Pygame vs Webbrowser) */}
      <div className="bg-slate-950/45 p-4 rounded-xl border border-slate-800/80 mb-6">
        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3 flex items-center justify-between">
          <span>Active Music Integration Channel</span>
          <span className="text-[9px] text-primary font-mono cyber-text">Settings Router</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Spotify / YouTube */}
          <button
            onClick={() => handleTogglePlayback('Spotify')}
            className={`p-4 rounded-xl text-left border transition-all duration-300 flex items-start space-x-3 ${
              playbackMethod === 'Spotify'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-[0_0_15px_rgba(16,185,129,0.08)]'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            <div className={`p-2 rounded-lg ${playbackMethod === 'Spotify' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-sm">Online (Webbrowser module)</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Opens Spotify Playlists and YouTube music links inside browser tabs. (Free & no API keys needed).
              </p>
            </div>
          </button>

          {/* Pygame Local Mixer */}
          <button
            onClick={() => handleTogglePlayback('Pygame')}
            className={`p-4 rounded-xl text-left border transition-all duration-300 flex items-start space-x-3 ${
              playbackMethod === 'Pygame'
                ? 'bg-amber-500/10 border-amber-500/40 text-white shadow-[0_0_15px_rgba(245,158,11,0.08)]'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            <div className={`p-2 rounded-lg ${playbackMethod === 'Pygame' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-sm">Local System (Pygame Mixer)</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Triggers local MP3 playback using the Python Pygame mixer directly on the system audio port.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. JSON Favorites Editor */}
      <div className="flex-1 flex flex-col min-h-[350px]">
        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3 flex items-center justify-between">
          <span>Interactive Favorites Mapper (JSON Config)</span>
          <span className="text-[9px] text-secondary font-mono cyber-text">config_songs.json</span>
        </div>

        {/* Emotion Tab selectors */}
        <div className="flex overflow-x-auto space-x-1.5 pb-2 mb-4">
          {Object.keys(favorites).map(emo => (
            <button
              key={emo}
              onClick={() => {
                setSelectedEmotion(emo);
                setIsAdding(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border shrink-0 transition-all ${
                selectedEmotion === emo
                  ? 'bg-secondary text-white border-secondary shadow-md'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {emo}
            </button>
          ))}
        </div>

        {/* Song list view */}
        <div className="flex-1 flex flex-col bg-slate-950/30 border border-slate-800/80 rounded-xl p-4 overflow-y-auto">
          {isAdding ? (
            /* Add song form */
            <form onSubmit={handleAddSong} className="space-y-4">
              <div className="text-xs font-bold text-slate-300 mb-2">Add New Song to {selectedEmotion} Mappings</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold uppercase">Song Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Walking on Sunshine"
                    className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold uppercase">Artist Name *</label>
                  <input
                    type="text"
                    required
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    placeholder="e.g. Katrina & The Waves"
                    className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Spotify Playlist / YouTube Link</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="e.g. https://open.spotify.com/playlist/..."
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Local Path (for Pygame Audio Mixer)</label>
                <input
                  type="text"
                  value={newLocalPath}
                  onChange={(e) => setNewLocalPath(e.target.value)}
                  placeholder="e.g. C:/music/happy/song.mp3"
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary transition-colors"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="submit"
                  className="bg-secondary hover:bg-violet-600 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
                >
                  Save Entry
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="bg-slate-900 text-slate-400 hover:text-slate-200 font-semibold text-xs px-4 py-2 rounded-xl border border-slate-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Playlist records display */
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                {(!favorites[selectedEmotion] || favorites[selectedEmotion].length === 0) ? (
                  <div className="text-center text-xs text-slate-500 py-6">No songs configured for this emotion.</div>
                ) : (
                  favorites[selectedEmotion].map(song => (
                    <div 
                      key={song.id} 
                      className="bg-slate-900/50 border border-slate-800/80 hover:border-slate-700/60 rounded-xl p-3 flex items-center justify-between gap-4 group/item transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-white truncate">{song.title}</span>
                          <span className="text-[9px] text-slate-500 truncate">by {song.artist}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-1 flex flex-col space-y-0.5 font-mono cyber-text">
                          <span className="truncate text-slate-400"><b className="text-slate-500">LOCAL:</b> {song.localPath}</span>
                          <span className="truncate text-primary/70"><b className="text-slate-500">ONLINE:</b> {song.url}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteSong(song.id)}
                        className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/5 transition-all opacity-0 group-hover/item:opacity-100"
                        title="Delete track from favorites"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => setIsAdding(true)}
                className="w-full border border-dashed border-slate-700/60 hover:border-slate-500 bg-slate-900/20 text-slate-300 hover:text-white rounded-xl py-3 mt-4 text-xs font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Custom Mapped Song</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesManager;
