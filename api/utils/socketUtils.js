// backend/utils/socketUtils.js
const socketIo = require('socket.io');
const Message = require('../models/message');

const configureSocketIO = (server, port) => {
  const io = socketIo(server, {
    cors: {
      origin: '*',
    },
  });

  // io.on('connection', (socket) => {
  //   console.log('New client connected');

  //   // Handle incoming messages
  //   socket.on('message', async (message) => {
  //     // Broadcast the message to all connected clients
  //     const newMessage = new Message(message);
  //     await newMessage.save();
  //     io.emit('message', message);
  //   });

  //   // Handle disconnection
  //   socket.on('disconnect', () => {
  //     console.log('Client disconnected');
  //   });
  // });
  let userSocketMap = new Map();
  io.on('connection', (socket) => {
    socket.on('userConnected', (userId) => {
      userSocketMap.set(userId, socket.id);
    });
  
    socket.on('message', (messageData) => {
      const recipientSocketId = userSocketMap.get(messageData.recipient);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('message', messageData);
      }
    });
  
    socket.on('disconnect', () => {
      for (let [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });

  // Set the port to listen for Socket.io connections
  const PORT = 5001; // Default to port 4000 if not provided
  server.listen(PORT, () => {
    console.log(`Socket.io server running on port ${PORT}`);
  });
};

module.exports = { configureSocketIO };
