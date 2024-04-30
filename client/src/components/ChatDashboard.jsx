// frontend/src/components/ChatDashboard.js
import React, {useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ChatDashboard = () => {
    const [users, setUsers] = useState([]);

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
    <div>
      <h2>Chat Dashboard</h2>
      <ul>
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
