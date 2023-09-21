import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: [
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
    ], //
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // An array to store user IDs who liked the content
    views: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

export default model("Post", postSchema);
