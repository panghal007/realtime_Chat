// Define a Mongoose schema for chat messages
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message; // Export the Message model
