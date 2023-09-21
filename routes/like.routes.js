import express from "express";
import PostModel from "../model/post.model.js"; // Import your Post model
import isAuth from "../middlewares/isAuth.js"; // Import your authentication middleware if needed

const likeRouter = express.Router();

// Handle liking a post
likeRouter.post("/like/:postId", isAuth, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.auth.userId; // Assuming you have a user ID in req.auth

    // Check if the user has already liked the post
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: "You have already liked this post" });
    }

    // Add the user's ID to the post's likes array
    post.likes.push(userId);
    await post.save();

    return res.status(200).json({ message: "Post liked successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

// Handle unliking a post
likeRouter.post("/unlike/:postId", isAuth, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.auth.userId; 

    // Check if the user has already liked the post
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.likes.includes(userId)) {
      return res.status(400).json({ message: "You have not liked this post" });
    }

    // Remove the user's ID from the post's likes array
    post.likes = post.likes.filter((likeUserId) => likeUserId.toString() !== userId);
    await post.save();

    return res.status(200).json({ message: "Post unliked successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

export default likeRouter;
