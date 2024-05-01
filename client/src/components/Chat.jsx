// frontend/src/components/Chat.js
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./Chat.css";
import dotenv from 'dotenv';


const Chat = () => {
   // State variables
   
   const [socket, setSocket] = useState(null);
   const [messages, setMessages] = useState([]);
   const [messageInput, setMessageInput] = useState("");
   const [recipientStatus, setRecipientStatus] = useState("AVAILABLE");
   const [chat, setChat] = useState(null);
   const [userStatus, setUserStatus] = useState("AVAILABLE");
 
   // Extract recipientId from the URL parameters
   const { recipientId } = useParams();
 
   // Retrieve JWT token from local storage and decode it to get the userId
   const token = localStorage.getItem('token');
   const email=localStorage.getItem('email');
   const decodedToken = jwtDecode(token);
   const userId = decodedToken.userId;
 
  // Fetch the recipient's status
  useEffect(() => {
    const fetchRecipientStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch(
          `http://localhost:5001/api/users/${recipientId}/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const status = await response.json();
          setRecipientStatus(status);
        } else {
          setRecipientStatus("BUSY");
        }
      } else {
        setRecipientStatus("BUSY");
      }
    };

    fetchRecipientStatus();
    // Fetch the recipient's status every 5 seconds
    const intervalId = setInterval(fetchRecipientStatus, 10000);

    // Cleanup function
    return () => {
      clearInterval(intervalId);
    };
  }, [recipientId, token]);

  // Fetch messages between the current user and the recipient
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const senderId = decodedToken.userId;
      const response = await fetch(
        `http://localhost:5000/api/users/messages/${senderId}/${recipientId}`
      );
      const messages = await response.json();
      setMessages(messages);
    };

    fetchMessages();
  }, [recipientId]);

  // Initialize the socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:5001");
    setSocket(newSocket);
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    newSocket.emit("userConnected", userId);

    return () => newSocket.close();
  }, []);

  // Listen for incoming messages and store them in database
  useEffect(() => {
    if (socket) {
      const messageListener = (message) => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        const otherUserId = recipientId;

        // Check if the message is for the current conversation
        if (
          (message.sender === userId && message.recipient === otherUserId) ||
          (message.sender === otherUserId && message.recipient === userId)
        ) {
          setMessages((prevMessages) => [...prevMessages, message]);

          // Store the message in the database
          const storeMessage = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch(
              "http://localhost:5000/api/users/messages",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(message),
              }
            );
            if (!response.ok) {
              console.error("Failed to store message");
            }
          };

          storeMessage();
        }
      };

      socket.on("message", messageListener);

      // Cleanup function
      return () => {
        socket.off("message", messageListener);
      };
    }
  }, [socket]);

  // Update user status
  const handleStatusChange = async (e) => {
    setUserStatus(e.target.value);

    // Update user status in the backend
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    await fetch(`http://localhost:5001/api/users/${userId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: e.target.value }),
    });
  };

  // Handle message submission
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    const trimmedMessageInput = messageInput.trim();
    if (trimmedMessageInput === "") return;
    const token = localStorage.getItem("token"); // Retrieve JWT token from local storage
    const decodedToken = jwtDecode(token); // Decode JWT token
    const senderUserId = decodedToken.userId; // Extract user ID from decoded token
    const messageData = {
      content: trimmedMessageInput,
      sender: senderUserId, // Include sender's user ID
      recipient: recipientId, // Include recipient's user ID (if applicable)
    };
    setMessages((prevMessages) => [...prevMessages, messageData]);

    const response = await fetch('http://localhost:5000/api/users/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(messageData)
    });
    if (!response.ok) {
      console.error('Failed to store message');
    }
  
    if (recipientStatus === "BUSY") {
      // Initialize the GoogleGenerativeAI
      const genAI = new GoogleGenerativeAI(
        process.env.REACT_APP_GOOGLE_AI_KEY  // API key
      );
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // Start a new chat or continue the existing chat
      let currentChat = chat;
      if (!currentChat) {
        currentChat = await model.startChat({
          history: [],
          generationConfig: {
            maxOutputTokens: 100,
          },
        });
        setChat(currentChat);
      }

      // Generate a response using the GoogleGenerativeAI
      const result = await currentChat.sendMessage(trimmedMessageInput);
      const response = await result.response;
      const autoResponse = response.text();

      socket.emit("message", {
        content: autoResponse,
        sender: recipientId,
        recipient: senderUserId,
      });
    } else {
      socket.emit("message", messageData);
    }

    setMessageInput("");
  };

  return (
    <div>
      <div className="navbar">
      <h2>Chatting with: {recipientId}</h2>
    </div>
      <select value={userStatus} onChange={handleStatusChange}>
        <option value="AVAILABLE">AVAILABLE</option>
        <option value="BUSY">BUSY</option>
      </select>
      <h2>Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === userId ? "message-sent" : "message-received"
            }
          >
            <p>{msg.content}</p>
            <p>From: {msg.sender}</p>
          </div>
        ))}
      </div>
      <form className="message-form" onSubmit={handleMessageSubmit}>
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
    </div>
  );
};

export default Chat;

//AIzaSyAr2inA2m7LQrygx8kfa-9uIKhUKlN9f-c
