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
    const { publicId } = req.params;
    const userId = req.user.id;

    console.log(`Received DELETE request for publicId: ${publicId}`);

    if (!publicId) {
      return res.status(400).json({ message: "Missing publicId in request." });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found.");
      return res.status(404).json({ message: "User not found!" });
    }

    const imageIndex = user.images.findIndex(
      (image) => image.public_id === publicId
    );
    if (imageIndex === -1) {
      console.log("Image not found in user records.");
      return res.status(404).json({ message: "Image not found!" });
    }

    console.log(`Deleting image from Cloudinary with public_id: ${publicId}`);

    await cloudinary.uploader.destroy(publicId);

    user.images.splice(imageIndex, 1);
    await user.save();

    console.log("Image deleted successfully");
    res.status(200).json({ message: "Image deleted successfully!" });
  } catch (error) {
    console.error("Error during image deletion:", error);
    res.status(500).json({ message: "Failed to delete image!", error });
  }
};
