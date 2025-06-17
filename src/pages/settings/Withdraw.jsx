import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../styles/Withdraw.css';
import Character from '../../assets/characters/crying-character.png';
import Flower from '../../assets/icons/flower.png';
import { FiLock } from 'react-icons/fi';
import { useDrawerStore } from '../../stores/useDrawerStore';

export default function Withdraw() {
  const navigate = useNavigate();
  const { openDrawer } = useDrawerStore();
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState(false);

  const { setShouldAutoOpen } = useDrawerStore();

  const handleWithdraw = () => {
    if (password !== '1234') {
      setError(true);
      return;
    }

    setError(false);

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
        setStep(2);
      }
    });
  };

  return (
    <div className="withdraw-container">
      {/* STEP 1: 비밀번호 입력 */}
      {step === 1 && (
        <div>
          <div className="withdraw-header">
            {/* ← 뒤로가기 버튼은 step 1에서만 표시 */}
            <span
              className="back-button"
              onClick={() => {
                setShouldAutoOpen(true); // 플래그 설정
                navigate('/main');
              }}
            >
              ←
            </span>
            <span className="withdraw-title">회원탈퇴</span>
          </div>
          <div className="withdraw-wraper">
            <h2 className="withdraw-check">비밀번호를 확인합니다.</h2>
            <div className="withdraw-input-wrapper">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={isFocused ? '' : '현재 비밀번호를 입력해주세요.'}
                className="withdraw-input"
              />
              <FiLock className="withdraw-input-icon" />
            </div>

            {error && <p className="withdraw-error">다시 한번 확인해주세요.</p>}
            <button className="withdraw-button" onClick={handleWithdraw}>
              탈퇴하기
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: 탈퇴 완료 메시지 */}
      {step === 2 && (
        <div className="withdraw-success">
          <img src={Character} alt="탈퇴완료" className="success-image" />
          <p className="success-text">회원탈퇴가 완료되었습니다.</p>
          <button
            className="withdraw-button"
            onClick={() => navigate('/login')}
          >
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
