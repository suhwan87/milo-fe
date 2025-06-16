// src/pages/RolePlay.jsx
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Character from '../assets/characters/login-character.png';
import '../styles/RolePlay.css';

const steps = [
  { id: 1, question: '상대방의 이름을 알려주세요.' },
  { id: 2, question: '상대방과의 관계를 알려주세요.' },
  { id: 3, question: '상대방의 말투는 어떤가요?' },
  { id: 4, question: '상대방의 성격은 어떤가요?' },
  { id: 5, question: '상대방과 어떤 상황이었나요?' },
];

const RolePlay = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(steps.length).fill(''));
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto'; // 높이 초기화
    e.target.style.height = `${e.target.scrollHeight}px`; // 내용에 맞게 자동 증가
  };

  const handleNext = () => {
    if (inputValue.trim() === '') return;

    const updated = [...answers];
    updated[step] = inputValue;

    setAnswers(updated);
    setInputValue('');

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('roleplayAnswers', JSON.stringify(updated));
      // ✅ 마지막 단계에서 입력값들과 함께 페이지 이동
      navigate('/roleplay/chat', { state: { answers: updated } });
    }
  };

  return (
    <div className="roleplay-container">
      <div className="roleplay-header">
        <span
          className="back-button"
          onClick={() => {
            if (step > 0) {
              setStep(step - 1);
              setInputValue(answers[step - 1] || ''); // 이전 값 복원
            } else {
              navigate(-1); // 첫 단계일 땐 원래대로 페이지 이동
            }
          }}
        >
          ←
        </span>
        <span className="roleplay-title">Milo.</span>
        <span className="header-space" />
      </div>

      <div className="roleplay-body">
        {step === 0 && <p className="greeting">안녕하굴! 👋</p>}
        <img src={Character} alt="milo 캐릭터" className="roleplay-character" />

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        <div className="progress-step">
          {step + 1}/{steps.length}
        </div>

        <p className="prompt-text">{steps[step].question}</p>

        <textarea
          className="target-input"
          value={inputValue}
          onChange={handleChange}
          placeholder="입력해 주세요"
          rows={1}
          ref={inputRef}
        />

        {answers[step] && (
          <p className="previous-answer">이전 입력: {answers[step]}</p>
        )}

        <button className="next-button" onClick={handleNext}>
          {step === steps.length - 1 ? '작성 완료' : '다음'}
        </button>
      </div>
    </div>
  );
};

export default RolePlay;
