require('dotenv').config(); // Load env vars first

const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ DB Connection Error:", err));

// Routes
const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

const shoppingListRoutes = require('./routes/shoppingList');
app.use('/api/lists', shoppingListRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('🎉 Server is live!');
});

// Real-time setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  }
});

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('join_list', (listId) => {
    socket.join(listId);
    console.log(`📦 Socket ${socket.id} joined room ${listId}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket ${socket.id} disconnected`);
  });
});

// Make io globally available
global.io = io;

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
