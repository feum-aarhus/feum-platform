require("dotenv").config();
const { MAILGUN_API_KEY, MAILGUN_DOMAIN, FROM_EMAIL_ADDRESS } = process.env;
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

  const mailgunData = {
    from: FROM_EMAIL_ADDRESS,
    to: data.email,
    cc: FROM_EMAIL_ADDRESS,
    subject: "FEUM event Confirmation Email",
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
    <p>You will receive your e-ticket <b>within 24 hours</b>. If not, please email us with the following subject ‘[CS] E-ticket not received’ followed by your full name and phone number.</p>
    <p style="font-weight: bold;">Yours Truly, FEUM!</p>
</div>  
</body>
</html> 
`,
  };

  return mailgun
    .messages()
    .send(mailgunData)
    .then(() => ({
      statusCode: 200,
      body: "Thank you for taking part in our next adventure. Together, again, let’s draw the first path of a unique and never-ending journey.",
    }))
    .catch((error) => ({
      statusCode: 422,
      body: "The payment succeeded, but something messed up with our emailing service, please contact FEUM with your credentials about receiving the ticket.",
    }));
};
