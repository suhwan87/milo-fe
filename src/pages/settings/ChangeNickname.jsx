import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ChangeNickname.css';
import { useDrawerStore } from '../../stores/useDrawerStore';
import Swal from 'sweetalert2';

export default function ChangeNickname() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');

  const { setShouldAutoOpen } = useDrawerStore();

  const currentNickname = '민지'; // 예시: 현재 닉네임 (서버에서 불러온 값이라 가정)

  const handleSubmit = () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    if (trimmed === currentNickname) {
      setError('현재 닉네임과 동일합니다.');
      return;
    }

    setError('');

    Swal.fire({
      title: '닉네임 변경 완료!',
      text: `'${trimmed}'으로 저장되었어요.`,
      icon: 'success',
      confirmButtonText: '확인',
      confirmButtonColor: '#ff9f4a',
    }).then(() => navigate(-1));
  };

  return (
    <div className="nickname-container">
      {/* 헤더 */}
      <div className="nickname-header">
        <span
          className="nickname-back"
          onClick={() => {
            setShouldAutoOpen(true); // 플래그 설정
            navigate('/main');
          }}
        >
          ←
        </span>
        <span className="nickname-title">닉네임 변경</span>
      </div>

      {/* 본문 */}
      <div className="nickname-wrapper">
        <p className="nickname-guide">닉네임을 변경해주세요.</p>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? '' : '닉네임을 입력해주세요.'}
          className="nickname-input"
        />
        {error && <p className="nickname-error">{error}</p>}
      </div>
      <button className="nickname-button" onClick={handleSubmit}>
        완료
      </button>
    </div>
  );
}
