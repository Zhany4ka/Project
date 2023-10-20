import React, { useRef, useEffect , useState} from 'react';

export function Message({ message, onEdit, onDelete, sender, handleReport, index, setReplyingToMessage, openModal, goToOriginalMessage }) {
  // eslint-disable-next-line
  const isCurrentUserOrAdmin = message.sender === sender || sender === "Admin";

  const messageRef = useRef(null);
  useEffect(() => {
    if (message.isTargeted) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [message.isTargeted]);

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const handleRightClick = (event) => {
    event.preventDefault();
    setShowContextMenu(true);
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const closeContextMenu = () => {
    setShowContextMenu(false);
  };

  useEffect(() => {
    window.addEventListener('click', closeContextMenu);
    return () => window.removeEventListener('click', closeContextMenu);
  }, []);


  return (
    <div className={`message outgoing ${message.isTargeted ? 'flashing-message' : ''}`} ref={messageRef} onContextMenu={handleRightClick}>
      <span className="sender">{message.sender}:</span>

      {message.replyTo && (
        <div className="replied-message" onClick={() => goToOriginalMessage(message.replyTo)}>
          <span className="replied-sender">{message.replyTo.sender}: </span>
          {message.replyTo.text}
        </div>
      )}

      <span>{message.text}</span>

      {message.file && <a href={message.file} target="_blank" rel="noreferrer" download={message.fileName}>📎</a>}
      
      {showContextMenu && (
        <div
          className="contextMenu"
          style={{
            top: `${contextMenuPosition.y}px`,
            left: `${contextMenuPosition.x}px`,
          }}
        >
          {message.sender === sender && (
            <>
              <button onClick={() => {
                openModal({
                  title: "Редактировать сообщение",
                  body: "Введите новый текст сообщения:",
                  input: true,
                  onConfirm: (inputValue) => {
                    const newText = inputValue;
                    if (newText !== null) onEdit(newText);
                  }
                });
                setShowContextMenu(false); // закрываем меню после клика
              }}>
                Редактировать
              </button>
              <button onClick={() => {
                onDelete();
                setShowContextMenu(false); // закрываем меню после клика
              }}>
                Удалить
              </button>
            </>
          )}
          <button onClick={() => {
            setReplyingToMessage(message);
            setShowContextMenu(false); // закрываем меню после клика
          }}>
            Ответить
          </button>
        </div>
      )}
    </div>
  );


}
