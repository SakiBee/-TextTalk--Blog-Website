const User = require("../../models/users/User");
const bcrypt = require("bcryptjs");
const appError = require("../../utils/appError");
const session = require("express-session");


//user register
const registerCtrl = async (req, res, next) => {
  const {fullname, email, password} = req.body;
  //if any fields is empty
  if(!fullname || !email || !password) {
    return res.render("users/register", {
      error:"All fields are required",
    });
  }
  try {
    //1. check if the user exist by email
    const userFound = await User.findOne({email});
    //2. if exist then throw an error
    if(userFound) {
      return res.render("users/register", {
        error:"User already exist",
      });
    }
    //else create user
    //3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    //register user
    const user = await User.create({fullname, email, password: hashedPass});
    //redirect
    res.redirect("/api/v1/users/profile-page");
  } catch(e) {
    return res.render("users/register", {
      error:e.message
    });
  }
};

//user login
const loginCtrl = async (req, res, next) => {
  const {email, password} = req.body;
  if(!email || !password) {
    return res.render("users/login", {
      error:"All fields are required",
    });
  }
  try {
    //1. check if the email is exist
    const userFound = await User.findOne({email});
    if(!userFound) {
      return res.render("users/login", {
        error:"Invalid login credentials",
      });
    }
    //varify password
    const isValidPass = await bcrypt.compare(password, userFound.password);
    if(!isValidPass) {
      return res.render("users/login", {
        error:"Invalid login credentials",
      });
    }
    //save the user info
    req.session.userAuth = userFound;

    //redirect
    res.redirect("/api/v1/users/profile-page");
  } catch(e) {
    return res.render("users/login", {
      error:e.message
    });
  }
};

//profile
const profileCtrl = async (req, res, next) => {
  try {
    //get the login user
    const userID = req.session.userAuth._id;
    // Find the user
    const user = await User.findById(userID).populate("posts").populate("comment"); // populate is for actual post to dispaly

    res.render("users/profile", {user, error: null}); 
  } catch (e) {
    return res.render("users/profile", {
      error: e.message
    });
  }
};

//user details
const userDetailsCtrl = async (req, res, next) => {
  try {
    //find the user
    const userId = req.session.userAuth._id;
    const user = await User.findById(userId);

    res.render("users/updateUser", {user, error: null });
  } catch(e) {
    return res.render("users/updateUser", {
      error: e.message,
      user: null,
    });
  }
}

//user update
const updateUserCtrl = async (req, res, next) => {
  const {fullname, email} = req.body;
  const userId = req.session.userAuth._id;
  try {
    if(!email || !fullname) {
      return res.render("users/updateUser", {
        error:"All field are required",
        user: { fullname, email }
      });
    }
    //check if the email is taken
    const takenEmail = await User.findOne({email});
    
    if(takenEmail && takenEmail._id.toString() !== userId.toString()) {
      return res.render("users/updateUser", {
        error:"Email is taken",
        user: { fullname, email }
      });
    }
    //update the user
    await User.findByIdAndUpdate(userId, {
        fullname, email
      }, { new: true}
    );
    //redirect
    res.redirect("/api/v1/users/profile-page");

  } catch(e) {
    return res.render("users/updateUser", {
      error:e.message,
      user: { fullname, email }
    });
  }
};

//uploadProfilePhoto
const uploadProfileCtrl = async (req, res, next) => {
  try {
    if(!req.file) {
      return res.render("users/uploadProfilePhoto", {
        error:"Please provide image",
      });
    }
    //1. find the user to be updated
    const userId = req.session.userAuth._id;
    const userFound = await User.findById(userId);
    //2. check if user is found
    if(!userFound) {
      return res.render("users/uploadProfilePhoto", {
        error:"User not found",
      });
    }
    //3. now update profile photo
    await User.findByIdAndUpdate(userId, {
      profileImage: req.file.path,
    }, {new: true});
    
    //redirect
    res.redirect("/api/v1/users/profile-page");
  } catch(e) {
    return res.render("users/uploadProfilePhoto", {
      error:e.message,
    });
  }
};

//upload cover Photo
const uploadCoverPhotoCtrl = async (req, res, next) => {
  try {
    if(!req.file) {
      return res.render("users/uploadCoverPhoto", {
        error:"Please provide image",
      });
    }
    //1. find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    //2. check if user is found
    if(!userFound) {
      return res.render("users/uploadCoverPhoto", {
        error:"User not found",
      });
    }
    //3. now update cover photo
    await User.findByIdAndUpdate(userId, {
      coverImage: req.file.path,
    }, {new: true});

     //redirect
     res.redirect("/api/v1/users/profile-page");
  } catch(e) {
    return res.render("users/uploadCoverPhoto", {
      error:e.message,
    });
  }
};

//update password
const updatePasswordCtrl = async (req, res, next) => {
  const {password} = req.body;
  try {
    //check if the use is updating the password
    if(password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);
      //update user
      await User.findByIdAndUpdate(req.session.userAuth._id, 
        { password : hashedPass, }, 
        { new: true, }
      );
      //redirect
    res.redirect("/api/v1/users/profile-page");
    }    
  } catch(e) {
    return res.render("users/updatePass", {
      error:e.message
    });
  }
};

//logout
const logoutCtrl = async (req, res, next) => {
  //destroy the session
  req.session.destroy((e) => {
    if(e) return next(e);
    res.redirect("/api/v1/users/login");
  });
};

const userInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("posts");
    res.render("users/userDetails", {
      user,
      error: null
    });
  } catch (e) {
    return res.render("users/userDetails", {
      error: e.message,
    });
  }
};



module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfileCtrl,
  uploadCoverPhotoCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
  userInfo,
};