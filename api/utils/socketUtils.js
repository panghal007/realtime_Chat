// Import the socket.io library
const socketIo = require('socket.io');

// Define a function to configure Socket.IO
const configureSocketIO = (server, port) => {
  // Initialize a new Socket.IO instance with CORS enabled for all origins
  const io = socketIo(server, {
    cors: {
      origin: '*',
    },
  });

  // Create a Map to store the relationship between user IDs and their socket IDs
  let userSocketMap = new Map();

  // Listen for a new connection
  io.on('connection', (socket) => {
    // When a user connects, store their user ID and socket ID in the Map
    socket.on('userConnected', (userId) => {
      userSocketMap.set(userId, socket.id);
    });
  
    // When a message is received, send it to the intended recipient if they're connected
    socket.on('message', (messageData) => {
      const recipientSocketId = userSocketMap.get(messageData.recipient);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('message', messageData);
      }
    });
  
    // When a user disconnects, remove their user ID and socket ID from the Map
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
  const PORT = 5001; 
  server.listen(PORT, () => {
    console.log(`Socket.io server running on port ${PORT}`);
  });
};

module.exports = { configureSocketIO };
