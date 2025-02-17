import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js"; // Ensure cloudinary instance is imported

// Upload Image Controller
export const uploadImage = async (req, res) => {
  try {
    const userId = req.user.id; // Get logged-in user's ID
    const imageUrl = req.file.path; // Cloudinary URL

    // Update user record with new image
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { images: imageUrl } },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Image uploaded successfully!", imageUrl, user });
  } catch (error) {
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
    const { imageId } = req.params; // Get the imageId from URL parameters
    const userId = req.user.id; // Get the logged-in user's ID

    // Find user and check if image exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Find the image URL in user's images
    const imageIndex = user.images.findIndex(
      (image) => image.public_id === imageId
    );
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found!" });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(imageId); // 'public_id' from Cloudinary

    // Remove image from the user's images array
    user.images.splice(imageIndex, 1);
    await user.save();

    res.status(200).json({ message: "Image deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete image!", error });
  }
};
