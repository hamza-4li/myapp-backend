import User from "../models/user.model.js";

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
