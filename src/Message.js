import React, { useRef, useEffect } from 'react';

export function Message({ message, onEdit, onDelete, sender, handleReport, index, setReplyingToMessage, openModal, goToOriginalMessage }) {
  const isCurrentUserOrAdmin = message.sender === sender || sender === "Admin";

  const messageRef = useRef(null);
  useEffect(() => {
    if (message.isTargeted) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [message.isTargeted]);


  return (
    <div className={`message outgoing ${message.isTargeted ? 'flashing-message' : ''}`} ref={messageRef}>
      <span className="sender">{message.sender}:</span>
      {message.replyTo && (

        <div className="replied-message" onClick={() => goToOriginalMessage(message.replyTo)}>
          <span className="replied-sender">{message.replyTo.sender}: </span>
          {message.replyTo.text}
        </div>
      )}
      <span>{message.text}</span>
      {message.file && <a href={message.file} target="_blank" rel="noreferrer" download={message.fileName}>📎</a>}
      {isCurrentUserOrAdmin && (
        <>
          <button onClick={() => {
            openModal({
              title: "Редактировать сообщение",
              body: "Введите новый текст сообщения:",
              input: true,
              onConfirm: (inputValue) => {
                console.log("Новый текст сообщения:", inputValue);
                const newText = inputValue;
                if (newText !== null) onEdit(newText);

              }
            });
          }}>
            ✎
          </button>
          <button onClick={() => onDelete()}>
            ✖
          </button>
        </>
      )}
      <button
        className="replybutt"
        onClick={() => setReplyingToMessage(message)}>
        ⬎
      </button>
    </div>
  );
}
