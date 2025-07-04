// 회원 탈퇴 페이지
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../styles/Withdraw.css';
import Character from '../../assets/characters/crying-character.png';
import Flower from '../../assets/icons/flower.png';
import { FiLock } from 'react-icons/fi';
import api from '../../config/axios';

export default function Withdraw() {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState(false);

  const userId = localStorage.getItem('userId');
  const isKakaoUser = userId?.startsWith('kakao_'); // ✅ 소셜 로그인 유저 확인

  // ✅ step 상태 (ref + state 이중 관리)
  const stepRef = useRef(1);
  const [stepState, setStepState] = useState(1);
  const setStep = (val) => {
    stepRef.current = val;
    setStepState(val);
  };

  // ✅ 탈퇴 API 요청
  const requestWithdraw = async () => {
    try {
      await api.delete('/api/users/delete', {
        data: isKakaoUser ? {} : { password },
      });

      setStep(2); // ✅ 탈퇴 완료 화면 먼저 전환

      // ✅ 로컬 상태 정리 (조금 뒤에)
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.setItem('justDeleted', 'true');
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(true);
      Swal.fire({
        icon: 'error',
        title: '탈퇴 실패',
        text:
          err.response?.data ||
          '비밀번호가 일치하지 않거나 서버 오류가 발생했습니다.',
        confirmButtonColor: '#d33',
        confirmButtonText: '확인',
      });
    }
  };

  // ✅ 탈퇴 확인 모달
  const handleWithdraw = () => {
    if (!isKakaoUser && !password) {
      setError(true);
      return;
    }

    Swal.fire({
      title: '정말 탈퇴하시겠어요?',
      imageUrl: Character,
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니요',
      customClass: {
        popup: 'popup',
        title: 'popup-title',
        image: 'popup-image',
        actions: 'popup-actions',
        confirmButton: 'popup-yes-button',
        cancelButton: 'popup-no-button',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        requestWithdraw();
      }
    });
  };

  // ✅ STEP 2 → 확인 버튼 클릭 시
  const handleConfirm = () => {
    localStorage.removeItem('justDeleted');

    const userId = localStorage.getItem('userId');
    const isKakaoUser = userId?.startsWith('kakao_');

    if (isKakaoUser) {
      const REST_API_KEY = 'aabaae0d39dbd263ec77dc1cbf25e85f';
      const redirectUri =
        window.location.hostname === 'localhost'
          ? 'http://localhost:3000/login'
          : 'http://211.188.59.173:3000/login';

      window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${REST_API_KEY}&logout_redirect_uri=${redirectUri}`;
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="withdraw-container">
      {/* STEP 1: 탈퇴 확인 단계 */}
      {stepState === 1 && (
        <div>
          <div className="withdraw-header">
            <span
              className="back-button"
              onClick={() => {
                navigate('/main', { state: { autoOpenDrawer: true } });
              }}
            >
              ←
            </span>
            <span className="withdraw-title">회원탈퇴</span>
          </div>

          <div className="withdraw-wraper">
            <h2 className="withdraw-check">
              {isKakaoUser ? '정말 탈퇴하시겠어요?' : '비밀번호를 확인합니다.'}
            </h2>

            {/* 일반 로그인 유저 → 비밀번호 입력 */}
            {!isKakaoUser && (
              <>
                <div className="withdraw-input-wrapper">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={
                      isFocused ? '' : '현재 비밀번호를 입력해주세요.'
                    }
                    className="withdraw-input"
                  />
                  <FiLock className="withdraw-input-icon" />
                </div>

                {error && (
                  <p className="withdraw-error">
                    비밀번호를 다시 확인해주세요.
                  </p>
                )}
              </>
            )}

            <button className="withdraw-button" onClick={handleWithdraw}>
              탈퇴하기
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: 탈퇴 완료 화면 */}
      {stepState === 2 && (
        <div className="withdraw-success">
          <img src={Character} alt="탈퇴완료" className="success-image" />
          <p className="success-text">회원탈퇴가 완료되었습니다.</p>
          <button className="withdraw-button" onClick={handleConfirm}>
            확인
          </button>
          <div className="footer">
            <img src={Flower} alt="flower" />
            <p className="footer-text">
              우리의 기록은 여기까지지만,
              <br />
              당신의 행복은 계속되기를 바라요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
