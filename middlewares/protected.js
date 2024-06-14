const appError = require("../utils/appError");

const protected = (req, res, next) => {
  //check if a user is logged in
  if(req.session.userAuth) {
    next();
  } else {
    res.render("users/notAuthorize.ejs", {
      error: "Not Authorized, login again"
    })
  }
};

module.exports = protected;