// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http'); // Import http module

const { configureSocketIO } = require('./utils/socketUtils'); // Import socketUtils

const userRoutes = require('./routes/userRoutes');
const { MONGODB_URI } = require('./config');
// Load environment variables
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users',userRoutes);

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.io
configureSocketIO(server,5001);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
