import React from 'react';
import './Sidebar.css';

function Sidebar({ username, channels, currentChannel, activeUsers, onSwitchChannel }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Sircord</h2>
        <div className="user-info">
          <div className="user-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
          <span className="username">{username}</span>
        </div>
      </div>
      
      <div className="channels-section">
        <h3>Channels</h3>
        <ul className="channel-list">
          {channels.map((channel) => (
            <li 
              key={channel} 
              className={channel === currentChannel ? 'active' : ''}
              onClick={() => onSwitchChannel(channel)}
            >
              # {channel}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="users-section">
        <h3>Online Users</h3>
        <ul className="user-list">
          {activeUsers.map((user, index) => (
            <li key={index}>
              <div className="user-avatar small">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user.username}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
