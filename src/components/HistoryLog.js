import React, { useState, useEffect } from 'react';
import { fetchCSVHistory, clearCSVHistory } from '../services/api';

const HistoryLog = ({ historyData, onHistoryCleared }) => {
  const [history, setHistory] = useState([]);
  const [filterEmotion, setFilterEmotion] = useState('All');
  const [loading, setLoading] = useState(true);

  // Read logs from props or fetch from API
  useEffect(() => {
    if (historyData) {
      setHistory(historyData);
      setLoading(false);
    } else {
      loadHistory();
    }
  }, [historyData]);

  const loadHistory = async () => {
    try {
      const logs = await fetchCSVHistory();
      setHistory(logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (window.confirm("Are you sure you want to purge the database? This deletes all records inside 'emotion_history.csv'.")) {
      try {
        const cleared = await clearCSVHistory();
        setHistory(cleared);
        if (onHistoryCleared) onHistoryCleared();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // virtual CSV file generator (premium touch)
  const handleDownloadCSV = () => {
    if (history.length === 0) return;
    
    // Header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Timestamp,DetectedEmotion,ConfidenceScore,PlaybackMethod,TrackPlayed\n";
    
    // Rows
    history.forEach(row => {
      const formattedTime = new Date(row.timestamp).toISOString();
      const escapedTitle = row.songPlayed.replace(/"/g, '""');
      csvContent += `"${formattedTime}","${row.emotion}",${row.confidence},"${row.playbackMethod}","${escapedTitle}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `emotion_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulated Pandas Analysis calculation
  const calculatePandasMetrics = () => {
    if (history.length === 0) {
      return {
        total: 0,
        dominant: 'N/A',
        avgConfidence: '0%',
        sentimentPositivity: 50
      };
    }

    const total = history.length;
    
    // Dominant Emotion
    const counts = {};
    let dominant = 'Neutral';
    let maxCount = 0;
    
    // Confidence totals
    let confidenceSum = 0;

    // Positivity metrics
    let positiveCount = 0; // Happy, Energetic, Calm

    history.forEach(row => {
      counts[row.emotion] = (counts[row.emotion] || 0) + 1;
      if (counts[row.emotion] > maxCount) {
        maxCount = counts[row.emotion];
        dominant = row.emotion;
      }
      
      confidenceSum += row.confidence;
      if (['Happy', 'Energetic', 'Calm'].includes(row.emotion)) {
        positiveCount++;
      }
    });

    const avgConfidence = `${Math.round((confidenceSum / total) * 100)}%`;
    const sentimentPositivity = Math.round((positiveCount / total) * 100);

    return {
      total,
      dominant,
      avgConfidence,
      sentimentPositivity
    };
  };

  const metrics = calculatePandasMetrics();

  // Filter list
  const filteredHistory = filterEmotion === 'All'
    ? history
    : history.filter(row => row.emotion === filterEmotion);

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-6 h-96 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col border border-slate-700/40 relative shadow-2xl h-full">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">CSV History Logs (Pandas Engine)</h2>
          <p className="text-xs text-slate-400 mt-1">Simulates real-time system writes into local CSV databases.</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadCSV}
            disabled={history.length === 0}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleClear}
            disabled={history.length === 0}
            className="bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear CSV</span>
          </button>
        </div>
      </div>

      {/* Pandas Telemetry Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        
        {/* Total Records */}
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 text-center">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Pandas total_rows</div>
          <div className="text-2xl font-extrabold text-white cyber-text">{metrics.total}</div>
          <div className="text-[9px] text-slate-400 mt-1">Logs stored in CSV</div>
        </div>

        {/* Dominant Emotion */}
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 text-center">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Dominant Mood</div>
          <div className="text-2xl font-extrabold text-primary cyber-text truncate">{metrics.dominant}</div>
          <div className="text-[9px] text-slate-400 mt-1">Mode of CSV dataset</div>
        </div>

        {/* Average Confidence */}
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 text-center">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Mean Confidence</div>
          <div className="text-2xl font-extrabold text-secondary cyber-text">{metrics.avgConfidence}</div>
          <div className="text-[9px] text-slate-400 mt-1">DeepFace CNN accuracy</div>
        </div>

        {/* Positivity Index */}
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1 text-center">Mood Positivity</div>
          <div className="flex items-center justify-between text-xs text-slate-300 px-1">
            <span>Positive</span>
            <span className="font-bold text-emerald-400">{metrics.sentimentPositivity}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${metrics.sentimentPositivity}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* CSV Filter Selector */}
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-xs text-slate-400 font-semibold uppercase">Filter by Mood:</span>
        <div className="flex flex-wrap gap-1.5">
          {['All', 'Happy', 'Sad', 'Energetic', 'Calm', 'Neutral'].map(emo => (
            <button
              key={emo}
              onClick={() => setFilterEmotion(emo)}
              className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                filterEmotion === emo
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {emo}
            </button>
          ))}
        </div>
      </div>

      {/* Datatable Wrapper */}
      <div className="flex-1 bg-slate-950/30 border border-slate-800/80 rounded-xl overflow-hidden shadow-inner flex flex-col min-h-[220px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800/80 text-[10px] text-slate-400 font-bold uppercase tracking-wider cyber-text">
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Emotion</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Target Song Mapped</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-500 italic">
                    No matching records inside emotion_history.csv
                  </td>
                </tr>
              ) : (
                filteredHistory.map((row, index) => {
                  const d = new Date(row.timestamp);
                  const displayTime = `${d.toLocaleDateString()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
                  
                  return (
                    <tr key={index} className="hover:bg-slate-900/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-[10px] text-slate-400 cyber-text">{displayTime}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          row.emotion === 'Happy' && 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                        } ${
                          row.emotion === 'Sad' && 'bg-blue-400/10 text-blue-400 border border-blue-400/20'
                        } ${
                          row.emotion === 'Calm' && 'bg-teal-400/10 text-teal-400 border border-teal-400/20'
                        } ${
                          row.emotion === 'Energetic' && 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        } ${
                          row.emotion === 'Neutral' && 'bg-slate-400/10 text-slate-400 border border-slate-400/20'
                        }`}>
                          {row.emotion}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-cyan-400 cyber-text">
                        {(row.confidence * 100).toFixed(0)}%
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold ${
                          row.playbackMethod === 'Pygame' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {row.playbackMethod}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-white truncate max-w-[200px]" title={row.songPlayed}>
                        {row.songPlayed}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryLog;
