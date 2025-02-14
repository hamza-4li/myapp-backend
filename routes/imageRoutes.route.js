import express from "express";
import upload from "../middleware/uploadMiddleware.middleware.js";
import {
  uploadImage,
  getUserImages,
} from "../controllers/imageController.controller.js";
import authMiddleware from "../middleware/authMiddleware.middleware.js";

const router = express.Router();

// Route to upload image
router.post("/upload", authMiddleware, upload.single("image"), uploadImage);

// Route to fetch user-specific images
router.get("/my-images", authMiddleware, getUserImages);

export default router;
