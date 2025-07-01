// 역할극 챗봇 페이지
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
  const inputRef = useRef(null);
  const userId = localStorage.getItem('userId');

  // 상태값 정의
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

  // 시간 포맷 함수
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // 컴포넌트 마운트 시 유저 유효성 확인 및 채팅 로그 불러오기
  useEffect(() => {
    // 역할극 로그 불러오기
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

  // 메시지 변경 시 스크롤 하단 이동 및 localStorage에 저장
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

  // 입력창 포커스 관리 - 응답 대기 중이 아닐 때만 포커스
  useEffect(() => {
    const isBotWaiting = messages.some((msg) => msg.waiting);
    if (!isBotWaiting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  // 메시지 전송
  const handleSend = async () => {
    if (!input.trim()) return;

    // 응답 대기 중인지 확인
    const isWaiting = messages.some((msg) => msg.waiting);
    if (isWaiting) {
      Swal.fire({
        icon: 'info',
        title: '마일로가 응답 중이에요',
        text: '응답이 끝난 후에 메시지를 보낼 수 있어요.',
      });
      return;
    }

    const userTime = formatTime(new Date());

    // 1. 사용자 메시지를 화면에 즉시 렌더링
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: input, time: userTime },
    ]);

    // 2. 입력창 초기화
    setInput('');

    // 3. GPT 응답 대기 메시지 추가
    const waitingMessage = {
      sender: 'bot',
      text: '마일로 응답중',
      time: userTime,
      waiting: true,
    };
    setMessages((prev) => [...prev, waitingMessage]);

    try {
      const res = await api.post('/api/roleplay', { user_id: userId, input });
      const botReply = res.data.output || '응답을 받아오지 못했습니다.';
      const botTime = formatTime(new Date());

      // GPT 응답 수신 후 "대기 메시지"를 실제 응답으로 대체
      setMessages((prev) => {
        const newMessages = [...prev];
        const index = newMessages.findIndex((msg) => msg.waiting);
        if (index !== -1) {
          newMessages[index] = {
            sender: 'bot',
            text: botReply,
            time: botTime,
          };
        }
        return newMessages;
      });
    } catch (err) {
      console.error('GPT 응답 실패:', err);
      // 대기 메시지를 오류 메시지로 대체
      setMessages((prev) => {
        const newMessages = [...prev];
        const index = newMessages.findIndex((msg) => msg.waiting);
        if (index !== -1) {
          newMessages[index] = {
            sender: 'bot',
            text: '응답을 받아오지 못했습니다.',
            time: formatTime(new Date()),
          };
        }
        return newMessages;
      });

      Swal.fire({
        title: '전송 실패',
        text: 'GPT 응답을 받아오지 못했어요.',
        icon: 'error',
      });
    }
  };

  // 회복 문장 저장 또는 삭제
  const handleSave = async (actualIdx) => {
    const targetMessage = messages[actualIdx]?.text;
    const alreadySaved = savedMessageIds.some(
      (item) => item.index === actualIdx
    );

    if (!targetMessage) return;

    if (alreadySaved) {
      // 삭제 요청
      try {
        await api.delete('/api/recovery/sentence', {
          data: { content: targetMessage },
        });

        setSavedMessageIds((prev) =>
          prev.filter((item) => item.index !== actualIdx)
        );
        setShowFolderModal(false);
        Swal.fire('삭제 완료', '저장된 문장이 삭제되었어요.', 'success');
      } catch (err) {
        console.error('[handleSave] 삭제 실패:', err);
        Swal.fire('삭제 실패', '서버에서 문장 삭제에 실패했어요.', 'error');
      }
      return;
    }

    // 저장 모달 열기
    setTempSelectedIdx(actualIdx);
    setSelectedFolders([]);
    setShowFolderModal(true);
  };

  // 회복 문장 저장 확정
  const handleConfirm = async () => {
    if (tempSelectedIdx === null || selectedFolders.length === 0) return;

    const targetMessage = messages[tempSelectedIdx]?.text;
    if (!targetMessage) return;

    try {
      await Promise.all(
        selectedFolders.map((folder) =>
          api.post('/api/recovery/sentence', {
            folderId: folder.folderId,
            content: targetMessage,
          })
        )
      );

      setSavedMessageIds((prev) => [
        ...prev,
        { index: tempSelectedIdx, folderId: selectedFolders[0].folderId },
      ]);
      Swal.fire('저장 완료', '문장이 저장되었어요.', 'success');
    } catch (err) {
      console.error('[handleConfirm] 문장 저장 실패:', err);
      Swal.fire('저장 실패', '문장을 저장하는 데 실패했어요.', 'error');
    }

    // 모달 상태 초기화
    setShowFolderModal(false);
    setTempSelectedIdx(null);
    setSelectedFolders([]);
  };

  // 회복 문장 폴더 목록 불러오기
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await api.get('/api/recovery/folders');
        setFolders(res.data); // 서버에서 받은 폴더 리스트 저장
      } catch (err) {
        console.error('폴더 목록 불러오기 실패:', err);
      }
    };

    fetchFolders();
  }, []);

  // 회복 문장 폴더 생성
  const handleAddFolder = async () => {
    const trimmedName = newFolderName.trim();
    if (!trimmedName) return;

    if (folders.some((f) => f.folderName === trimmedName)) {
      setFolderError('이미 같은 이름의 서랍장이 있어요!');
      return;
    }

    try {
      const res = await api.post('/api/recovery/folder/create', {
        folderName: trimmedName,
      });

      setFolders((prev) => [...prev, res.data]);
      setNewFolderName('');
      setIsAddingFolder(false);
      setFolderError('');
    } catch (err) {
      console.error('[handleAddFolder] 폴더 생성 실패:', err);
      setFolderError(err.response?.data || '폴더 생성 중 오류 발생');
    }
  };

  // 역할극 종료 처리
  const handleEnd = () => {
    const isWaiting = messages.some((msg) => msg.waiting);
    if (isWaiting) {
      Swal.fire({
        icon: 'info',
        title: '마일로가 아직 응답 중이에요!',
        text: '응답이 완료되면 종료할 수 있어요.',
      });
      return;
    }

    Swal.fire({
      title: '정말 종료하시겠어요?',
      text: '입력한 역할극 정보가 모두 삭제됩니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '취소',
      confirmButtonColor: '#ff9f4a',
      cancelButtonColor: '#dcdcdc',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/character/${userId}`);
          localStorage.removeItem(`roleplayMessages_${userId}`);
          navigate('/main');
        } catch (err) {
          Swal.fire({
            title: '삭제 실패',
            text: '역할극 종료 처리 중 오류가 발생했어요.',
            icon: 'error',
          });
        }
      }
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="back-button" onClick={() => navigate('/main')}>
          ←
        </span>
        <span className="role-chat-title">Milo.</span>
        <span className="end-button" onClick={handleEnd}>
          리허설 종료
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
                    <p key={i}>
                      {line}
                      {msg.waiting && (
                        <span className="typing-dots">
                          <span className="typing-dot">.</span>
                          <span className="typing-dot">.</span>
                          <span className="typing-dot">.</span>
                        </span>
                      )}
                    </p>
                  ))}
                </div>
                {msg.sender === 'bot' ? (
                  <>
                    {!msg.waiting && (
                      <div
                        className="heart-icon"
                        onClick={() => handleSave(actualIdx)}
                      >
                        {savedMessageIds.find(
                          (item) => item.index === actualIdx
                        ) ? (
                          <AiFillHeart size={16} color="#FF9F4A" />
                        ) : (
                          <FiHeart size={16} color="#FF9F4A" />
                        )}
                      </div>
                    )}
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
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            messages.some((msg) => msg.waiting)
              ? '응답 대기 중입니다...'
              : '상담 메시지 입력'
          }
          disabled={messages.some((msg) => msg.waiting)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="send-button"
          onClick={handleSend}
          disabled={messages.some((msg) => msg.waiting)}
        >
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
                    <span>{folder.folderName}</span>
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

export default ChatBot2;
