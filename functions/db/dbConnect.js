const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async function dbConnect() {
  try {
    const url = process.env.CONNECTION_STRING;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("Successfully connected to the database");
    return true;
  } catch (error) {
    console.error("Database connection failed: ", error);
    return false;
  }
};
