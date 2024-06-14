const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    //we can add Role and Bio for user. we need to create input field for these
    role: {
      type: String,
      default: "Blogger"
    },
    bio: {
      type: String,
      default: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum adipisci eligendi nobis itaque ex? Veniam tempore itaque cumque fugiat iusto voluptatibus odit"
    },
    posts: [{
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Post"
    }],
    comment: [{
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Comment"
    }],
  },
  {
    timestamps : true,
  }
);


//compile the schema to form a model
const User = mongoose.model("User", userSchema);

module.exports = User;