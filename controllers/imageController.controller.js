import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js"; // Ensure cloudinary instance is imported

// Upload Image Controller
export const uploadImage = async (req, res) => {
  try {
    const userId = req.user.id; // Get logged-in user's ID
    const file = req.file; // Get the uploaded file

    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Upload the image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: "user-uploads",
    });

    const imageUrl = uploadResult.secure_url; // URL returned by Cloudinary
    const publicId = uploadResult.public_id; // Cloudinary's public ID

    // Update user record with new image
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { images: { url: imageUrl, public_id: publicId } } },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Image uploaded successfully!", imageUrl, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Image upload failed!", error });
  }
};

// Get User-Specific Images Controller
export const getUserImages = async (req, res) => {
  try {
    const userId = req.user.id; // Get logged-in user's ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ images: user.images });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch images!", error });
  }
};

// Delete Image Controller
export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params; // Corrected to publicId
    const userId = req.user.id; // Get logged-in user's ID

    console.log(
      `Attempting to delete image with publicId: ${publicId} for user: ${userId}`
    );

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Find the image in user's images by public_id
    const imageIndex = user.images.findIndex(
      (image) => image.public_id === publicId
    );
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found!" });
    }

    console.log(`Deleting image from Cloudinary with public_id: ${publicId}`);

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Remove image from the user's images array
    user.images.splice(imageIndex, 1);
    await user.save();

    console.log("Image deleted successfully");
    res.status(200).json({ message: "Image deleted successfully!" });
  } catch (error) {
    console.error("Error during image deletion:", error);
    res.status(500).json({ message: "Failed to delete image!", error });
  }
};
