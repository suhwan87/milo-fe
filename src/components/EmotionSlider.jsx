import React from 'react';
import '../styles/EmotionSlider.css';
import main1 from '../assets/characters/main1.png';
import main2 from '../assets/characters/main2.png';

const EmotionSlider = () => {
  const slides = [
    {
      title: '상담형',
      description: '00님,\n오늘은 어떤 대화를 하고 싶으신가요?',
      image: main1,
    },
    {
      title: '감정 리허설',
      description: '무대가 준비 중이에요,\n역할을 골라주세요!',
      image: main2,
    },
  ];

  return (
    <div className="slider-wrapper">
      {slides.map((item, index) => (
        <div className="slide-card" key={index}>
          <div className="slide-label">{item.title}</div>
          <div className="slide-content">
            <img
              src={item.image}
              alt={item.title}
              className="slide-character"
            />
            <div className="speech-bubble">
              <p>{item.description}</p>
            </div>
          </div>
          <button className="slide-button">시작하기</button>
        </div>
      ))}
    </div>
  );
};

export default EmotionSlider;
