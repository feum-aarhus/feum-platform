require("dotenv").config();
const { MAILGUN_API_KEY, MAILGUN_DOMAIN, FROM_EMAIL_ADDRESS } = process.env;
const mailgun = require("mailgun-js")({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN, host: "api.eu.mailgun.net" });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: "Method Not Allowed", headers: { "Allow": "POST" } }
  }

  const data = JSON.parse(event.body);
  if (!data.contactName || !data.contactEmail || !data.phoneNumber) {
    return { statusCode: 422, body: "Name, email, and phone number are required." }
  }

  const mailgunData = {
    from: FROM_EMAIL_ADDRESS,
    to: data.contactEmail,
    cc: FROM_EMAIL_ADDRESS,
    subject: "FEUM Days Confirmation Email",
    html:
`
<div style="display: flex; flex-flow: column nowrap; align-items: center; justify-content: center;">
    <h1 style="font-size: 3rem;">Hey there ${data.contactName}! Thank you again for joining us :)</h1>
    <p>Please, in order to reserve your e-ticket, transfer 100kr. to FEUM using MobilePay. FEUM’s MobilePay number: 29750 (you can use the button below)</p>
    <p>You will receive your e-ticket within 24 hours. If not, you are welcome to email us with the following subject ‘[CS] E-ticket not received’ followed by your full name and phone number.<p>
    <b>THANK YOU FOR YOUR SUPPORT!</b>
    <a style="width=169px; height=48px;" href="https://mobilepay.dk/erhverv/betalingslink/betalingslink-svar?phone=29750&amount=100&comment=Your guestlist name:">
      <img src="https://developer.mobilepay.dk/sites/developer.mobilepay.dk/files/siteImages/large1x.png" alt="MobilePay logo" />
    </a>
</div>
      
`
  }

  return mailgun.messages().send(mailgunData).then(() => ({
    statusCode: 200,
    body: "Thank you for signing up, you will soon receive a confirmation email with futher instructions."
  })).catch(error => ({
    statusCode: 422,
    body: JSON.stringify(error)
  }));
}
