// src/pages/MainPage.jsx
import React from 'react';
import Header from 'components/Header';
import EmotionSlider from 'components/EmotionSlider';
import EmotionKeyword from 'components/EmotionKeyword';
import EmotionChart from 'components/EmotionChart';
import 'styles/App.css'; // global css 연결

const MainPage = () => {
  return (
    <div className="#root">
      <Header />
      <EmotionSlider />
      <EmotionKeyword />
      <EmotionChart />
    </div>
  );
};

export default MainPage;
