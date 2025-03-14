import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlenght: 2,
      maxlength: 30,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/, // match = regex
    },

    profilePicture: {
      type: String,
      default: "https://cdn.wallpapersafari.com/92/63/wUq2AY.jpg",
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    followedCategories: [
      {
        type: String,
        enum: [
          "Culture",
          "Politics",
          "Technology",
          "Business",
          "Finance",
          "Food & Drink",
          "Sports",
          "Faith & Spirituality",
          "News",
          "Music",
          "Comics",
          "International",
          "Arts",
          "Climate & Environment",
          "Science",
          "Health & Wellness",
          "Literature",
          "Fiction",
          "Parenting",
          "Design",
          "Travel",
          "Education",
          "Philosophy",
          "History",
          "Humor",
          "Fashion & Beauty",
        ],
      },
    ],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    passwordHash: { type: String, required: true },
  },

  { timestamps: true }
);

export default model("User", userSchema);
