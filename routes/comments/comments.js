 const express = require("express");
const commentRoutes = express.Router();
const {fetchCommentCtrl, createCommentsCtrl, deleteCommentCtrl, updateCommentCtrl} = require("../../controllers/comments/comments");
const protected = require("../../middlewares/protected");

//POST/api/v1/comments/:id
commentRoutes.post("/:id", createCommentsCtrl);

//GET/api/v1/comments/:id
commentRoutes.get("/:id", fetchCommentCtrl);

//DELETE/api/v1/comments/:id
commentRoutes.delete("/:id", protected, deleteCommentCtrl);

//PUT/api/v1/comments/:id
commentRoutes.put("/:id", protected, updateCommentCtrl);


module.exports = commentRoutes;
