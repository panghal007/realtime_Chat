import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './components/Chat'; // Import the Chat component
import ChatDashboard from './components/ChatDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ChatDashboard />} /> {/* ChatDashboard route */}
        <Route path="/chat/:recipientId" element={<Chat />} /> {/* Chat route with recipient ID as a parameter */}
      </Routes>
    </Router>
  );
};

export default App;
