require("dotenv").config();
const dbConnect = require("./db/dbConnect");
const models = require("./db/models");
const mongoose = require("mongoose");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: { Allow: "POST" },
    };
  }
  const databaseConnected = await dbConnect();
  if (!databaseConnected.error) {
    try {
      const data = JSON.parse(event.body);
      const participantVerification = await models.Participant.find({
        email: data.email,
      }).exec();
      mongoose.disconnect();
      if (participantVerification.length) {
        return {
          statusCode: 401,
          body: "This email is already registered.",
        };
      } else {
        return {
          statusCode: 200,
          body: JSON.stringify(data),
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify(error),
      };
    }
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify(databaseConnected.error),
    };
  }
};
