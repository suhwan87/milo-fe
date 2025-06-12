import React from 'react';
import { Line } from 'react-chartjs-2';
import '../styles/EmotionChart.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js 필수 요소 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EmotionChart = () => {
  const data = {
    labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    datasets: [
      {
        data: [12, 19, 14, 17, 12, 22, 30], // 감정 수치
        borderColor: '#ff8827',
        backgroundColor: '#ff8827',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#666',
          font: { size: 12 },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: '#666',
          font: { size: 12 },
        },
        grid: {
          color: '#eee',
        },
      },
    },
  };

  return (
    <div className="chart-section">
      <div className="chart-header">
        <span className="chart-title">감정 변화 시각화</span>
        <span className="chart-arrow">›</span>
      </div>
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default EmotionChart;
