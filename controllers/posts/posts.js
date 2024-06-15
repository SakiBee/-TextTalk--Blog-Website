const User = require("../../models/users/User");
const Post = require("../../models/posts/Post");
const appError = require("../../utils/appError");

//create posts
const createPostsCtrl = async (req, res, next) => {
  const {title, description, category, image, user} = req.body;
  try {
    //check if all the fields are filled
    if(!title || !description || !category || !req.file) {
      return res.render("posts/addPost", {
        error: "All field are required"
      });
    }
    //find the user first
    const userId = req.session.userAuth._id;
    const userFound = await User.findById(userId);
    // create the post
    const createdPost = await Post.create({
      title,
      description,
      category,
      image: req.file.path,
      user: userFound._id,
    });
    //push the post into the user's posts array
    userFound.posts.push(createdPost._id);

    // resave the user as it have a new post
    await userFound.save();
    
    //redirect
    res.redirect("/");
  } catch(e) {
    return res.render("posts/addPost", {
      error: e.message
    });
  }
};

//fetch Posts
const fetchPostsCtrl = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("comment").populate("user");
    res.json({
      status: "success",
      data: posts,
    })
  } catch(e) {
    next(appError(e.message));
  }
};

//single post details
const fetchPostCtrl = async (req, res, next) => {
  try {
    //get the id from params
    const id = req.params.id;
    const post = await Post.findById(id).populate({
      path: "comment",
      populate: {
        path: "user",
      }
    }).populate("user");

    res.render("posts/postDetails", {
      post, 
      error: null,
      userAuth: req.session.userAuth || null
    });
  } catch(e) {
    return res.render("posts/postDetails", {
      post: null,
      error: e.message
    });
  }
};

//delete post
const deletePostCtrl = async (req, res, next) => {
  try {
    //find the post to be deleted
    const post = await Post.findById(req.params.id);
    //check if the post is belongs to the sessioned user
    if(post.user.toString() !== req.session.userAuth._id.toString()) {
      return res.render("posts/postDetails", {
        error: "You are not allowed to delete this post",
        post: ""
      });
    }
    //delete the post
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch(e) {
    return res.render("posts/postDetails", {
      error: e.message,
      post: ""
    });
  }
};

//update posts
const updatePostCtrl = async (req, res, next) => {
  const {title, description, category, image} = req.body;
  try {
    //find the post to be updated
    const post = await Post.findById(req.params.id);
    //check if the post is belongs to the sessioned user
    if(post.user.toString() !== req.session.userAuth._id.toString()) {
      res.render("posts/updatePost", {
        post: null, 
        error: "You are not allowed to update this post"
      });
    }
    //update
    if(req.file) {
      const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
        title,
        description,
        category,
        image: req.file.path,
      }, {
        new: true,
      });
    } else {
      const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
        title,
        description,
        category,
      }, {
        new: true,
      });
    }    

    res.redirect("/api/v1/users/profile-page");
  } catch(e) {
    res.render("posts/updatePost", {
      post: null, 
      error: e.message
    });
  }
};


module.exports = {
  createPostsCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
};