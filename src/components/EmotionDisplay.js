import React from 'react';

const emotionConfig = {
  Happy: { color: 'text-yellow-400', bg: 'bg-yellow-400/20', icon: '😄' },
  Sad: { color: 'text-blue-400', bg: 'bg-blue-400/20', icon: '😢' },
  Energetic: { color: 'text-orange-500', bg: 'bg-orange-500/20', icon: '🔥' },
  Calm: { color: 'text-teal-400', bg: 'bg-teal-400/20', icon: '🌿' },
  Neutral: { color: 'text-gray-400', bg: 'bg-gray-400/20', icon: '😐' },
};

const EmotionDisplay = ({ emotion, confidence }) => {
  const currentConfig = emotionConfig[emotion] || emotionConfig.Neutral;

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 relative overflow-hidden group">
      <div className={`absolute -inset-4 opacity-50 blur-2xl group-hover:opacity-75 transition-opacity duration-500 rounded-full ${currentConfig.bg}`}></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-sm uppercase tracking-widest text-slate-400 font-semibold mb-2">Current Emotion</h2>
        
        <div className={`text-6xl mb-4 animate-bounce`}>
          {currentConfig.icon}
        </div>
        
        <h1 className={`text-3xl font-bold ${currentConfig.color} tracking-tight`}>
          {emotion}
        </h1>
        
        {confidence && (
          <div className="mt-4 flex items-center space-x-2">
            <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${currentConfig.bg.replace('/20', '')}`} 
                style={{ width: `${confidence * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-slate-400">{(confidence * 100).toFixed(0)}% Confidence</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionDisplay;
