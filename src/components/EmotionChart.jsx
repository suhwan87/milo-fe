import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/EmotionChart.css';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const EmotionChart = () => {
  const data = {
    labels: ['6/5', '6/6', '6/7', '6/8', '6/9'],
    datasets: [
      {
        label: '기쁨',
        data: [0.4, 0.5, 0.6, 0.55, 0.7],
        fill: false,
        borderColor: '#f97316',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { min: 0, max: 1 } },
  };

  return (
    <div className="chart-wrapper">
      <h3 className="chart-title">감정 변화 추이</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default EmotionChart;
