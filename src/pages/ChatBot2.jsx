import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/ChatBot.css';
import Character from '../assets/characters/login-character.png';
import { FiSend } from 'react-icons/fi';
import Swal from 'sweetalert2';

const ChatBot2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stepAnswers =
    location.state?.answers ||
    JSON.parse(localStorage.getItem('roleplayAnswers')) ||
    [];

  const initialMessages = stepAnswers.length
    ? [
        {
          sender: 'bot',
          text: `역할극을 시작할게요.\n상대방은 ${stepAnswers[0]}이고, ${stepAnswers[1]} 관계예요.\n말투는 ${stepAnswers[2]}, 성격은 ${stepAnswers[3]}이며,\n상황은 "${stepAnswers[4]}"입니다.`,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]
    : [];

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;

    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    setMessages((prev) => [...prev, { sender: 'user', text: input, time }]);
    setInput('');
  };

  const handleEnd = () => {
    Swal.fire({
      title: '정말 종료하시겠어요?',
      text: '입력한 역할극 정보가 모두 삭제됩니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '취소',
      confirmButtonColor: '#ff9f4a',
      cancelButtonColor: '#dcdcdc',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('roleplayAnswers');
        navigate('/main');
      }
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="back-button" onClick={() => navigate('/main')}>
          ←
        </span>
        <span className="chat-title">Milo.</span>
        <span className="end-button" onClick={handleEnd}>
          종료
        </span>
        <span className="header-space" />
      </div>

      <div className="chat-body" ref={chatBodyRef}>
        {[...messages].reverse().map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            {msg.sender === 'bot' && (
              <div className="bot-avatar">
                <img
                  src={Character}
                  alt="milo 캐릭터"
                  className="bot-character"
                />
                <div className="bot-name">{stepAnswers[0]}</div>
              </div>
            )}
            <div className={`bubble-wrapper ${msg.sender}`}>
              {msg.sender === 'user' ? (
                <>
                  <div className="timestamp">{msg.time}</div>
                  <div className={`message-bubble ${msg.sender}`}>
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className={`message-bubble ${msg.sender}`}>
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  <div className="timestamp">{msg.time}</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="상담 메시지 입력"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <button className="send-button" onClick={handleSend}>
          <FiSend size={22} color="#000" />
        </button>
      </div>
    </div>
  );
};

export default ChatBot2;
