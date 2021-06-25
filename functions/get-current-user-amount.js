const dbConnect = require("./db/dbConnect");
const models = require("./db/models");
const mongoose = require("mongoose");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: { Allow: "GET" },
    };
  }
  const databaseConnected = await dbConnect();
  if (!databaseConnected.error) {
    const results = await models.Participant.find({});
    mongoose.disconnect();
    return {
      statusCode: 200,
      body: JSON.stringify(results.length),
    };
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify(databaseConnected.error),
    };
  }
};
