// 역할극 정보 입력 페이지
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
import Swal from 'sweetalert2';
import Character from '../assets/characters/login-character.png';
import '../styles/RolePlay.css';

// 역할극 질문 목록 정의
const steps = [
  { id: 1, question: '상대방의 호칭을 알려주세요.' },
  { id: 2, question: '상대방과의 관계를 알려주세요.' },
  { id: 3, question: '상대방의 말투는 어떤가요?' },
  { id: 4, question: '상대방의 성격은 어떤가요?' },
  { id: 5, question: '상대방과 어떤 상황이었나요?' },
];

function RolePlay() {
  const navigate = useNavigate();
  // 현재 질문 단계 상태
  const [step, setStep] = useState(0);
  // 각 질문에 대한 답변 저장 배열
  const [answers, setAnswers] = useState(Array(steps.length).fill(''));
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const [fadeOut, setFadeOut] = useState(false);

  // 진입 시 역할 존재 여부 확인
  useEffect(() => {
    const checkCharacter = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        // 로그인되지 않은 경우 경고 후 로그인 페이지 이동
        Swal.fire({
          title: '로그인이 필요합니다.',
          text: '로그인 후 다시 시도해 주세요.',
          icon: 'warning',
          confirmButtonColor: '#ffa158',
        }).then(() => navigate('/login'));
        return;
      }

      try {
        const res = await api.get(`/character/${userId}/exists`);
        // 이미 역할이 존재하는 경우 → 바로 채팅 페이지로 이동
        if (res.data === true) {
          navigate('/roleplay/chat');
        }
      } catch (error) {
        console.error('역할 존재 여부 확인 실패:', error);
      }
    };

    checkCharacter();
  }, [navigate]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  // 입력창 높이 자동 조절
  const handleChange = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // 다음 질문 또는 제출 처리
  const handleNext = async () => {
    if (inputValue.trim() === '') return;

    // 현재 입력 저장
    const updated = [...answers];
    updated[step] = inputValue;
    setAnswers(updated);
    setInputValue('');

    // 다음 질문으로 이동
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          Swal.fire({
            title: '오류!',
            text: '로그인이 필요합니다.',
            icon: 'error',
            confirmButtonColor: '#d33',
          });
          navigate('/login');
          return;
        }

        // 최종 제출 - API 요청 payload 구성
        const payload = {
          userId,
          name: updated[0],
          relationship: updated[1],
          tone: updated[2],
          personality: updated[3],
          situation: updated[4],
        };

        const res = await api.post('/character', payload);
        const characterId = res.data;

        // 성공 알림 후 페이드 아웃 → 역할극 채팅 화면 이동
        Swal.fire({
          title: '역할 저장 완료!',
          text: '이제 역할극을 시작해볼까요?',
          icon: 'success',
          confirmButtonColor: '#ffa158',
        }).then(() => {
          setFadeOut(true);
          setTimeout(() => {
            navigate('/roleplay/chat', {
              state: { characterId, userId },
            });
          }, 300);
        });
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || '역할을 저장하지 못했습니다.';
        Swal.fire({
          title: '실패!',
          text: errorMsg,
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  return (
    <div className={`roleplay-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="roleplay-header">
        <span
          className="back-button"
          onClick={() => {
            if (step > 0) {
              setStep(step - 1);
              setInputValue(answers[step - 1] || '');
            } else {
              navigate(-1);
            }
          }}
        >
          ←
        </span>
        <span
          className="roleplay-title"
          onClick={() => navigate('/main')}
          style={{ cursor: 'pointer' }} // 👉 클릭 가능하게 커서 스타일 변경
        >
          Milo.
        </span>
        <span className="header-space" />
      </div>

      {/* 본문 영역 */}
      <div className="roleplay-body">
        {step === 0 && <p className="greeting">안녕하굴! 👋</p>}
        <img src={Character} alt="milo 캐릭터" className="roleplay-character" />

        {/* 진행률 바 */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        <div className="progress-step">
          {step + 1}/{steps.length}
        </div>

        {/* 질문 출력 */}
        <p className="prompt-text">{steps[step].question}</p>

        {/* 사용자 입력창 */}
        <textarea
          className="target-input"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleNext();
            }
          }}
          placeholder="입력해 주세요"
          rows={1}
          ref={inputRef}
        />

        {/* 이전 입력값 표시 */}
        {answers[step] && (
          <p className="previous-answer">이전 입력: {answers[step]}</p>
        )}

        <button className="next-button" onClick={handleNext}>
          {step === steps.length - 1 ? '작성 완료' : '다음'}
        </button>
      </div>
    </div>
  );
}

export default RolePlay;
