import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../controllers/authController.controller.js";
import authMiddleware from "../middleware/authMiddleware.middleware.js";

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Route (example)
router.get("/profile", authMiddleware, getUserProfile);

// Route to send OTP
router.post("/forgot-password", forgotPassword);

// Route to verify OTP
router.post("/verify-otp", verifyOTP);

// Route to reset password
router.post("/reset-password", resetPassword);

export default router;
