import { useNavigate } from 'react-router-dom';
import '../../styles/Inquiry.css';
import { useDrawerStore } from '../../stores/useDrawerStore';

export default function Inquiry() {
  const navigate = useNavigate();
  const { setShouldAutoOpen } = useDrawerStore();

  return (
    <div className="inquiry-container">
      <div className="inquiry-header">
        <span
          className="inquiry-back"
          onClick={() => {
            setShouldAutoOpen(true); // 플래그 설정
            navigate('/main');
          }}
        >
          ←
        </span>
        <span className="inquiry-title">문의하기</span>
      </div>

      <div className="inquiry-body">
        <p className="inquiry-label">답변받으실 이메일</p>
        <input
          type="email"
          className="inquiry-input"
          placeholder="000님(이메일)"
        />
        <input className="inquiry-input" placeholder="제목" />
        <textarea className="inquiry-textarea" placeholder="내용 작성" />
        <button className="inquiry-submit">문의하기</button>
      </div>
    </div>
  );
}
