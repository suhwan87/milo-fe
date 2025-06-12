import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ChatBot.css';
import Character from '../assets/characters/login-character.png';
import { FiSend } from 'react-icons/fi';

const ChatBot1 = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '안녕하세요,\n오늘 하루 어떠셨나요?',
      time: '00:00',
    },
    {
      sender: 'user',
      text: '너무 지쳤어 아무것도 하기 싫고\n그냥 숨고 싶은 느낌이야',
      time: '00:00',
    },
    {
      sender: 'bot',
      text: '그런 날도 있죠. 너무 애쓰지 않아도 괜찮아요.\n어떤 일이 있었는지 조금 나눠줄 수 있을까요?',
      time: '00:00',
    },
  ]);
  const [input, setInput] = useState('');
  const chatBodyRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = 0;
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

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="back-button" onClick={() => navigate(-1)}>
          ←
        </span>
        <span className="chat-title">Milo.</span>
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

export default ChatBot1;
