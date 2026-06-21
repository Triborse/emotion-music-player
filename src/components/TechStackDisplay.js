import React, { useState } from 'react';

const techDetails = {
  ai: {
    title: '🧠 AI & Machine Learning',
    techs: [
      { name: 'DeepFace', desc: 'Runs VGG-Face CNN models on OpenCV captures to evaluate facial features and classify seven human emotions (Happy, Sad, Angry, Fear, Surprise, Disgust, Neutral).', badge: 'VGG-Face CNN' },
      { name: 'OpenCV', desc: 'Accesses the client system camera streams, captures high-frame-rate image frames, crops identified facial ROIs (Regions of Interest), and sends image matrices to DeepFace.', badge: 'Frame Capture' }
    ],
    code: 'from deepface import DeepFace\nimport cv2\n\n# Capture frame via OpenCV\nret, frame = cap.read()\n\n# DeepFace classification\nanalysis = DeepFace.analyze(\n  img_path = frame,\n  actions = ["emotion"],\n  enforce_detection = False\n)\ndetected_emotion = analysis[0]["dominant_emotion"]',
    color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5 hover:shadow-cyan-500/10'
  },
  backend: {
  title: '💻 Backend API Server',
  techs: [
    { name: 'FastAPI', desc: 'High-performance async Python framework running local RESTful endpoints. Handles emotion prediction requests, manages the local song catalog, and serves audio files directly to the frontend.', badge: 'REST API' },
    { name: 'Pandas', desc: 'Aggregates long-term emotion logs stored in CSV format, providing quick analytical operations like emotion averages, mood intensity counts, and weekly stats.', badge: 'Data Science' }
  ],
  code: 'from fastapi import FastAPI\nimport pandas as pd\n\napp = FastAPI()\n\n@app.get("/trends")\ndef get_trends():\n    df = pd.read_csv("history.csv")\n    summary = df["emotion"].value_counts().to_dict()\n    return {"trends": summary}',
  color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:shadow-emerald-500/10'
},
  frontend: {
    title: '🎨 Frontend Dashboard',
    techs: [
      { name: 'HTML, CSS, JS', desc: 'Built on React.js with utility components, using custom glassmorphism layers, futuristic cyberpunk scanning overlays, and real webcam hardware stream overlays.', badge: 'React & Tailwind' },
      { name: 'Chart.js', desc: 'Displays real-time analysis feeds, sentiment index histories, and emotion density trends with responsive canvas charts.', badge: 'Data Visualizer' }
    ],
    code: 'import { Line } from "react-chartjs-2";\n\nconst TrendChart = ({ data }) => {\n  return (\n    <Line \n      data={data} \n      options={{ responsive: true }}\n    />\n  );\n};',
    color: 'border-primary/30 text-primary bg-primary/5 hover:shadow-primary/10'
  },
  media: {
  title: '🎵 Media Handlers',
  techs: [
    { name: 'FastAPI FileResponse', desc: 'Serves local MP3 files directly to the browser as streamable audio responses, mapped by emotion folder and filename.', badge: 'Audio Streaming' },
    { name: 'HTML5 Audio API', desc: 'Plays streamed audio natively in the browser via the <audio> element, with real-time playback events (timeupdate, ended) driving the UI progress bar and auto-advance logic.', badge: 'Browser Native' }
  ],
  code: '@router.get("/song/{emotion}/{filename}")\ndef get_song(emotion: str, filename: str):\n    file_path = os.path.join(MUSIC_DIR, emotion, filename)\n    return FileResponse(\n        file_path,\n        media_type="audio/mpeg"\n    )',
  color: 'border-amber-500/30 text-amber-400 bg-amber-500/5 hover:shadow-amber-500/10'
},
  database: {
    title: '💾 Database & Storage',
    techs: [
      { name: 'CSV File System', desc: 'Lightweight database that logs every scan: logs timestamp, classified emotion, confidence index, and active track in a tabular CSV structure.', badge: 'History Logs' },
      { name: 'JSON Configs', desc: 'Stores localized configurations mapping moods to specific local song paths and Spotify playlist IDs, allowing instant modifications.', badge: 'Favorite Playlists' }
    ],
    code: '[\n  {\n    "timestamp": "2026-05-26T23:00:00Z",\n    "emotion": "Happy",\n    "confidence": 0.95,\n    "song": "Walking on Sunshine"\n  }\n]',
    color: 'border-secondary/30 text-secondary bg-secondary/5 hover:shadow-secondary/10'
  },
  apis: {
    title: '🌐 Integration APIs',
    techs: [
      { name: 'Spotify Playlists', desc: 'Free access to curated public playlists for happy, sad, calm, energetic, or chill tracks. Integrates online Spotify tracks without requiring complex paid Developer API keys.', badge: 'Music Playlists' },
      { name: 'YouTube Links', desc: 'Generates real-time query links, opening video links based on detected mood states to supply endless lists of music videos.', badge: 'Online Search API' }
    ],
    code: '// Dynamic URL Creation\nconst getSpotifyURL = (emotion) => {\n  const playlistIDs = {\n    Happy: "37i9dQZF1DXdPec7a6GXYe",\n    Sad: "37i9dQZF1DX3YSRfvuo9cu"\n  };\n  return "https://open.spotify.com/playlist/" + playlistIDs[emotion];\n};',
    color: 'border-rose-500/30 text-rose-400 bg-rose-500/5 hover:shadow-rose-500/10'
  }
};

