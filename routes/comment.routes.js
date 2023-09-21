import express from "express";
import CommentModel from "../model/comment.model.js";
import PostModel from "../model/post.model.js";
import isAuth from "../middlewares/isAuth.js";

const commentRouter = express.Router();

commentRouter.post("/create", isAuth, async (req, res) => {
  try {
    // Get the logged-in user's ID from req.auth
    const userId = req.auth._id;

    // Get the postId and commentText from the request body
    const { postReference, content } = req.body;

    // Create a new comment
    const comment = await CommentModel.create({
      userReference: userId, // Use the provided userReference ID
      postReference, // Use the provided postReference ID
      content,
    });

    // Update the post to include the new comment
    await PostModel.findByIdAndUpdate(postReference, {
      $push: { comments: comment._id },
    });

    return res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

// Get all comments for a specific post with userReference populated
commentRouter.get("/post/comments-thread/:postId", isAuth, async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find all comments associated with the specified post
    const comments = await CommentModel.find({
      postReference: postId,
    }).populate("userReference");

    return res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

// Get a specific comment by ID
commentRouter.get("/post-comment/:commentId", async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json(comment);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

// Update a comment by ID
commentRouter.put("/edit/:commentId", isAuth, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;

    // Update the comment in the database
    const updatedComment = await CommentModel.findByIdAndUpdate(
      commentId,
      { content },
      { new: true } // Return the updated comment document
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json(updatedComment);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

// Delete a comment by ID
commentRouter.delete("/delete/:commentId", isAuth, async (req, res) => {
  try {
    const commentId = req.params.commentId;

    // Delete the comment from the database
    const deletedComment = await CommentModel.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

export default commentRouter;
