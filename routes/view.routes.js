import express from "express";
import PostModel from "../model/post.model.js";

const viewsRouter = express.Router();

// Increment views for a specific post
viewsRouter.put("/increment-views/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post by ID
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Increment the "views" field by 1
    post.views += 1;

    // Save the updated post in the database
    await post.save();

    return res
      .status(200)
      .json({ message: "Post views incremented successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

export default viewsRouter;
