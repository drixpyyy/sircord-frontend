import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

// For development, replace with your actual backend URL when deployed
const BACKEND_URL = 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentChannel, setCurrentChannel] = useState('general');
  const [channels, setChannels] = useState(['general', 'random']);
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  // Initialize socket connection
  useEffect(() => {
    if (isLoggedIn) {
      const newSocket = io(BACKEND_URL);
      setSocket(newSocket);
      
      return () => {
        newSocket.disconnect();
      };
    }
  }, [isLoggedIn]);

  // Set up socket event listeners
  useEffect(() => {
    if (socket) {
      // Join the default channel
      socket.emit('join', { username, channel: currentChannel });
      
      // Listen for messages
      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
      
      // Listen for user list updates
      socket.on('userList', (users) => {
        setActiveUsers(users);
      });
      
      // Fetch channels
      fetch(`${BACKEND_URL}/api/channels`)
        .then(res => res.json())
        .then(data => setChannels(data))
        .catch(err => console.error('Error fetching channels:', err));
      
      // Fetch messages for current channel
      fetch(`${BACKEND_URL}/api/channels/${currentChannel}/messages`)
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error('Error fetching messages:', err));
      
      return () => {
        socket.off('message');
        socket.off('userList');
      };
    }
  }, [socket, username, currentChannel]);

  const handleLogin = (username) => {
    if (username.trim()) {
      setUsername(username);
      setIsLoggedIn(true);
    }
  };

  const handleSendMessage = (message) => {
    if (socket && message.trim()) {
      socket.emit('message', { text: message });
    }
  };

  const handleSwitchChannel = (channel) => {
    if (socket && channel !== currentChannel) {
      socket.emit('switchChannel', channel);
      setCurrentChannel(channel);
      setMessages([]);
      
      // Fetch messages for new channel
      fetch(`${BACKEND_URL}/api/channels/${channel}/messages`)
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error('Error fetching messages:', err));
    }
  };

  return (
    <div className="app">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="main">
          <Sidebar 
            username={username}
            channels={channels}
            currentChannel={currentChannel}
            activeUsers={activeUsers}
            onSwitchChannel={handleSwitchChannel}
          />
          <ChatArea 
            messages={messages}
            username={username}
            currentChannel={currentChannel}
            onSendMessage={handleSendMessage}
          />
        </div>
      )}
    </div>
  );
}

export default App;
