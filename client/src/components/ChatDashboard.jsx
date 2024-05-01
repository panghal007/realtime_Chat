// frontend/src/components/ChatDashboard.js
import React, {useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ChatDashboard.css';

const ChatDashboard = () => {
    const [users, setUsers] = useState([]);
    const email=localStorage.getItem('email');

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:5000/api/users/getusers');
      const users = await response.json();
      setUsers(users);
    };

    fetchUsers();
  }, []);

  // Function to handle recipient selection
  const handleRecipientSelect = (recipientId) => {
    setRecipientId(recipientId);
  };

  return (
    <div className="chat-dashboard-container">
      <h1>Welcome {email}</h1>
      <h2>Chat Dashboard</h2>
      <ul className="chat-dashboard-list">
        {users.map(user => (
          <li key={user._id}>
            <Link to={`/chat/${user._id}`}>{user.email}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatDashboard;
