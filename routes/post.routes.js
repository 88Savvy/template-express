import express from "express";
import PostModel from "../model/post.model.js";
import UserModel from "../model/user.model.js";
import CommentModel from "../model/comment.model.js";
import isAuth from "../middlewares/isAuth.js";

const postRouter = express.Router();

// Create a new post
postRouter.post("/create", isAuth, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const author = req.auth._id; // Get the author's ID from the authenticated user

    const post = await PostModel.create({
      title,
      content,
      category,
      author,
    });

    await UserModel.findByIdAndUpdate(author, { $push: { posts: post._id } });

    return res.status(201).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

// Get all posts
postRouter.get("/all", isAuth, async (req, res) => {
  try {
    const posts = await PostModel.find().populate({
      path: "author",
      select: "username", // Include only the username field
    });

    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


// Get a specific post by ID
postRouter.get("/:postId", isAuth, async (req, res) => {
  try {
    const postId = req.params.postId;
    
    const post = await PostModel.findById(postId).populate({
      path: "author",
      select: "username", // Include only the username field
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.views += 1;
    await post.save();
    
    return res.status(200).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a post by ID
postRouter.put("/edit/:postId", isAuth, async (req, res) => {
  try {
    const postId = req.params.postId;
    const updatedData = req.body;

    // Update the post in the database
    const updatedPost = await PostModel.findByIdAndUpdate(postId, updatedData, {
      new: true, // Return the updated post document
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

// Delete a post by ID
postRouter.delete("/delete/:postId", isAuth, async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post by ID
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete all comments associated with the post
    await CommentModel.deleteMany({ post: postId });

    // Delete the post from the database
    const deletedPost = await PostModel.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update the user's profile to remove the deleted post
    await UserModel.findByIdAndUpdate(post.author, {
      $pull: { posts: postId },
    });

    return res
      .status(200)
      .json({ message: "Post and associated comments deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

export default postRouter;
