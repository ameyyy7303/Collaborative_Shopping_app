require('dotenv').config(); // Load env vars first

const express = require('express');
const mongoose = require('mongoose');
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

// Test route
app.get('/', (req, res) => {
  res.send('🎉 Server is live!');
});

// Routes (if you have any yet)
const userRoutes = require('./routes/user'); // if created
app.use('/api/users', userRoutes);

const shoppingListRoutes = require('./routes/shoppingList');
app.use('/api/lists', shoppingListRoutes);


app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
