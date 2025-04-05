import React, { useState, useRef, useEffect } from 'react';
import './ChatArea.css';

function ChatArea({ messages, username, currentChannel, onSendMessage }) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-area">
      <div className="chat-header">
        <h3># {currentChannel}</h3>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Be the first to say something!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id || message.timestamp} 
              className={`message ${message.username === username ? 'own-message' : ''} ${message.username === 'System' ? 'system-message' : ''}`}
            >
              {message.username !== 'System' && (
                <div className="message-avatar">
                  {message.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="message-content">
                {message.username !== 'System' && (
                  <div className="message-header">
                    <span className="message-username">{message.username}</span>
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                )}
                <div className="message-text">{message.text}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={`Message #${currentChannel}`}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatArea;
