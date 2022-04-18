require("dotenv").config();
const qrcode = require("qrcode");
const {
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  FROM_EMAIL_ADDRESS,
  GRIDSOME_API_URL,
} = process.env;
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: MAILGUN_API_KEY,
  url: "https://api.eu.mailgun.net",
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: { Allow: "POST" },
    };
  }
  const data = JSON.parse(event.body);
  try {
    const imageUrl = await qrcode.toDataURL(
      GRIDSOME_API_URL + "ticket/" + data._id,
      {
        width: 256,
        color: {
          dark: "#e1e1e1",
          light: "#111",
        },
      }
    );
    const messageData = {
      from: FROM_EMAIL_ADDRESS,
      to: [data.email],
      cc: FROM_EMAIL_ADDRESS,
      subject: "Feum ticket purchase confirmation",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body style="font-family: 'Source Code Pro', monospace;">
          ${
            data.emailBody ??
            "<p>Thank you for your purchase! Use the attached QR code for entering the venue. Please note that <b>you shouldn't scan the QR code yourself</b> as scanning it will make it invalid.</b> It will be scanned at the entrance by the door person.</p>"
          }
        </body>
        </html>
      `,
      attachment: {
        data: Buffer.from(imageUrl.split(",")[1], "base64"),
        filename: "ticket_" + data.participantId + ".png",
      },
    };

    return mg.messages
      .create(MAILGUN_DOMAIN, messageData)
      .then(() => ({
        statusCode: 200,
        body: "You will soon receive an email with a QR code that will serve as your ticket. If there are any problems in your purchasing process please contact us at hello@feum.net",
      }))
      .catch((error) => {
        throw "The payment succeeded, but something messed up with our emailing service, please contact us at hello@feum.net about receiving your ticket.";
      });
  } catch (error) {
    return {
      statusCode: 422,
      body: "The payment succeeded, but something messed up with our emailing service, please contact us at hello@feum.net about receiving your ticket.",
    };
  }
};
