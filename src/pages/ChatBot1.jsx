import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ChatBot.css';
import Character from '../assets/characters/login-character.png';
import Drawer from '../assets/icons/drawer.png'; // 폴더 이미지
import { FiHeart, FiSend } from 'react-icons/fi'; // 빈 하트 아이콘
import { AiFillHeart } from 'react-icons/ai'; // 채워진 하트 아이콘
import api from '../config/axios'; // ✅ axios 인스턴스
import Swal from 'sweetalert2';

const ChatBot1 = () => {
  const [messages, setMessages] = useState([]);

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

  // ✅ 메시지 추가 시 자동 스크롤
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // ✅ 메시지 전송 및 응답
  const handleSend = async () => {
    if (input.trim() === '') return;

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
      text: '마일로가 응답을 작성 중입니다...',
      time,
      waiting: true, // 구분용
    };
    setMessages((prev) => [...prev, waitingMessage]);

    try {
      // 4. 토큰 등 정보 설정
      // 5. 백엔드로 메시지 전송
      const response = await api.post('/api/chat/send', {
        message: input,
      });

      // 6. GPT 응답 수신 및 메시지 추가
      const replyTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      // 6. GPT 응답 수신 후 "대기 메시지"를 실제 응답으로 대체
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
      console.error('응답 실패:', err);
    }
  };

  // ✅ 회복 문장 저장 모달 열기
  const handleSave = async (actualIdx) => {
    // 저장 여부 확인
    const saved = savedMessageIds.find((item) => item.index === actualIdx);

    if (saved) {
      // 저장된 경우 → 삭제 요청
      try {
        await api.delete('/api/recovery/sentence', {
          data: {
            content: messages[actualIdx].text,
          },
        });

        setSavedMessageIds((prev) =>
          prev.filter((item) => item.index !== actualIdx)
        );
        setShowFolderModal(false); // 혹시 열려 있던 모달 닫기
        Swal.fire('삭제 완료', '저장된 문장이 삭제되었어요.', 'success');
      } catch (err) {
        console.error('삭제 실패:', err);
        Swal.fire('삭제 실패', '서버에서 문장 삭제에 실패했어요.', 'error');
      }

      return; // 여기서 반드시 함수 종료
    }

    // 저장 안 된 경우만 모달 열기
    setTempSelectedIdx(actualIdx);
    setSelectedFolders([]);
    setShowFolderModal(true);
  };

  // ✅ 회복 문장 저장 확정
  const handleConfirm = async () => {
    if (tempSelectedIdx !== null && selectedFolders.length > 0) {
      try {
        await Promise.all(
          selectedFolders.map(async (folder) => {
            await api.post('/api/recovery/sentence', {
              folderId: folder.folderId,
              content: messages[tempSelectedIdx].text,
            });
          })
        );
        setSavedMessageIds((prev) => [
          ...prev,
          { index: tempSelectedIdx, folderId: selectedFolders[0].folderId },
        ]);
      } catch (err) {
        console.error('문장 저장 실패:', err);
        Swal.fire('저장 실패', '문장을 저장하는 데 실패했어요.', 'error');
      }
    }
    setShowFolderModal(false);
    setTempSelectedIdx(null);
    setSelectedFolders([]);
  };

  // ✅ 회복 문장 폴더 생성
  const handleAddFolder = async () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;

    // 중복 체크 (프론트단)
    if (folders.find((f) => f.folderName === trimmed)) {
      setFolderError('이미 같은 이름의 서랍장이 있어요!');
      return;
    }

    try {
      const res = await api.post('/api/recovery/folder/create', {
        folderName: trimmed,
      });

      setFolders((prev) => [...prev, res.data]); // 새 폴더 추가
      setNewFolderName('');
      setIsAddingFolder(false);
    } catch (err) {
      setFolderError(err.response?.data || '폴더 생성 중 오류 발생');
    }
  };

  // ✅ 폴더 목록 받아오기
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

  // ✅ 사용자가 채팅을 종료(뒤로가기)
  const handleExit = async () => {
    // 1. 저장 중 알림 표시
    Swal.fire({
      title: '저장 중...',
      text: '오늘의 대화를 정리하고 있어요.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // 2. FastAPI 호출
      const res = await api.post('/api/session/end');
      console.log('✅ 종료 응답:', res.data);

      // 3. 저장 성공 시 알림 변경
      Swal.fire({
        icon: 'success',
        title: '채팅이 종료되었어요',
        text: '오늘의 대화가 저장되었어요!',
        confirmButtonText: '확인',
      }).then(() => {
        navigate('/main');
      });
    } catch (err) {
      console.error('❌ 종료 오류:', err);

      // 4. 실패 시 에러 알림
      Swal.fire({
        icon: 'error',
        title: '종료에 실패했어요',
        text: '다시 시도해주세요.',
      });
    }
  };

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
                      {(msg.text ?? '').split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
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
