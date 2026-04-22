import React, { useState } from 'react';

const MusicPlayer = ({ currentSong }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress] = useState(35); // mock progress 35%

  const togglePlay = () => setIsPlaying(!isPlaying);

  if (!currentSong) {
    return (
      <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-slate-700/50 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-slate-700/50 rounded mb-2"></div>
          <div className="h-3 w-32 bg-slate-700/50 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
      {/* Album Art Area */}
      <div className="relative w-full h-64 sm:h-80 bg-slate-800 overflow-hidden">
        <img 
          src={currentSong.albumArt} 
          alt={`${currentSong.title} album art`}
          className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
        
        {/* Emotion Badge */}
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span>Matched: {currentSong.emotion}</span>
        </div>
      </div>

      {/* Controls Area */}
      <div className="p-6 relative -mt-10 z-10 flex-1 flex flex-col">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white tracking-wide truncate">{currentSong.title}</h2>
          <p className="text-slate-400 text-sm mt-1">{currentSong.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden cursor-pointer group">
            <div 
              className="h-full bg-primary relative group-hover:bg-blue-400 transition-colors"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-medium tracking-wider">
            <span>1:24</span>
            <span>3:45</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center space-x-6 mt-auto pb-2">
          <button className="text-slate-400 hover:text-white transition-colors p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          <button className="text-slate-300 hover:text-white transition-colors p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
            </svg>
          </button>
          
          <button 
            onClick={togglePlay}
            className="bg-primary hover:bg-blue-400 text-white rounded-full p-4 shadow-lg shadow-primary/30 transform transition-all active:scale-95 hover:scale-105"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 pl-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          <button className="text-slate-300 hover:text-white transition-colors p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11.555 5.168A1 1 0 0010 6v2.798l-5.445-3.63A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z" />
            </svg>
          </button>
          
          <button className="text-slate-400 hover:text-white transition-colors p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
