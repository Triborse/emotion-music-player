import React, { useState, useEffect, useRef } from 'react';

  const MusicPlayer = ({ currentSong, playbackMethod, onNext, onPrevious }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const audioRef = useRef(null);

  // Sync progress + stop with the real <audio> element
useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  const handleTimeUpdate = () => {
    if (audio.duration) {
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

 const handleEnded = () => {
  setProgress(0);
  if (onNext) {
    onNext();
  } else {
    setIsPlaying(false);
  }
};

  audio.addEventListener('timeupdate', handleTimeUpdate);
  audio.addEventListener('ended', handleEnded);

  return () => {
    audio.removeEventListener('timeupdate', handleTimeUpdate);
    audio.removeEventListener('ended', handleEnded);
  };
}, [currentSong]);

  // Reset progress when song changes
 useEffect(() => {
  setProgress(0);
  setIsPlaying(true);

  if (audioRef.current && currentSong?.audioUrl) {
    audioRef.current.load();

    audioRef.current.play().catch((err) => {
      console.log("Audio autoplay blocked:", err);
    });
  }
}, [currentSong]);

  const togglePlay = () => {
  const audio = audioRef.current;
  if (!audio) return;

  if (isPlaying) {
    audio.pause();
    setIsPlaying(false);
  } else {
    audio.play().catch((err) => {
      console.log("Play blocked:", err);
    });
    setIsPlaying(true);
  }
};

  if (!currentSong) {
    return (
      <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center min-h-[350px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-800/80 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-slate-800/80 rounded mb-2"></div>
          <div className="h-3 w-32 bg-slate-800/80 rounded"></div>
        </div>
      </div>
    );
  }

  // Helper to format minutes
  const formatTime = (percentage) => {
    const totalSeconds = 210; // 3:30 min average
    const currentSeconds = Math.round((percentage / 100) * totalSeconds);
    const m = Math.floor(currentSeconds / 60);
    const s = (currentSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl border border-slate-700/40 relative shadow-2xl h-full">
      <audio
      ref={audioRef}
      controls={false}
    >
      <source
        src={currentSong?.audioUrl}
        type="audio/mpeg"
      />
    </audio>
      {/* Album Art Area */}
      <div className="relative w-full aspect-video sm:aspect-[21/9] bg-slate-950/80 overflow-hidden">
        <img 
          src={currentSong.albumArt} 
          alt={`${currentSong.title} album art`}
          className={`w-full h-full object-cover opacity-60 transition-transform duration-[8000ms] ${isPlaying ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        
        {/* Playback Mode Telemetry Tag */}
        <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-mono cyber-text border border-slate-800 flex items-center space-x-2">
          <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="text-slate-300">INTEG: {playbackMethod === 'Pygame' ? 'PYGAME_MIXER' : 'SPOTIFY_PLAYLIST'}</span>
        </div>

        {/* Emotion Badge */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold text-white border border-white/10 flex items-center space-x-1.5">
          <span>Match:</span>
          <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase font-extrabold ${
            currentSong.emotion === 'Happy' && 'bg-yellow-400/20 text-yellow-300'
          } ${
            currentSong.emotion === 'Sad' && 'bg-blue-400/20 text-blue-300'
          } ${
            currentSong.emotion === 'Calm' && 'bg-teal-400/20 text-teal-300'
          } ${
            currentSong.emotion === 'Energetic' && 'bg-orange-500/20 text-orange-400'
          } ${
            currentSong.emotion === 'Neutral' && 'bg-slate-400/20 text-slate-300'
          }`}>
            {currentSong.emotion}
          </span>
        </div>

        {/* Bouncing Audio Visualizer Equalizer Overlay */}
        <div className="absolute bottom-4 right-6 flex items-end space-x-1 h-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((bar, i) => (
            <div
              key={bar}
              className={`w-1 bg-cyan-400 rounded-full origin-bottom transition-all duration-300 ${
                isPlaying 
                  ? i % 4 === 0 ? 'animate-equalizer-1' : i % 4 === 1 ? 'animate-equalizer-2' : i % 4 === 2 ? 'animate-equalizer-3' : 'animate-equalizer-4'
                  : 'scale-y-[0.2]'
              }`}
              style={{ 
                height: '24px',
                animationDelay: `${i * 0.1}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Control / Details Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white tracking-wide truncate">{currentSong.title}</h2>
          <p className="text-slate-400 text-sm mt-1">{currentSong.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer group relative">
            <div 
              className="h-full bg-cyan-400 relative group-hover:bg-cyan-300 transition-colors"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono cyber-text tracking-wider">
            <span>{formatTime(progress)}</span>
            <span>3:30</span>
          </div>
        </div>

        {/* Playback Controls & Action Launchers */}
        <div className="flex flex-col space-y-4">
          
          {/* Main Controls row */}
<div className="flex items-center justify-center space-x-6">
  <button className="text-slate-500 hover:text-white transition-colors p-2">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  </button>
  
  <button onClick={onPrevious} className="text-slate-400 hover:text-white transition-colors p-2">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
      <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
    </svg>
  </button>
  
  <button 
    onClick={togglePlay}
    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-full p-4 shadow-lg shadow-cyan-500/20 transform transition-all active:scale-95 hover:scale-105"
  >
    {isPlaying ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 pl-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
      </svg>
    )}
  </button>
  
  <button onClick={onNext} className="text-slate-400 hover:text-white transition-colors p-2">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
      <path d="M11.555 5.168A1 1 0 0010 6v2.798l-5.445-3.63A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z" />
    </svg>
  </button>
  
  <button className="text-slate-500 hover:text-white transition-colors p-2">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  </button>
</div>
          {/* Interactive Integration Details Display */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 flex flex-col space-y-2 mt-2">
            
            {playbackMethod === 'Pygame' ? (
              /* Pygame Local Details */
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono cyber-text">
                  <span className="text-amber-400">● PYGAME MIXER ACTIVE</span>
                  <span className="text-slate-500">PORT: 5000</span>
                </div>
                <div className="text-[10px] text-slate-300 font-mono cyber-text truncate bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  <span className="text-slate-500">MIXER.LOAD: </span>
                  {currentSong.localPath}
                </div>
              </div>
            ) : (
              /* Spotify Online Details */
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono cyber-text">
                  <span className="text-emerald-400">● SPOTIFY PLAYBACK ROUTED</span>
                  <span className="text-slate-500">WEB_BROWSER</span>
                </div>
                <a
                  href={currentSong.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-500/10 active:scale-98"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>Launch Online Playlist Link</span>
                </a>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
