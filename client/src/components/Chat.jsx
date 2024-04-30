// frontend/src/components/Chat.js
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { jwtDecode } from "jwt-decode";
import { useParams } from 'react-router-dom';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const { recipientId } = useParams();
  // const [msg, setMsg] = useState(null);
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const senderId = decodedToken.userId;
      const response = await fetch(`http://localhost:5000/api/users/messages/${senderId}/${recipientId}`);
      const messages = await response.json();
      setMessages(messages);
    };

    fetchMessages();
  }, [recipientId]);

  useEffect(() => {
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      const messageListener = (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
      };

      socket.on('message', messageListener);

      // Cleanup function
      return () => {
        socket.off('message', messageListener);
      };
    }
  }, [socket]);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (messageInput.trim() === '') return;
    const token = localStorage.getItem('token'); // Retrieve JWT token from local storage
    const decodedToken = jwtDecode(token); // Decode JWT token
    const senderUserId = decodedToken.userId; // Extract user ID from decoded token
    console.log(senderUserId);
    console.log(recipientId);
    const messageData = {
      content: messageInput,
      sender: senderUserId, // Include sender's user ID
      recipient: recipientId  // Include recipient's user ID (if applicable)
    };
    socket.emit('message', messageData);
    setMessageInput('');
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <p>{msg.content}</p>
            <p>From: {msg.sender}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleMessageSubmit}>
        <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
