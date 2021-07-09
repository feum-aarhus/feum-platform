require("dotenv").config();
const qrcode = require("qrcode");
const {
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  FROM_EMAIL_ADDRESS,
  GRIDSOME_API_URL,
} = process.env;
const mailgun = require("mailgun-js")({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN,
  host: "api.eu.mailgun.net",
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
    const attachment = new mailgun.Attachment({
      data: Buffer.from(imageUrl.split(",")[1], "base64"),
      filename: "ticket_" + data.participantId,
      contentType: "image/png",
    });
    const mailgunData = {
      from: FROM_EMAIL_ADDRESS,
      to: data.email,
      cc: FROM_EMAIL_ADDRESS,
      subject: "FEUM Event Confirmation Email",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body style="font-family: 'Source Code Pro', monospace;">
        <div>
            <h1 style="font-size: 1.25rem;">Hey you! Thank you again for joining us :)</h1>
            <p>Your ticket number is <b>${data.participantId}</b></p>
            <p>Attached to this email is your ticket. <b>Do not scan the QR code yourself, as that would mark the ticket as used, and it therefore won't work at the event!</b></p>
            <p style="font-weight: bold;">Yours Truly, FEUM!</p>
        </div>  
        </body>
        </html> 
      `,
      attachment,
    };

    return mailgun
      .messages()
      .send(mailgunData)
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