const TechStackDisplay = () => {
  const [activeTab, setActiveTab] = useState('ai');

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col border border-slate-700/40 relative shadow-2xl overflow-hidden h-full">
      {/* Background abstract element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">System Tech Stack & Architecture</h2>
          <p className="text-xs text-slate-400 mt-1">Explore the modules powering this emotion-based player system.</p>
        </div>
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-lg px-2 py-1 text-[10px] text-cyan-400 font-mono cyber-text">
          FLOW: CV_CAPTURE -> VGG_FACE_CNN -> FASTAPI_AUDIO
       </div>
      </div>

      {/* Graphical Flowchart Schematic */}
      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 mb-6 overflow-x-auto">
        <div className="min-w-[600px] flex items-center justify-between px-4 py-2 font-mono text-[10px] tracking-wider cyber-text">
          
          <div className="flex flex-col items-center">
            <div className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 px-3 py-2 rounded-lg text-center font-bold shadow-[0_0_10px_rgba(6,182,212,0.1)]">
              📷 OpenCV
            </div>
            <span className="text-slate-600 mt-1">Frames capture</span>
          </div>

          <div className="text-slate-600 animate-pulse">➔</div>

          <div className="flex flex-col items-center">
            <div className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 px-3 py-2 rounded-lg text-center font-bold shadow-[0_0_10px_rgba(6,182,212,0.1)] animate-pulse">
              🧠 DeepFace CNN
            </div>
            <span className="text-slate-600 mt-1">Dominant Emotion</span>
          </div>

          <div className="text-slate-600">➔</div>

          <div className="flex flex-col items-center">
  <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 px-3 py-2 rounded-lg text-center font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]">
    💻 FastAPI Backend
  </div>
  <span className="text-slate-600 mt-1">REST Controllers</span>
</div>

          <div className="text-slate-600">➔</div>

          <div className="flex flex-col items-center">
            <div className="bg-secondary/15 text-secondary border border-secondary/40 px-3 py-2 rounded-lg text-center font-bold">
              💾 CSV History & JSON
            </div>
            <span className="text-slate-600 mt-1">Pandas & Configs</span>
          </div>

          <div className="text-slate-600">➔</div>

          <div className="flex flex-col items-center">
  <div className="bg-amber-500/10 text-amber-400 border border-amber-500/40 px-3 py-2 rounded-lg text-center font-bold shadow-[0_0_10px_rgba(245,158,11,0.1)]">
    🎵 HTML5 Audio
  </div>
  <span className="text-slate-600 mt-1">Media Playback</span>
</div>

        </div>
      </div>

      {/* Tab Selectors */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
        {Object.keys(techDetails).map(key => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`py-2 px-1 rounded-xl text-center text-xs font-semibold border transition-all duration-300 ${
              activeTab === key
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Interactive Detail Body */}
      <div className={`border rounded-2xl p-5 flex-1 flex flex-col md:flex-row gap-6 transition-all duration-500 ${techDetails[activeTab].color}`}>
        {/* Text descriptions */}
        <div className="flex-1 space-y-4">
          <h3 className="text-lg font-bold text-slate-100">{techDetails[activeTab].title}</h3>
          
          <div className="space-y-4">
            {techDetails[activeTab].techs.map((tech, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm">{tech.name}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700/30 text-slate-400 font-mono tracking-wider">
                    {tech.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="w-full md:w-1/2 flex flex-col bg-slate-950/85 border border-slate-800/80 rounded-xl overflow-hidden shadow-inner min-h-[160px]">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono cyber-text">integration_snippet.py</span>
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></span>
            </div>
          </div>
          <div className="p-4 flex-1 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed select-text">
            <pre>{techDetails[activeTab].code}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStackDisplay;
