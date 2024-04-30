// backend/utils/socketUtils.js
const socketIo = require('socket.io');

const configureSocketIO = (server, port) => {
  const io = socketIo(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle incoming messages
    socket.on('message', (message) => {
      // Broadcast the message to all connected clients
      io.emit('message', message);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // Set the port to listen for Socket.io connections
  const PORT = 5001; // Default to port 4000 if not provided
  server.listen(PORT, () => {
    console.log(`Socket.io server running on port ${PORT}`);
  });
};

module.exports = { configureSocketIO };
