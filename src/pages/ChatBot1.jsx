import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ChatBot.css';
import Character from '../assets/characters/login-character.png';
import Drawer from '../assets/icons/drawer.png'; // 폴더 이미지
import { FiHeart, FiSend } from 'react-icons/fi'; // 빈 하트 아이콘
import { AiFillHeart } from 'react-icons/ai'; // 채워진 하트 아이콘

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

  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const chatBodyRef = useRef(null);

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
    if (input.trim() === '') return;

    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    setMessages((prev) => [...prev, { sender: 'user', text: input, time }]);
    setInput('');
  };

  // 회복 문장 저장 모달 열기
  const handleSave = (actualIdx) => {
    if (savedMessageIds.includes(actualIdx)) {
      setSavedMessageIds((prev) => prev.filter((id) => id !== actualIdx));
      setShowFolderModal(false);
      return;
    }

    setTempSelectedIdx(actualIdx);
    setSelectedFolders([]);
    setShowFolderModal(true);
  };

  // 회복 문장 저장 확정
  const handleConfirm = () => {
    if (tempSelectedIdx !== null && selectedFolders.length > 0) {
      if (!savedMessageIds.includes(tempSelectedIdx)) {
        setSavedMessageIds((prev) => [...prev, tempSelectedIdx]);
      }
    }
    setShowFolderModal(false);
    setTempSelectedIdx(null);
    setSelectedFolders([]);
  };

  // 회복 문장 폴더 생성
  const handleAddFolder = () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    if (folders.includes(trimmed)) {
      setFolderError('이미 같은 이름의 서랍장이 있어요!');
      return;
    }

    setFolders((prev) => [...prev, trimmed]);
    setSelectedFolders((prev) => [...prev, trimmed]);
    setNewFolderName('');
    setIsAddingFolder(false);
    setFolderError('');
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
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
            {folders.map((folder, index) => {
              const inputId = `folder-${index}`;
              return (
                <li key={index}>
                  <label htmlFor={inputId} className="folder-option">
                    <input
                      type="checkbox"
                      id={inputId}
                      checked={selectedFolders.includes(folder)}
                      onChange={() => {
                        setSelectedFolders((prev) =>
                          prev.includes(folder)
                            ? prev.filter((f) => f !== folder)
                            : [...prev, folder]
                        );
                      }}
                    />
                    <span>{folder}</span>
                  </label>
                </li>
              );
            })}

            {isAddingFolder ? (
              <li className="new-folder">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => {
                    setNewFolderName(e.target.value);
                    setFolderError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddFolder();
                  }}
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

export default ChatBot1;
