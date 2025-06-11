import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/EmotionSlider.css';

import main1 from '../assets/characters/main1.png';
import main2 from '../assets/characters/main2.png';

const EmotionSlider = () => {
  const paginationRef = useRef(null);

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
    <div className="slider-container">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        pagination={{
          el: paginationRef.current,
          clickable: true,
        }}
        onSwiper={(swiper) => {
          // Swiper 초기화 후에 ref 연결
          setTimeout(() => {
            if (
              swiper.params.pagination &&
              typeof swiper.params.pagination.el === 'string'
            ) {
              swiper.params.pagination.el = paginationRef.current;
              swiper.pagination.init();
              swiper.pagination.update();
            }
          });
        }}
        modules={[Pagination]}
        className="custom-swiper"
      >
        {slides.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="slide-card">
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
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ✅ 반드시 DOM에 있어야 함 */}
      <div className="custom-pagination" ref={paginationRef}></div>
    </div>
  );
};

export default EmotionSlider;
