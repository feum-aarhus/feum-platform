require("dotenv").config();
const { Client, CheckoutAPI } = require("@adyen/api-library");
const client = new Client({
  apiKey: [process.env.ADYEN_API_KEY],
  environment: "TEST",
});
const checkout = new CheckoutAPI(client);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: { Allow: "POST" },
    };
  }
  try {
    const response = await checkout.paymentMethods({
      channel: "Web",
      merchantAccount: process.env.ADYEN_MERCHANT_NAME,
      countryCode: "DK",
    });
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify(error.message),
    };
  }
};
