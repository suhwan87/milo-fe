// 메인 페이지
import React from 'react';
import EmotionSlider from 'components/EmotionSlider';
import EmotionKeyword from 'components/EmotionKeyword';
import EmotionArchive from 'components/EmotionArchive';
import 'styles/App.css';

const MainPage = () => {
  return (
    <div className="app-frame">
      {/* 실제 콘텐츠 */}
      <EmotionSlider />
      <EmotionKeyword />
      <EmotionArchive />
    </div>
  );
};

export default MainPage;
