import { Schema, model } from "mongoose";

const CommentSchema = new Schema(
  {
    userReference: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    postReference: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    content: {
      type: String,
      trim: true,
      maxlength: 400,
    },
  },
  { timestamps: true }
);

export default model("Comment", CommentSchema);
