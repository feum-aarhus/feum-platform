require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: { Allow: "POST" },
    };
  }

  const data = JSON.parse(event.body);

  if (!data || !data.paymentAmount) {
    return {
      statusCode: 422,
      body: "Wrong request body format",
    };
  }
  const paymentIntent = await stripe.paymentIntents.create({
    amount: data.paymentAmount,
    currency: "dkk",
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      clientSecret: paymentIntent.client_secret,
    }),
  };
};
