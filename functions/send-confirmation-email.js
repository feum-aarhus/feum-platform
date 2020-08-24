require('dotenv').config();
const { MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_URL, FROM_EMAIL_ADDRESS, CONTACT_TO_EMAIL_ADDRESS } = process.env;
const mailgun = require('mailgun-js')({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN, url: MAILGUN_URL });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed', headers: { 'Allow': 'POST' } }
  }

  const data = JSON.parse(event.body);
  if (!data.contactName || !data.contactEmail || !data.phoneNumber) {
    return { statusCode: 422, body: "Name, email, and phone number are required." }
  }

  const mailgunData = {
    from: FROM_EMAIL_ADDRESS,
    to: data.contactEmail,
    cc: CONTACT_TO_EMAIL_ADDRESS,
    subject: "Ce pula mea HTML",
    html:
`
<div style="display: flex; flex-flow: column nowrap; align-items: center; justify-content: center;">
    <h1 style="font-size: 3rem;">This is the header</h1>
    <img style="width: 100px; height: 200px;" src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Florin_Salam.png" alt="Image of Florin Salam" />
    <a style="font-weight: bold;" href="https://mobilepay.dk">Link to MobilePay</a>
</div>
      
`
  }

  return mailgun.messages().send(mailgunData).then(() => ({
    statusCode: 200,
    body: "Thank you for signing up, you will soon receive a confirmation email with futher instructions."
  })).catch(error => ({
    statusCode: 422,
    body: JSON.stringify({error})
  }));
}
