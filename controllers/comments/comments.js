const User = require("../../models/users/User");
const Post = require("../../models/posts/Post");
const Comment = require("../../models/comments/Comment");
const appError = require("../../utils/appError");


//create Comments
const createCommentsCtrl = async (req, res, next) => {
  const {message} = req.body;
  try {
    //check if the field is empty
    if(!message) {
      return next(appError("The field is required"));
    }
    //find the post
    const post = await Post.findById(req.params.id);
    //find the user first
    const user = await User.findById(req.session.userAuth._id);

    //create comment
    const comment = await Comment.create({
      user: user._id,
      message,
      post: post._id
    });

    //push the comment into the user's comments array
    user.comment.push(comment._id);
    post.comment.push(comment._id);

    // resave the user and post as they have a new post
    await user.save({validateBeforeSave: false});
    await post.save({validateBeforeSave: false});

    res.redirect(`/api/v1/posts/${post._id}`);
  } catch(e) {
    return next(appError(e.message));
  }
};

//fetch single comment
const fetchCommentCtrl = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    res.render("comments/updateComment", {
      comment, error: ""
    });
  } catch(e) {
    res.render("comments/updateComment", {
      comment: null, error: e.message
    });
  }
};

//delete comment
const deleteCommentCtrl = async (req, res, next) => {
  //console.log(req.query); //it comes from method override in postDetails
  try {
    //find the comment to be deleted
    const comment = await Comment.findById(req.params.id);
    //check if the comment is belongs to the sessioned user
    if(comment.user.toString() !== req.session.userAuth._id.toString()) {
      return next(appError("You are not allowed to delete this comment", 403));
    }
    //delete the comment
    await Comment.findByIdAndDelete(req.params.id);
    res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch(e) {
    return next(appError(e.message));
  }
};

//update comment
const updateCommentCtrl = async (req, res, next) => {
  const {message} = req.body;
  try {
    //find the comment to be updated
    const comment = await Comment.findById(req.params.id);
    if(!comment) {
      return next(appError("Comment not found"));
    }
    //check if the comment is belongs to the sessioned user
    if(comment.user.toString() !== req.session.userAuth._id.toString()) {
      return next(appError("You are not allowed to update this comment", 403));
    }
    //update 
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, {
      message,
    }, {
      new: true,
    });

    res.redirect(`/api/v1/posts/${comment.post}`);
  } catch(e) {
    return next(appError(e.message));
  }
};


module.exports = {
  createCommentsCtrl,
  fetchCommentCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
};