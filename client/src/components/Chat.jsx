// frontend/src/components/Chat.js
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { jwtDecode } from "jwt-decode";
import { useParams } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";


const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const { recipientId } = useParams();
  const [recipientStatus, setRecipientStatus] = useState('AVAILABLE');
  const [chat, setChat] = useState(null); 
  const [userStatus, setUserStatus] = useState('AVAILABLE'); // New state variable for user status

  // const [msg, setMsg] = useState(null);
  useEffect(() => {
    const fetchRecipientStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch(`http://localhost:5001/api/users/${recipientId}/status`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const status = await response.json();
          setRecipientStatus(status);
        } else {
          setRecipientStatus('BUSY');
        }
      } else {
        setRecipientStatus('BUSY');
      }
    };

    fetchRecipientStatus();
      // Fetch the recipient's status every 5 seconds
  const intervalId = setInterval(fetchRecipientStatus, 10000);

  // Cleanup function
  return () => {
    clearInterval(intervalId);
  };
  }, [recipientId]);


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

  const handleStatusChange = async (e) => {
    setUserStatus(e.target.value);

    // Update user status in the backend
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    await fetch(`http://localhost:5001/api/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: e.target.value })
    });
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (messageInput.trim() === '') return;
    const token = localStorage.getItem('token'); // Retrieve JWT token from local storage
    const decodedToken = jwtDecode(token); // Decode JWT token
    const senderUserId = decodedToken.userId; // Extract user ID from decoded token
    const messageData = {
      content: messageInput,
      sender: senderUserId, // Include sender's user ID
      recipient: recipientId  // Include recipient's user ID (if applicable)
    };
  
    if (recipientStatus === 'BUSY') {
      // Initialize the GoogleGenerativeAI
      const genAI = new GoogleGenerativeAI('AIzaSyAr2inA2m7LQrygx8kfa-9uIKhUKlN9f-c');
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
      // Start a new chat or continue the existing chat
      if (!chat) {
        const newChat = await model.startChat({
          history: [],
          generationConfig: {
            maxOutputTokens: 100,
          },
        });
        setChat(newChat);
      }
  
      // Generate a response using the GoogleGenerativeAI
      const result = await chat.sendMessage(messageInput);
      const response = await result.response;
      const autoResponse = response.text();
  
      socket.emit('message', { content: autoResponse, sender: recipientId, recipient: senderUserId });
    } else {
      socket.emit('message', messageData);
    }
  
    setMessageInput('');
  };
  

  return (
    <div>
      <select value={userStatus} onChange={handleStatusChange}>
        <option value="AVAILABLE">AVAILABLE</option>
        <option value="BUSY">BUSY</option>
      </select>
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



//AIzaSyAr2inA2m7LQrygx8kfa-9uIKhUKlN9f-c