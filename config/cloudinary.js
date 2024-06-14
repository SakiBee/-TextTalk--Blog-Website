require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");


//configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

//instance of cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,           //it includes the configuration
  allowedFormats: ['jpg', 'png', 'jpeg'],
  params: {
    folder: "blog-app-v1",    //the folder where the photos are saved
    tranformation: [{width: 500, height: 500, crop: "limit"}],
  },
});


module.exports = storage;  //this will be used as middleware where we need