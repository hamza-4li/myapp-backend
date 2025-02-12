import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.config.js';
import cors from 'cors';
import authRoutes from './routes/authRoutes.route.js'

// Initialize environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json()); // Parse JSON bodies

app.use('/api/auth', authRoutes); // API routes
app.get('/', (req, res) => {
    res.send('API is running...')
}); // Test Route

// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
