// src/components/EmotionRadarChart.jsx
import React from 'react';
import { Radar } from 'react-chartjs-2';

import joyIcon from '../assets/icons/joy.png';
import stableIcon from '../assets/icons/stable.png';
import anxietyIcon from '../assets/icons/anxiety.png';
import sadnessIcon from '../assets/icons/sadness.png';
import angerIcon from '../assets/icons/anger.png';

// 감정 데이터 정의
const emotionIcons = [joyIcon, stableIcon, anxietyIcon, sadnessIcon, angerIcon];
const emotionLabels = ['기쁨', '안정', '불안', '슬픔', '분노'];
const emotionValues = [20, 10, 30, 20, 20]; // 총합 100 기준 감정 분포

const EmotionRadarChart = () => {
  const chartSize = 280;
  const center = chartSize / 2;
  const iconRadius = 170;
  const iconSize = 32;

  // ✅ 감정 분포를 가장 큰 값 기준으로 100%까지 리스케일
  const maxEmotion = Math.max(...emotionValues);
  const normalizedValues = emotionValues.map((v) => (v / maxEmotion) * 100);

  // ✅ Chart.js 데이터 구성
  const data = {
    labels: ['', '', '', '', ''], // 레이블은 숨김 처리
    datasets: [
      {
        label: '감정 분포',
        data: normalizedValues,
        backgroundColor: 'rgba(255, 182, 128, 0.3)',
        borderColor: '#FFB680',
        pointBackgroundColor: '#FFB680',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // ✅ 옵션 구성: 퍼센트 단위 기준 고정
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      r: {
        min: 0,
        max: 100, // 퍼센트 기준으로 비율 고정
        ticks: {
          display: false,
        },
        pointLabels: {
          display: false,
        },
        grid: {
          color: '#ccc',
        },
        angleLines: {
          display: true,
        },
      },
    },
  };

  return (
    <div
      className="radar-chart-container"
      style={{
        width: chartSize,
        height: chartSize,
        position: 'relative',
        margin: '0 auto',
      }}
    >
      {/* ✅ 레이더 차트 */}
      <Radar data={data} options={options} />

      {/* ✅ 이모지 + 퍼센트 텍스트 위치 계산 */}
      {emotionIcons.map((icon, idx) => {
        const angle = ((Math.PI * 2) / emotionIcons.length) * idx - Math.PI / 2; // 12시 기준 회전
        const x = center + iconRadius * Math.cos(angle) - iconSize / 2;
        const y = center + iconRadius * Math.sin(angle) - iconSize / 2;

        return (
          <div
            key={idx}
            className="radar-icon"
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '12px',
              color: '#444',
              width: `${iconSize}px`,
              height: `${iconSize + 12}px`,
            }}
          >
            <img
              src={icon}
              alt={emotionLabels[idx]}
              style={{ width: '28px', height: '28px', marginBottom: '2px' }}
            />
            <span>{emotionValues[idx]}%</span>
          </div>
        );
      })}
    </div>
  );
};

export default EmotionRadarChart;
