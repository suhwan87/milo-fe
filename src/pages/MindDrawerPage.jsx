import React, { useEffect, useRef, useState } from 'react';
import FolderDetailView from '../components/FolderDetailView';
import '../styles/MindDrawerPage.css';

const COLOR_CLASS_COUNT = 7;
const COLOR_STORAGE_KEY = 'milo-folder-color-classes';
const FOLDER_STORAGE_KEY = 'milo-folder-list';

const generateColorClasses = (length) => {
  const result = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * COLOR_CLASS_COUNT) + 1;
    result.push(`color-${randomIndex}`);
  }
  return result;
};

const MindDrawerPage = () => {
  const [drawerList, setDrawerList] = useState([]);
  const [colorClasses, setColorClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const menuRef = useRef(null);

  useEffect(() => {
    const storedFolders = JSON.parse(
      localStorage.getItem(FOLDER_STORAGE_KEY)
    ) || [
      { title: '위로용 문장', count: 5 },
      { title: '안정용 문장', count: 8 },
      { title: '잠 안 올 때', count: 3 },
      { title: '회복용', count: 2 },
      { title: '감정 아카이브', count: 4 },
    ];
    const storedColors =
      JSON.parse(localStorage.getItem(COLOR_STORAGE_KEY)) ||
      generateColorClasses(storedFolders.length);

    setDrawerList(storedFolders);
    setColorClasses(storedColors);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddFolder = () => setShowModal(true);

  const handleConfirm = () => {
    if (!newFolderName.trim()) return;

    const newFolder = { title: newFolderName.trim(), count: 0 };
    const newColor = `color-${Math.floor(Math.random() * COLOR_CLASS_COUNT) + 1}`;
    const updatedList = [...drawerList, newFolder];
    const updatedColors = [...colorClasses, newColor];

    setDrawerList(updatedList);
    setColorClasses(updatedColors);
    localStorage.setItem(FOLDER_STORAGE_KEY, JSON.stringify(updatedList));
    localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(updatedColors));

    setNewFolderName('');
    setShowModal(false);
  };

  const handleDelete = (index) => {
    const updatedList = drawerList.filter((_, i) => i !== index);
    const updatedColors = colorClasses.filter((_, i) => i !== index);
    setDrawerList(updatedList);
    setColorClasses(updatedColors);
    localStorage.setItem(FOLDER_STORAGE_KEY, JSON.stringify(updatedList));
    localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(updatedColors));
    setActiveMenuIndex(null);
  };

  const handleFolderClick = (folder, idx) => {
    setSelectedFolder({ ...folder, colorClass: colorClasses[idx] });
  };
  const handleCloseDetail = () => setSelectedFolder(null);

  return (
    <>
      {!selectedFolder ? (
        <div className="mind-drawer-container">
          {/* 📌 폴더 목록 UI 전체 */}
          <div className="mind-drawer-header">
            <button
              className="back-button"
              onClick={() => window.history.back()}
            >
              ←
            </button>
            <h2>마음 서랍장</h2>
          </div>

          <div className="mind-drawer-top-buttons">
            <button className="icon-button" onClick={handleAddFolder}>
              ＋
            </button>
            <button className="icon-button">🔍</button>
          </div>

          <div className="mind-drawer-list">
            {drawerList.map((item, idx) => (
              <div
                className={`mind-card ${colorClasses[idx] || 'color-1'}`}
                key={idx}
                onClick={() => handleFolderClick(item, idx)}
              >
                <div className="folder-tab" />
                <div className="card-left">
                  <div
                    className="card-menu-wrapper"
                    ref={activeMenuIndex === idx ? menuRef : null}
                  >
                    <span
                      className="card-menu"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuIndex(
                          activeMenuIndex === idx ? null : idx
                        );
                      }}
                    >
                      ⋮
                    </span>
                    {activeMenuIndex === idx && (
                      <div className="folder-menu">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTargetIndex(idx);
                            setShowDeleteModal(true);
                          }}
                        >
                          🗑 삭제
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="card-icon">🤍</span>
                  <span className="card-title">{item.title}</span>
                </div>
                <span className="card-count">{item.count}</span>
              </div>
            ))}
          </div>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>새 폴더 추가</h3>
                <input
                  type="text"
                  placeholder="폴더 이름을 입력하세요"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
                <div className="modal-buttons">
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setShowModal(false);
                      setNewFolderName('');
                    }}
                  >
                    취소
                  </button>
                  <button className="confirm-btn" onClick={handleConfirm}>
                    확인
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDeleteModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>정말 삭제하시겠습니까?</h3>
                <div className="modal-buttons">
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteTargetIndex(null);
                    }}
                  >
                    취소
                  </button>
                  <button
                    className="confirm-btn"
                    onClick={() => {
                      handleDelete(deleteTargetIndex);
                      setShowDeleteModal(false);
                      setDeleteTargetIndex(null);
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <FolderDetailView folder={selectedFolder} onBack={handleCloseDetail} />
      )}
    </>
  );
};

export default MindDrawerPage;
