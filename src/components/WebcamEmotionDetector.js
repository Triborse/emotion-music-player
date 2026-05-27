import React, { useState, useEffect, useRef } from 'react';
import { setMockEmotion, addCSVHistoryEntry } from '../services/api';

const EMOTIONS = ['Happy', 'Sad', 'Energetic', 'Calm', 'Neutral'];

const WebcamEmotionDetector = ({ currentEmotion, confidence, onEmotionDetected, currentSongName }) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanInterval, setScanInterval] = useState(3); // seconds
  const [fps, setFps] = useState(30);
  const [inferenceTime, setInferenceTime] = useState(48); // ms
  const [telemetry, setTelemetry] = useState({
    faceDetected: false,
    resolution: '640x480',
    model: 'DeepFace VGG-Face',
    backend: 'OpenCV Capture',
  });

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const analysisTimerRef = useRef(null);

  // Handle starting/stopping webcam
  useEffect(() => {
    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isCameraOn]);

  // Handle detection loops
  useEffect(() => {
    if (isAnalyzing && isCameraOn) {
      startAnalysisLoop();
    } else {
      stopAnalysisLoop();
    }
    return () => stopAnalysisLoop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnalyzing, isCameraOn, scanInterval]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
        setTelemetry(prev => ({ ...prev, faceDetected: true }));
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable, falling back to simulator visualizer.", err);
      setIsCameraOn(false);
      alert("Webcam not accessible or permission denied. Operating in Simulated Telemetry mode!");
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setTelemetry(prev => ({ ...prev, faceDetected: false }));
    setIsAnalyzing(false);
  };

  const startAnalysisLoop = () => {
    stopAnalysisLoop(); // Reset any existing
    analysisTimerRef.current = setInterval(async () => {
      // Simulate DeepFace CNN analysis delay
      setInferenceTime(Math.round(40 + Math.random() * 20));
      setFps(Math.round(28 + Math.random() * 4));
      
      // Randomly select a new emotion or keep current with some changes
      const randomEmotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
      const randomConf = parseFloat((0.75 + Math.random() * 0.22).toFixed(2));
      
      // Write mock data using the service API
      setMockEmotion(randomEmotion, randomConf);
      
      // Log to history CSV simulation
      await addCSVHistoryEntry(randomEmotion, randomConf, currentSongName || 'Simulated Track');

      // Trigger state updates
      onEmotionDetected(randomEmotion, randomConf);
    }, scanInterval * 1000);
  };

  const stopAnalysisLoop = () => {
    if (analysisTimerRef.current) {
      clearInterval(analysisTimerRef.current);
      analysisTimerRef.current = null;
    }
  };

  const handleManualTrigger = (emo) => {
    const conf = parseFloat((0.80 + Math.random() * 0.18).toFixed(2));
    setMockEmotion(emo, conf);
    addCSVHistoryEntry(emo, conf, currentSongName || 'Static Stream');
    onEmotionDetected(emo, conf);
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col border border-slate-700/40 relative shadow-2xl">
      {/* HUD Telemetry Bar */}
      <div className="bg-slate-950/70 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-[11px] cyber-text tracking-wider text-slate-400">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${isCameraOn ? 'bg-emerald-500 animate-pulse-ring' : 'bg-rose-500'}`}></span>
          <span className="text-slate-300">FEED: {isCameraOn ? 'LIVE_STREAM' : 'STANDBY'}</span>
        </div>
        <div className="flex space-x-4">
          <span>{telemetry.model}</span>
          <span className="text-primary">{telemetry.resolution}</span>
          <span className="text-secondary">{isAnalyzing ? `${fps} FPS` : 'PAUSED'}</span>
        </div>
      </div>

      {/* Video Viewport Container */}
      <div className="relative w-full aspect-video bg-slate-950/90 overflow-hidden flex items-center justify-center group">
        
        {/* Cyber Grid Background */}
        <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none"></div>

        {isCameraOn ? (
          <>
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover scale-x-[-1]"
            />
            
            {/* Real Camera Laser Scanner Overlay */}
            {isAnalyzing && (
              <div className="absolute left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-laser pointer-events-none z-20"></div>
            )}
            
            {/* Cyber Face Bounding Box & Landmarks */}
            {telemetry.faceDetected && (
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-cyan-400/70 pointer-events-none z-10 animate-pulse-ring">
                {/* Bounding box corner ticks */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-cyan-300"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-cyan-300"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-cyan-300"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-cyan-300"></div>
                
                {/* Target Dot Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-rose-500 rounded-full"></div>
                
                {/* Real-time scanning telemetry tags */}
                <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[9px] text-cyan-300 font-mono cyber-text">
                  FACE_ID: #0825
                </div>
                <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[9px] text-cyan-300 font-mono cyber-text">
                  DEEP_INFER: {inferenceTime}ms
                </div>
              </div>
            )}
          </>
        ) : (
          /* Stands-by / Cyber Simulation Visualizer */
          <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center relative z-10 w-full h-full">
            {/* Futuristic Scanner Matrix Circle */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <div className="absolute inset-0 border border-slate-700/60 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
              <div className="absolute inset-2 border border-dashed border-primary/40 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
              <div className="absolute inset-4 bg-slate-800/40 border border-secondary/30 rounded-full flex items-center justify-center animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <div>
              <p className="text-slate-300 font-medium tracking-wide">Webcam Standby Mode</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">Activate the live camera stream for DeepFace VGG-Face facial emotion analysis.</p>
            </div>
          </div>
        )}

        {/* Emotion Overlay Display */}
        {isAnalyzing && currentEmotion && (
          <div className="absolute bottom-4 right-4 bg-slate-950/80 border border-slate-700/40 px-3 py-2 rounded-xl backdrop-blur-md z-30 flex items-center space-x-3 transition-all duration-300">
            <span className="text-2xl animate-bounce">
              {currentEmotion === 'Happy' && '😄'}
              {currentEmotion === 'Sad' && '😢'}
              {currentEmotion === 'Energetic' && '🔥'}
              {currentEmotion === 'Calm' && '🌿'}
              {currentEmotion === 'Neutral' && '😐'}
            </span>
            <div className="font-mono text-left">
              <div className="text-[10px] text-slate-400 leading-none">DETECTED</div>
              <div className="text-sm font-bold text-white leading-tight">{currentEmotion}</div>
              <div className="text-[9px] text-cyan-400 font-semibold cyber-text mt-0.5">{(confidence * 100).toFixed(0)}% CONF</div>
            </div>
          </div>
        )}
      </div>

      {/* Control Actions & Simulation Sliders */}
      <div className="p-4 bg-slate-900/60 border-t border-slate-800/80 flex flex-col space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Main Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all border flex items-center space-x-2 ${
                isCameraOn 
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20' 
                : 'bg-primary/20 text-primary hover:bg-primary/30 border-primary/40'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>{isCameraOn ? 'Disable Camera' : 'Enable Webcam'}</span>
            </button>

            {isCameraOn && (
              <button
                onClick={() => setIsAnalyzing(!isAnalyzing)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all border flex items-center space-x-2 ${
                  isAnalyzing 
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 animate-pulse' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                }`}
              >
                <span>{isAnalyzing ? 'Stop Detection' : 'Start Detection'}</span>
              </button>
            )}
          </div>

          {/* Interval Configuration */}
          {isAnalyzing && (
            <div className="flex items-center space-x-3">
              <span className="text-xs text-slate-400 font-medium">Scan Interval:</span>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={scanInterval} 
                onChange={(e) => setScanInterval(parseInt(e.target.value))}
                className="w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary" 
              />
              <span className="text-xs font-mono cyber-text text-cyan-400">{scanInterval}s</span>
            </div>
          )}
        </div>

        {/* Demo Mode / Simulate Section */}
        <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2 flex items-center justify-between">
            <span>Simulate AI Detection & Pygame Playback (Manual Overrides)</span>
            <span className="text-[9px] text-cyan-500 font-mono cyber-text">OpenCV Emulator</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {EMOTIONS.map(emo => (
              <button
                key={emo}
                onClick={() => handleManualTrigger(emo)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  currentEmotion === emo
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                    : 'bg-surface/50 border-slate-700/60 hover:border-slate-500 text-slate-300'
                }`}
              >
                {emo === 'Happy' && '😄 Happy'}
                {emo === 'Sad' && '😢 Sad'}
                {emo === 'Energetic' && '🔥 Energetic'}
                {emo === 'Calm' && '🌿 Calm'}
                {emo === 'Neutral' && '😐 Neutral'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebcamEmotionDetector;
