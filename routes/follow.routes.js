// followRoutes.js
import express from "express";
import UserModel from "../model/user.model.js";
import isAuth from "../middlewares/isAuth.js";

const followRouter = express.Router();

// Follow a user by ID
followRouter.post("/follow/:userId", isAuth, async (req, res) => {
  try {
    const userIdToFollow = req.params.userId;
    const loggedInUserId = req.auth._id;

    // Check if the logged-in user is already following the target user
    const loggedInUser = await UserModel.findById(loggedInUserId);

    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (loggedInUser.following.includes(userIdToFollow)) {
      return res.status(400).json({ message: "User is already followed" });
    }

    // Add the target user's ID to the "following" array
    loggedInUser.following.push(userIdToFollow);

    // Save the user object to update the "following" array
    await loggedInUser.save();

    return res.status(200).json({ message: "User followed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

// Unfollow a user by ID
followRouter.post("/unfollow/:userId", isAuth, async (req, res) => {
  try {
    const userIdToUnfollow = req.params.userId;
    const loggedInUserId = req.auth._id;

    // Check if the logged-in user is following the target user
    const loggedInUser = await UserModel.findById(loggedInUserId);

    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!loggedInUser.following.includes(userIdToUnfollow)) {
      return res.status(400).json({ message: "User is not followed" });
    }

    // Remove the target user's ID from the "following" array
    loggedInUser.following = loggedInUser.following.filter(
      (id) => id !== userIdToUnfollow
    );

    // Save the user object to update the "following" array
    await loggedInUser.save();

    return res.status(200).json({ message: "User unfollowed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

export default followRouter;
