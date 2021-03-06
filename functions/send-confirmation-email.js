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
            <h1 style="font-size: 1rem;">Hey you!</h1>
            <p>Thank you for purchasing a ticket to Feum Live that will take place on 24th of July. Use the attached QR code for entering the venue. <b>Please note that you shouldn’t scan the QR code yourself as scanning it will make it invalid.</b> It will be scanned at the entrance by the door person.</p>
            <p style="text-decoration: underline;">Timetable</p>
            <p>18:00 - Door opens</p>
            <p>18:00 - 19:00 Pan Bonka (DJ set)</p>
            <p>19:00 - 21:00 Rasmus Fisker</p>
            <p>21:15 - 22:45 Perko</p>
            <p>23:00 - 24:00 Schacke</p>
            <p>24:00 - 02:00 Det.Al (DJ set)</p>
            <p style="text-decoration: underline;">Refund policy</p>
            <p>If you need a refund, please contact us at <a href="mailto:hello@feum.net">hello@feum.net</a> with the subject “Refund”. It takes 5 to 10 days to get your money back. We can refund tickets up to 2 days prior to the event, so make sure you contact us before the 22nd of July.</p>
            <p>Lastly, it is required to have a corona pass and good vibes in order to enter the venue.</p>
            <p>See you soon!</p>
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
