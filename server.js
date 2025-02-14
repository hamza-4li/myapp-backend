import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.route.js";
import imageRoutes from "./routes/imageRoutes.route.js";

// Initialize environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS,
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON bodies

app.use("/api/auth", authRoutes); // API routes
app.use("/api/images", imageRoutes); // Register image routes
app.get("/", (req, res) => {
  res.send("API is running...");
}); // Test Route

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
