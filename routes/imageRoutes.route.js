import express from "express";
import upload from "../middleware/uploadMiddleware.middleware.js";
import {
  uploadImage,
  getUserImages,
  deleteImage,
} from "../controllers/imageController.controller.js";
import authMiddleware from "../middleware/authMiddleware.middleware.js";

const router = express.Router();

// Route to upload image
router.post("/upload", authMiddleware, upload.single("image"), uploadImage);

// Route to fetch user-specific images
router.get("/my-images", authMiddleware, getUserImages);

// Route to delete image by public ID
router.delete("/delete/:publicId", authMiddleware, deleteImage);

export default router;
