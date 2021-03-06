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
      const isTicketValid = await models.Participant.findOneAndUpdate(
        { _id: data.ticketId, ticketScanned: false },
        { ticketScanned: true }
      );
      mongoose.disconnect();
      if (!isTicketValid) throw "This ticket is invalid.";
      else
        return {
          statusCode: 200,
          body: "This ticket is valid.",
        };
    } catch (error) {
      return {
        statusCode: 401,
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
