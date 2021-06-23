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
    return {
      error: null,
    };
  } catch (error) {
    return {
      error,
    };
  }
};
