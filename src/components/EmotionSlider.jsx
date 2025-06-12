import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/EmotionSlider.css';

import main1 from '../assets/characters/main1.png';
import main2 from '../assets/characters/main2.png';

const EmotionSlider = () => {
  const paginationRef = useRef(null);
  const [isReady, setIsReady] = useState(false); // ✅ 타이밍 제어용 상태
  const navigate = useNavigate();

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

  useEffect(() => {
    // ✅ ref가 렌더링된 뒤에만 Swiper 활성화
    setIsReady(true);
  }, []);

  // ✅ 시작하기 버튼 클릭 핸들러
  const handleStart = (index) => {
    const selected = slides[index].title;

    if (selected === '상담형') {
      navigate('/chat'); // 상담형일 때만 이동
    } else if (selected === '감정 리허설') {
      const storedAnswers = localStorage.getItem('roleplayAnswers');
      if (storedAnswers) {
        const answers = JSON.parse(storedAnswers);
        navigate('/roleplay/chat', { state: { answers } }); // 👉 챗봇2로 바로
      } else {
        navigate('/roleplay'); // 👉 역할 정보 입력
      }
    }
  };

  return (
    <div className="slider-container">
      {isReady && (
        <Swiper
          slidesPerView={1.1}
          spaceBetween={20}
          centeredSlides={true}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: paginationRef.current,
          }}
          onSwiper={(swiper) => {
            if (swiper.params.pagination && paginationRef.current) {
              swiper.params.pagination.el = paginationRef.current;
              swiper.pagination.init();
              swiper.pagination.render();
              swiper.pagination.update();
            }
          }}
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
                <button
                  className="slide-button"
                  onClick={() => handleStart(index)}
                >
                  시작하기
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* ✅ 바깥 인디케이터 DOM은 항상 존재 */}
      <div className="custom-pagination" ref={paginationRef}></div>
    </div>
  );
};

export default EmotionSlider;
