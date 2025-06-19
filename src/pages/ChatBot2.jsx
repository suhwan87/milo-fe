import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
import Swal from 'sweetalert2';
import Character from '../assets/characters/login-character.png';
import Drawer from '../assets/icons/drawer.png';
import { FiHeart, FiSend } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import '../styles/ChatBot.css';

const ChatBot2 = () => {
  const navigate = useNavigate();
  const chatBodyRef = useRef(null);
  const userId = localStorage.getItem('userId');

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [savedMessageIds, setSavedMessageIds] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [folderError, setFolderError] = useState('');
  const [tempSelectedIdx, setTempSelectedIdx] = useState(null);

  // 시간 포맷
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // 사용자 인증 및 대화 불러오기
  useEffect(() => {
    if (!userId) {
      Swal.fire({
        title: '오류 발생',
        text: '사용자 정보를 찾을 수 없습니다.',
        icon: 'error',
      }).then(() => navigate('/main'));
      return;
    }
    fetchLogs();
  }, [userId, navigate]);

  // 메시지 자동 스크롤 및 로컬 저장
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
    if (userId) {
      localStorage.setItem(
        `roleplayMessages_${userId}`,
        JSON.stringify(messages)
      );
    }
  }, [messages, userId]);

  // 서버로부터 대화 로그 가져오기
  const fetchLogs = async () => {
    try {
      const res = await api.get(`/api/roleplay/logs?userId=${userId}`);
      const logs = res.data.flatMap((log) => [
        {
          sender: 'user',
          text: log.sender,
          time: formatTime(log.createdAt),
        },
        {
          sender: 'bot',
          text: log.responder,
          time: formatTime(log.createdAt),
        },
      ]);
      setMessages(logs);
    } catch (err) {
      console.error('대화 로그 불러오기 실패:', err);
    }
  };

  // 메시지 전송
  const handleSend = async () => {
    if (!input.trim()) return;

    const userTime = formatTime(new Date());
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: input, time: userTime },
    ]);
    setInput('');

    try {
      const res = await api.post('/api/roleplay', { user_id: userId, input });
      const botReply = res.data.output || '응답을 받아오지 못했습니다.';
      const botTime = formatTime(new Date());
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: botReply, time: botTime },
      ]);
    } catch {
      Swal.fire({
        title: '전송 실패',
        text: 'GPT 응답을 받아오지 못했어요.',
        icon: 'error',
      });
    }
  };

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

  const handleConfirm = () => {
    if (tempSelectedIdx !== null && selectedFolders.length > 0) {
      setSavedMessageIds((prev) => [...new Set([...prev, tempSelectedIdx])]);
    }
    setShowFolderModal(false);
    setTempSelectedIdx(null);
    setSelectedFolders([]);
  };

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
        localStorage.removeItem(`roleplayMessages_${userId}`);
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
                <div className={`message-bubble ${msg.sender}`}>
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                {msg.sender === 'bot' ? (
                  <>
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
                ) : (
                  <div className="timestamp">{msg.time}</div>
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
