require("dotenv").config();
const { MAILGUN_API_KEY, MAILGUN_DOMAIN, FROM_EMAIL_ADDRESS } = process.env;
const mailgun = require("mailgun-js")({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN,
  host: "api.eu.mailgun.net"
});

exports.handler = async event => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: { Allow: "POST" }
    };
  }

  const data = JSON.parse(event.body);
  if (!data.participantId || !data.contactEmail || !data.contactName) {
    return {
      statusCode: 422,
      body: "Incomplete data provided for the email to be submitted."
    };
  }

  const mailgunData = {
    from: FROM_EMAIL_ADDRESS,
    to: data.contactEmail,
    cc: FROM_EMAIL_ADDRESS,
    subject: "FEUM Days Confirmation Email",
    html: `
<!DOCTYPE html>
<html lang="en" style="margin: 0 25%;">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet"> 
</head>
<body style="font-family: 'Source Code Pro', monospace;">
<div>
    <h1 style="font-size: 1.25rem;">Hey you! Thank you again for joining us :)</h1>
    <p>Please, in order to reserve your e-ticket, <b>transfer 100kr.</b> to FEUM using MobilePay. <b>FEUM’s MobilePay number: 29750</b></p>
    <b>You can use the MobilePay button below.</b>
    <p>You will receive your e-ticket <b>within 24 hours</b>. If not, you are welcome to email us with the following subject ‘[CS] E-ticket not received’ followed by your full name and phone number.<p>
    <b>Yours Truly, FEUM!</b>
    <p>(The location will be announced 24 hours before the event by email.)</p>
    <a style="text-align: center;" href="https://mobilepay.dk/erhverv/betalingslink/betalingslink-svar?phone=29750&amount=100">
      <img style="width: 150px;" src="https://developer.mobilepay.dk/sites/developer.mobilepay.dk/files/siteImages/large1x.png" alt="MobilePay logo" />
    </a>
</div>  
</body>
</html> 
`
  };

  return mailgun
    .messages()
    .send(mailgunData)
    .then(() => ({
      statusCode: 200,
      body:
        "Thank you for taking part in our next adventure. Together, again, let’s draw the first path of a unique and never-ending journey."
    }))
    .catch(error => ({
      statusCode: 422,
      body: JSON.stringify(error)
    }));
};
