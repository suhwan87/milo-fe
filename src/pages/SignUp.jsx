// 회원가입 페이지
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';
import api from '../config/axios';
import Swal from 'sweetalert2';

function SignUp() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  // 입력 상태 관리
  const [id, setId] = useState('');
  const [idMessage, setIdMessage] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

  // 약관 동의 상태
  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // 모달 표시 상태
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  // 에러 메시지
  const [passwordFormatError, setPasswordFormatError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [agreementError, setAgreementError] = useState('');

  // 아이디 중복 확인 핸들러
  const handleCheckDuplicate = async () => {
    if (!id) {
      setIdMessage('아이디를 입력해주세요.');
      return;
    }
    const idRegex = /^[A-Za-z0-9]{6,20}$/;
    if (!idRegex.test(id)) {
      setIdMessage('아이디는 영문+숫자 6~20자만 가능합니다.');
      setIsIdAvailable(false);
      return;
    }
    try {
      const response = await api.get('/api/users/check-id', {
        params: { id },
      });

      if (response.data === true) {
        setIsIdAvailable(true);
        setIdMessage('사용 가능한 아이디입니다.');
      } else {
        setIsIdAvailable(false);
        setIdMessage('이미 존재하는 아이디입니다.');
      }
    } catch (error) {
      console.error(error);
      setIsIdAvailable(false);
      setIdMessage('⚠️ 중복 확인 중 오류가 발생했습니다.');
    }
  };

  // 회원가입 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 초기화
    setPasswordFormatError('');
    setPasswordMatchError('');
    setAgreementError('');

    // 유효성 검사
    const idRegex = /^[A-Za-z0-9]{6,20}$/;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,20}$/;
    if (!idRegex.test(id)) {
      setIdMessage('아이디는 영문+숫자 6~20자만 가능합니다.');
      return;
    }
    if (!passwordRegex.test(password)) {
      setPasswordFormatError('8~20자, 문자/숫자/특수문자를 포함해야 합니다.');
      return;
    }

    if (password !== passwordConfirm) {
      setPasswordMatchError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!agreeService || !agreePrivacy) {
      setAgreementError('약관 동의는 필수입니다.');
      return;
    }

    // 회원가입 요청
    try {
      await api.post('/api/users/register', {
        userId: id,
        password,
        nickname,
        email,
      });

      // 성공 시 알림 후 로그인 페이지 이동
      Swal.fire({
        title: '회원가입 완료!',
        text: '로그인 페이지로 이동합니다 😊',
        icon: 'success',
        confirmButtonColor: '#ffa158',
        confirmButtonText: '확인',
      }).then(() => {
        setFadeOut(true);
        setTimeout(() => navigate('/login'), 300);
      });
    } catch (error) {
      Swal.fire({
        title: '회원가입 실패!',
        text: error.response?.data || '서버 오류가 발생했습니다.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: '확인',
      });
    }
  };

  return (
    <div className={`signup ${fadeOut ? 'fade-out' : ''}`}>
      <button
        className="signup-back-button"
        onClick={() => window.history.back()}
      >
        ←
      </button>
      {/* 회원가입 폼 */}
      <div className="signup">
        <h2 className="logo2">Milo.</h2>
        <p className="subtitle">가입을 환영합니다.</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          {/* 아이디 입력 + 중복확인 */}
          <label>아이디</label>
          <div className="input-with-button">
            <input
              type="text"
              placeholder="아이디 입력(6~20자)"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <button
              type="button"
              className="check-btn"
              onClick={handleCheckDuplicate}
            >
              중복확인
            </button>
          </div>
          {isIdAvailable !== null && (
            <p className={`id-message ${isIdAvailable ? 'valid' : 'invalid'}`}>
              {idMessage}
            </p>
          )}

          {/* 비밀번호 */}
          <label>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호 입력(비밀번호는 8~20자, 문자/숫자/특수문자 포함)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordFormatError && (
            <p className="error-message">{passwordFormatError}</p>
          )}

          <label>비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호 재입력"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          {passwordMatchError && (
            <p className="error-message">{passwordMatchError}</p>
          )}

          {/* 닉네임 */}
          <label>닉네임</label>
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          {/* 이메일 */}
          <label>이메일</label>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="checkbox-row">
            {/* 개인정보 수집 및 이용 */}
            <label htmlFor="privacy" className="checkbox-label">
              <input
                type="checkbox"
                id="privacy"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
              />
              <span className="terms-text">개인정보 수집 및 이용</span>
            </label>
            <span
              className="required"
              onClick={() => setShowPrivacyModal(true)} // 더보기 모달은 (필수)를 클릭해야 열림
              style={{ cursor: 'pointer' }}
            >
              (필수)
            </span>

            <br />

            {/* 서비스 이용약관 */}
            <label htmlFor="service" className="checkbox-label">
              <input
                type="checkbox"
                id="service"
                checked={agreeService}
                onChange={(e) => setAgreeService(e.target.checked)}
              />
              <span className="terms-text">서비스 이용약관</span>
            </label>
            <span
              className="required"
              onClick={() => setShowServiceModal(true)}
              style={{ cursor: 'pointer' }}
            >
              (필수)
            </span>
          </div>

          {agreementError && <p className="error-message">{agreementError}</p>}

          {/* 회원가입 제출 버튼 */}
          <button type="submit" className="submit-btn">
            Sign up
          </button>
        </form>

        {/* 개인정보 모달 */}
        {showPrivacyModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowPrivacyModal(false)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>개인정보 수집 및 이용</h3>
              <p>
                당신의 정보는 마일로가 소중히 다룰게요!
                <br />
                오직 상담을 위한 목적으로만 사용되며, 몰래 팔거나 엿보는 일은
                절대 없습니다.
                <br />
                마일로는 약속을 잘 지키는 너구리에요 헿{' '}
              </p>
              <button onClick={() => setShowPrivacyModal(false)}>닫기</button>
            </div>
          </div>
        )}

        {showServiceModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowServiceModal(false)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>서비스 이용약관</h3>
              <p>
                1. 마일로는 여러분의 감정을 진심으로 존중합니다
                <br />
                2. 지나치게 심한 말, 부적절한 내용은 자동으로 마일로가 거릅니다
                <br />
                3. 마일로는 언제든지 떠날 수 있지만, 되돌아오면 항상 반겨드려요
                <br />
                4. 상담 내용은 몰래 저장하거나 공유하지 않아요, 비밀은
                지켜드립니다
                <br />
                5. 간혹 마일로도 답변이 느릴 수 있어요…
                <br />
                <br />위 내용에 동의하시면, 마일로와 마음 챙김 여행을
                떠나볼까요?
              </p>
              <button onClick={() => setShowServiceModal(false)}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;
