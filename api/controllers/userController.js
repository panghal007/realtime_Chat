const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../config");
const Message = require('../models/message');


// User registration
const signup = async (req, res) => {
  try {
    const { email, password } = req.body; // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    } // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Create new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User login
const login = async (req, res) =>{
  try {
    const { email, password } = req.body; // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    } // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }

};

// Fetch user by ID
const getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Fetch user by email
  const getUserByEmail = async (req, res) => {
    try {
      const userEmail = req.params.email;
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Update user information
  const updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const updates = req.body;
      const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Delete user account
  const deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
      await User.findByIdAndDelete(userId);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  const getUser = async (req, res) => {
    try {
      
      const user =await User.find({});
      res.json(user);
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  const getMessages = async (req, res) => {
    const { senderId, recipientId } = req.params;
    const messages = await Message.find({
    $or: [
      { sender: senderId, recipient: recipientId },
      { sender: recipientId, recipient: senderId }
    ]
  });
  res.json(messages);
};
const getUserStatus = async (req, res) => { 
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json( user.status );
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const updateUserStatus = async (req, res) => {
    try {
        const userId = req.params.userId;
        const status = req.body.status;
        await User.findByIdAndUpdate(userId, { status });
        res.json({ message: 'User status updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const storeMessage = async (req, res) => {
  try {
    const { content, sender, recipient } = req.body;
    const message = new Message({ content, sender, recipient });
    await message.save();
    res.status(201).json({ message: 'Message stored successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

  module.exports = {
    signup,
    login,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser, 
    getUser,
    getMessages,
    getUserStatus,
    updateUserStatus,
    storeMessage,

  };
