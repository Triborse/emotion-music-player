import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EmotionTrendsChart = ({ data }) => {
  if (!data) {
    return (
      <div className="glass-panel rounded-2xl p-6 h-64 flex items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          <div className="w-2 h-8 bg-slate-700/50 rounded animate-bounce"></div>
          <div className="w-2 h-12 bg-slate-700/50 rounded animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-6 bg-slate-700/50 rounded animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-10 bg-slate-700/50 rounded animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1', // slate-300
          usePointStyle: true,
          boxWidth: 8,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)', // slate-900
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        padding: 12,
        borderColor: 'rgba(51, 65, 85, 0.5)',
        borderWidth: 1,
        displayColors: true,
        boxPadding: 4
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(51, 65, 85, 0.3)', // slate-700
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8', // slate-400
          font: {
            family: "'Inter', sans-serif",
            size: 10
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: "'Inter', sans-serif",
            size: 10
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  // Enhance data with gradients/fills
  const enhancedData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      fill: true,
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        
        // Extract color and apply opacity
        const color = dataset.borderColor;
        
        if (color === '#3b82f6') { // Primary (blue)
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        } else if (color === '#8b5cf6') { // Secondary (violet)
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(148, 163, 184, 0.2)');
          gradient.addColorStop(1, 'rgba(148, 163, 184, 0)');
        }
        
        return gradient;
      },
      borderWidth: 2,
      pointBackgroundColor: '#1e293b',
      pointBorderColor: dataset.borderColor,
      pointBorderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 6,
    }))
  };

  return (
    <div className="glass-panel rounded-2xl p-6 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        Emotion Trends
      </h2>
      <div className="relative flex-1 min-h-[200px]">
        <Line options={options} data={enhancedData} />
      </div>
    </div>
  );
};

export default EmotionTrendsChart;
