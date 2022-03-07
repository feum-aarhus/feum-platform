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
        <div>
            <p>Hey you!</p>
            <p>Thank you for purchasing a ticket to <u><a href="https://feum.net/new-events/2022/3/18/-">Feum Phuture</a></u> that will take place on the <b><u>18th of March</u>.</b> Use the attached QR code for entering the venue. Please note that <b>you shouldn't scan the QR code yourself</b> as scanning it will make it invalid.</b> It will be scanned at the entrance by the door person.</p>
            <p>If you need a refund, please contact us at <u><a href="mailto:hello@feum.net">hello@feum.net</a></u>. It takes 5 to 10 days to get your money back.</p>
            <p style="font-weight: bold;"><u>House Rules Reminder</u>:</p>
            <p>To take part in our event you <b>must be above 21 years old.</b></p>
            <p style="font-weight: bold; margin-bottom: 0;">Harassment-free Environment</p>
            <p style="margin-top: 0;">All of you should feel <b>safe</b> and welcome, regardless of your gender, sexuality, ethnicity or ways of self-expression. We create the experience <b>together</b>, also by caring for each other. Our staff and security is ready to <b>help</b> you, if anything makes you feel uncomfortable.</p>
            <p style="font-weight: bold; margin-bottom: 0;">No Drugs Policy</p>
            <p style="margin-top: 0;">Save your drugs for later. FEUM promotes a <b>zero-tolerance</b> drug policy during the event.</p>
            <p style="font-weight: bold; margin-bottom: 0;">Please Smoke Outside</p>
            <p style="margin-top: 0;">Keep in mind non-smokers in the venue.</p>
            <p><b>Leave no trace</b> and respect the venue to make it smooth, Trash bins are located all around the dancefloor.</p>
            <p>We don’t encourage photos & filming on the dance floor! This way everybody can express themselves freely. <b>Enjoy the moment!</b></p>
            <p>See you on the dancefloor!</p>
            <p style="font-weight: bold;">Yours Truly, FEUM!</p>
        </div>
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
