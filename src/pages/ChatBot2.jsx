import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/ChatBot.css';
import Character from '../assets/characters/login-character.png';
import Swal from 'sweetalert2';
import Drawer from '../assets/icons/drawer.png';
import { FiHeart, FiSend } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';

const ChatBot2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const chatBodyRef = useRef(null);

  // 역할극 정보 불러오기
  const [messages, setMessages] = useState(() => {
    const answers =
      location.state?.answers ||
      JSON.parse(localStorage.getItem('roleplayAnswers')) ||
      [];

    return answers.length
      ? [
          {
            sender: 'bot',
            text: `역할극을 시작할게요.\n상대방은 ${answers[0]}이고, ${answers[1]} 관계예요.\n말투는 ${answers[2]}, 성격은 ${answers[3]}이며,\n상황은 "${answers[4]}"입니다.`,
            time: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ]
      : [];
  });

  const [input, setInput] = useState('');
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [savedMessageIds, setSavedMessageIds] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [folderError, setFolderError] = useState('');
  const [tempSelectedIdx, setTempSelectedIdx] = useState(null);

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // 메시지 전송
  const handleSend = () => {
    if (!input.trim()) return;
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setMessages((prev) => [...prev, { sender: 'user', text: input, time }]);
    setInput('');
  };

  // 회복 문장 저장 모달 열기
  const handleSave = (idx) => {
    if (savedMessageIds.includes(idx)) {
      setSavedMessageIds((prev) => prev.filter((id) => id !== idx));
      setShowFolderModal(false);
      return;
    }
    setTempSelectedIdx(idx);
    setSelectedFolders([]);
    setShowFolderModal(true);
  };

  // 회복 문장 저장 확정
  const handleConfirm = () => {
    if (tempSelectedIdx !== null && selectedFolders.length > 0) {
      setSavedMessageIds((prev) => [...new Set([...prev, tempSelectedIdx])]);
    }
    setShowFolderModal(false);
    setTempSelectedIdx(null);
    setSelectedFolders([]);
  };

  // 회복 문장 폴더 생성
  const handleAddFolder = () => {
    const trimmed = newFolderName.trim();
    if (!trimmed || folders.includes(trimmed)) {
      setFolderError('이미 같은 이름의 서랍장이 있어요!');
      return;
    }
    setFolders((prev) => [...prev, trimmed]);
    setSelectedFolders((prev) => [...prev, trimmed]);
    setNewFolderName('');
    setIsAddingFolder(false);
    setFolderError('');
  };

  // 역할극 종료 처리(모든 설정 삭제)
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
        {[...messages].reverse().map((msg, idx) => {
          const actualIdx = messages.length - 1 - idx;
          return (
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
                    <div
                      className="heart-icon"
                      onClick={() => handleSave(actualIdx)}
                    >
                      {savedMessageIds.includes(actualIdx) ? (
                        <AiFillHeart size={16} color="#FF9F4A" />
                      ) : (
                        <FiHeart size={16} color="#FF9F4A" />
                      )}
                    </div>
                    <div className="timestamp">{msg.time}</div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="상담 메시지 입력"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="send-button" onClick={handleSend}>
          <FiSend size={22} color="#000" />
        </button>
      </div>

      {/* 회복 문장 저장 모달*/}
      {showFolderModal && (
        <div className="folder-modal">
          <div className="modal-title">
            <img src={Drawer} alt="drawer icon" className="drawer-icon" />
            문장을 저장할 폴더 선택
          </div>
          <ul className="folder-list">
            {folders.map((folder, index) => (
              <li key={index}>
                <label className="folder-option">
                  <input
                    type="checkbox"
                    checked={selectedFolders.includes(folder)}
                    onChange={() =>
                      setSelectedFolders((prev) =>
                        prev.includes(folder)
                          ? prev.filter((f) => f !== folder)
                          : [...prev, folder]
                      )
                    }
                  />
                  <span>{folder}</span>
                </label>
              </li>
            ))}
            {isAddingFolder ? (
              <li className="new-folder">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => {
                    setNewFolderName(e.target.value);
                    setFolderError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFolder()}
                  placeholder="폴더 이름 입력"
                />
                <button
                  className="create-folder-button"
                  onClick={handleAddFolder}
                >
                  생성
                </button>
                {folderError && (
                  <div className="folder-error">{folderError}</div>
                )}
              </li>
            ) : (
              <li onClick={() => setIsAddingFolder(true)}>➕ 새 폴더 만들기</li>
            )}
          </ul>
          <div className="modal-buttons">
            <button onClick={() => setShowFolderModal(false)}>취소</button>
            <button onClick={handleConfirm}>저장</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot2;
