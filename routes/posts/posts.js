const express = require("express");
const postRoutes = express.Router();
const multer = require("multer");
const storage = require("../../config/cloudinary");
const {createPostsCtrl, fetchPostsCtrl, fetchPostCtrl, deletePostCtrl, updatePostCtrl} = require("../../controllers/posts/posts");
const protected = require("../../middlewares/protected");
const Post = require("../../models/posts/Post");

//instance of multer
const upload = multer({storage});


postRoutes.get("/get-post-form", (req, res) => {
  res.render("posts/addPost", {error: null});
});

postRoutes.get("/get-update-form/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render("posts/updatePost", {post, error: null});
  } catch (e) {
    res.render("posts/updatePost", {
      post: null, 
      error: e.message
    });
  }
});


//POST/api/v1/posts
postRoutes.post("/", protected, upload.single("postPhoto"), createPostsCtrl);

//GET/api/v1/posts
postRoutes.get("/", fetchPostsCtrl);

//GET/api/v1/posts/:id
postRoutes.get("/:id", fetchPostCtrl);

//DELETE/api/v1/posts/:id
postRoutes.delete("/:id", protected, deletePostCtrl);

//PUT/api/v1/posts/:id
postRoutes.put("/:id", protected, upload.single("postPhoto"), updatePostCtrl);


module.exports = postRoutes;