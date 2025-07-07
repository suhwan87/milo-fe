// 상담형 챗봇 페이지
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ChatBot.css';
import Character from '../assets/characters/login-character.png';
import Drawer from '../assets/icons/drawer.png';
import { FiHeart, FiSend } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import api from '../config/axios';
import Swal from 'sweetalert2';

const ChatBot1 = () => {
  // 채팅 관련 상태
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const chatBodyRef = useRef(null);

  // 회복 문장 저장 관련 상태
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [savedMessageIds, setSavedMessageIds] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [folderError, setFolderError] = useState('');
  const [tempSelectedIdx, setTempSelectedIdx] = useState(null);

  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const inputRef = useRef(null);

  // 현재 세션의 고유 키 생성
  const getSessionKey = () => {
    const userId = localStorage.getItem('userId');
    return `chatMessages_${userId}`;
  };

  // 메시지를 localStorage에 저장
  const saveMessagesToStorage = (messagesToSave) => {
    try {
      const sessionKey = getSessionKey();
      localStorage.setItem(sessionKey, JSON.stringify(messagesToSave));
    } catch (error) {
      console.error('메시지 저장 실패:', error);
    }
  };

  // localStorage에서 메시지 불러오기
  const loadMessagesFromStorage = () => {
    try {
      const sessionKey = getSessionKey();
      const stored = localStorage.getItem(sessionKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('메시지 불러오기 실패:', error);
      return [];
    }
  };

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // 메시지 변경 시 localStorage에 저장
  useEffect(() => {
    if (messages.length > 0) {
      saveMessagesToStorage(messages);
    }
  }, [messages]);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    const initializeChat = async () => {
      setIsLoading(true);

      try {
        // 기존 메시지 불러오기
        const savedMessages = loadMessagesFromStorage();

        if (savedMessages.length > 0) {
          // 기존 메시지가 있으면 복원
          setMessages(savedMessages);
          setIsLoading(false);
        } else {
          // 기존 메시지가 없으면 초기 인사말 가져오기 및 메시지 배열에 추가
          const userId = localStorage.getItem('userId');
          const res = await api.get(`/api/chat/init?user_id=${userId}`);
          const greetingMessage = res.data.output.split('\n')[0];

          // 초기 인사말을 메시지 배열에 추가
          const initialMessage = {
            sender: 'bot',
            text: greetingMessage,
            time: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            isGreeting: true, // 인사말 구분용 플래그
          };

          setMessages([initialMessage]);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('채팅 초기화 실패:', err);
        setIsLoading(false);
      }

      // 입력창에 포커스
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    initializeChat();
  }, []);

  useEffect(() => {
    const isBotWaiting = messages.some((msg) => msg.waiting);
    if (!isBotWaiting && inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [messages, isLoading]);

  // 메시지 전송 및 응답
  const handleSend = async () => {
    if (input.trim() === '') return;

    const isWaiting = messages.some((msg) => msg.waiting);
    if (isWaiting) {
      Swal.fire({
        icon: 'info',
        title: '마일로가 응답 중이에요',
        text: '응답이 끝난 후에 메시지를 보낼 수 있어요.',
      });
      return;
    }

    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // 1. 사용자 메시지를 화면에 즉시 렌더링
    setMessages((prev) => [...prev, { sender: 'user', text: input, time }]);

    // 2. 입력창 초기화
    setInput('');

    // 3. GPT 응답 대기 메시지 추가
    const waitingMessage = {
      sender: 'bot',
      text: '마일로 응답중',
      time,
      waiting: true,
    };
    setMessages((prev) => [...prev, waitingMessage]);

    try {
      const response = await api.post('/api/chat/send', {
        message: input,
      });

      const replyTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      // GPT 응답 수신 후 "대기 메시지"를 실제 응답으로 대체
      setMessages((prev) => {
        const newMessages = [...prev];
        const index = newMessages.findIndex((msg) => msg.waiting);
        if (index !== -1) {
          newMessages[index] = {
            sender: 'bot',
            text: response.data.output ?? '(응답 없음)',
            time: replyTime,
          };
        }
        return newMessages;
      });
    } catch (err) {
      console.error('[❌응답 실패] 메시지:', input);
      console.error('[❌응답 실패] 전체 에러 객체:', err);
      console.error('[❌응답 실패] 응답 내용:', err?.response?.data);
    }
  };

  // 메시지 url 하이퍼링크
  const linkifyTextLine = (line) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const parts = line.split(urlRegex);

    return parts.map((part, idx) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={idx}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'blue', wordBreak: 'break-all' }}
          >
            {part}
          </a>
        );
      } else {
        return <span key={idx}>{part}</span>;
      }
    });
  };

  // 채팅 종료 시 localStorage 정리
  const clearStoredMessages = () => {
    try {
      const sessionKey = getSessionKey();
      localStorage.removeItem(sessionKey);
    } catch (error) {
      console.error('저장된 메시지 삭제 실패:', error);
    }
  };

  // 사용자가 채팅을 종료(뒤로가기)
  const handleExit = async () => {
    localStorage.clear();
    const isWaiting = messages.some((msg) => msg.waiting);
    if (isWaiting) {
      Swal.fire({
        icon: 'info',
        title: '마일로가 아직 응답 중이에요!',
        text: '응답이 완료되면 종료할 수 있어요.',
      });
      return;
    }

    // 인사말만 있는 경우엔 저장 X (isGreeting 플래그로 확인)
    const hasOnlyGreeting = messages.length === 1 && messages[0].isGreeting;

    if (messages.length === 0 || hasOnlyGreeting) {
      clearStoredMessages(); // localStorage 정리
      navigate('/main');
      return;
    }

    Swal.fire({
      title: '저장 중...',
      text: '오늘의 대화를 정리하고 있어요.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await api.post('/api/session/end');
      const { status } = res.data;

      if (status === 'no_messages') {
        Swal.close();
        clearStoredMessages(); // localStorage 정리
        navigate('/main');
        return;
      }

      Swal.fire({
        icon: 'success',
        title: '채팅이 종료되었어요',
        text: '오늘의 대화가 저장되었어요!',
        confirmButtonText: '확인',
      }).then(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
          localStorage.setItem(`lastChatEnd_${userId}`, Date.now().toString());
        }
        clearStoredMessages(); // localStorage 정리
        navigate('/main');
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '종료에 실패했어요',
        text: '다시 시도해주세요.',
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

    setShowFolderModal(false);
    setTempSelectedIdx(null);
    setSelectedFolders([]);
  };

  // 회복 문장 폴더 목록 불러오기
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await api.get('/api/recovery/folders');
        setFolders(res.data);
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

  // 로딩 중일 때 표시할 컴포넌트
  if (isLoading) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <span className="back-button" onClick={() => navigate('/main')}>
            ←
          </span>
          <span className="chat-title">Milo.</span>
          <span className="header-space" />
        </div>
        <div
          className="chat-body"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div>채팅을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="back-button" onClick={() => handleExit()}>
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
                      {(msg.text ?? '').split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`message-bubble ${msg.sender}`}>
                      {msg.waiting ? (
                        <p>
                          {msg.text}
                          <span className="typing-dots">
                            <span className="typing-dot">.</span>
                            <span className="typing-dot">.</span>
                            <span className="typing-dot">.</span>
                          </span>
                        </p>
                      ) : (
                        msg.text
                          .split('\n')
                          .map((line, i) => (
                            <p key={i}>{linkifyTextLine(line)}</p>
                          ))
                      )}
                    </div>

                    {!msg.waiting && !msg.isGreeting && (
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
                )}
              </div>
            </div>
          );
        })}

        {/* 초기 인사말은 더 이상 별도로 렌더링하지 않음 (메시지 배열에 포함됨) */}
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <button
          className="send-button"
          onClick={handleSend}
          disabled={messages.some((msg) => msg.waiting)}
        >
          <FiSend size={22} color="#000" />
        </button>
      </div>

      {/* 회복 문장 저장 모달 */}
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

export default ChatBot1;
