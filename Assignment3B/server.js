require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔗 Connect MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/userDB';

mongoose.connect(MONGODB_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
});

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send('Server is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});