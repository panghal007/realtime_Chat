// frontend/src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      console.log(response.data); // Assuming the server sends back a JWT token
      navigate('/chat');
      // Redirect or perform additional actions upon successful login
    } catch (error) {
      console.error(error.response.data);
      // Handle error (e.g., display error message to the user)
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
