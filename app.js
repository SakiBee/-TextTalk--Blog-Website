require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
require("./config/dbConnect");
const userRoutes = require("./routes/users/users");
const postRoutes = require("./routes/posts/posts");
const commentRoutes = require("./routes/comments/comments");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const Post = require("./models/posts/Post");
const { truncatePost } = require("./utils/helper");


//helper
app.locals.truncatePost = truncatePost;

//middlewares
//configure ejs
app.set("view engine", "ejs");

//server static files
app.use(express.static(__dirname + "/public"));

// pass incoming data
app.use(express.json()); 

//pass form data
app.use(express.urlencoded({extended: true})); 

//method override
app.use(methodOverride("_method"));
//session configuration
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24*60*60, //for 1 day
    }),
  })
);

//save the login user info into locals(every time this middleware will call first)
app.use((req, res, next) => {
  if(req.session.userAuth) {
    res.locals.userAuth = req.session.userAuth._id;
  } else {
    res.locals.userAuth = null;
  }
  next();
});


//render home page
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user");
    res.render("index", {posts, error: null});
  } catch (e) {
    res.render("index", {error: e.message});
  }
});


//user routes
app.use("/api/v1/users", userRoutes);

//Posts routes
app.use("/api/v1/posts", postRoutes);

//Comments
app.use("/api/v1/comments", commentRoutes);

//Error Handler Middleware
app.use(globalErrorHandler);

const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Server running on Port ${PORT}`));