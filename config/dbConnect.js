const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected Successfully...")
  } catch(e) {
    console.log("connection Failed", e.message);
  }
};

dbConnect();