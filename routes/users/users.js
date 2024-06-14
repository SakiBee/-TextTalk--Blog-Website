const express = require("express");
const userRoutes = express.Router();
const multer = require("multer");
const storage = require("../../config/cloudinary");
const {registerCtrl, loginCtrl, userDetailsCtrl, profileCtrl, uploadProfileCtrl, uploadCoverPhotoCtrl, updatePasswordCtrl, updateUserCtrl, logoutCtrl, userInfo} = require("../../controllers/users/users");
const protected = require("../../middlewares/protected");


//instance of multer
const upload = multer({storage});


//Rendering forms
//------------------------------------------------------
//Registration form
userRoutes.get("/register", (req, res) => {
  res.render("users/register", {
    error: "",
  });
});

//Login form
userRoutes.get("/login", (req, res) => {
  res.render("users/login", {
    error: "",
  });
});

//Profile page
userRoutes.get("/profile-page");
// userRoutes.get("/profile-page", (req, res) => {
//   res.render("users/profile", { user });
// });

//Upload profile photo
userRoutes.get("/profile-photo-upload", (req, res) => {
  res.render("users/uploadProfilePhoto", { error: null });
});


//Upload cover photo
userRoutes.get("/cover-photo-upload", (req, res) => {
  res.render("users/uploadCoverPhoto", { error: null });
});

//Update User password
userRoutes.get("/update-password", (req, res) => {
  res.render("users/updatePass", { error: null });
});


userRoutes.get("/user-info", (req, res) => {
  res.render("users/userDetails");
})

//--------------------------------------------------------
//POST/api/v1/users/Register
userRoutes.post("/register", registerCtrl);

//POST/api/v1/users/login
userRoutes.post("/login", loginCtrl);

//GET/api/v1/users/profile-page
userRoutes.get("/profile-page", protected, profileCtrl);

//PUT/api/v1/users/profile-photo-upload
userRoutes.put("/profile-photo-upload/", protected, upload.single("profile"), uploadProfileCtrl);

//PUT/api/v1/users/cover-photo-upload/
userRoutes.put("/cover-photo-upload/", protected, upload.single("cover"), uploadCoverPhotoCtrl);

//PUT/api/v1/users/update-password/:id
userRoutes.put("/update-password/", updatePasswordCtrl);

//PUT/api/v1/users/update
userRoutes.put("/update", updateUserCtrl);

//GET/api/v1/users/logout
userRoutes.get("/logout", logoutCtrl);

//GET/api/v1/users/:id
userRoutes.get("/:id", userDetailsCtrl);

//GET/api/v1/users/user-info
userRoutes.get("/user-info", userInfo);



//----------------------------------------------------

module.exports = userRoutes;