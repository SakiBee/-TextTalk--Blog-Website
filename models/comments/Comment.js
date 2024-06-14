const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, //reference
      required: true,
      ref: "User", //referencing the user model
    },
    message: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId, //reference
      required: true,
      ref: "Post", //referencing the user model
    },
  },
  {
    timestamps : true,
  }
);


//compile the schema to form a model
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;