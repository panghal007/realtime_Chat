// frontend/src/components/Chat.js
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

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
    socket.emit('message', messageInput);
    setMessageInput('');
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
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
