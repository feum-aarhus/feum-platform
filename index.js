document.addEventListener("DOMContentLoaded", () => {
  // when the form is successfully displayed, this becomes a query selector
  let submitButton = null;
  const loaderSubmitting = document.querySelector(".loader_submitting");

  // immediately invoked expression to check how many people have signed up - display the form when <100
  (async function getParticipantAmount() {
    const rawData = await fetch("https://feum-ticketing.dk/.netlify/functions/get-current-user-amount");
    if (rawData.status !== 200) {
      document.querySelector(".event_home-form").innerHTML = "<b class='text_red'>There has been an error, please try again later.</b>";
      return;
    }
    const response = await rawData.json();
    if (Number(response) > 99) {
      document.querySelector(".event_home-form").innerHTML = "<b class='text_red'>The maximum attendance capacity has unfortunately been reached.</b>";
      return;
    }
    document.querySelector(".event_home-form").innerHTML = `
<h4>Order your ticket **</h4>
<div class="form_elements">
  <label for="form_name">Name<small> *</small></label>
  <input class="form_name" type="text" placeholder="Your full name" required id="form_name">
</div>
<div class="form_elements">
  <label for="form_email">E-mail<small> *</small></label>
  <input class="form_email" type="email" placeholder="Your e-mail" required id="form_email">
</div>
<div class="form_elements">
  <label for="form_phone-number">Phone Number<small> *</small></label>
  <input type="tel" placeholder="+45" required id="form_phone-number">
</div>
<div class="form_elements">
  <label for="form_payment-type">Payment<small> *</small></label>
  <div class="form_payment-type-container">
    <input class="form_payment-type" type="radio" value="MobilePay" required id="form_payment">
    <label for="form_payment-type">MobilePay</label>
  </div>
</div>
<small>* Required</small> 
<small class="black">** Tickets are not refundable. In case you resell the ticket to someone else, it is your responsibility to inform us by email (<a href="mailto:feumticketing@gmail.com">feumticketing@gmail.com</a>) the full name of the new owner followed by the ticket number.</small>
<input class="form_submit" type="submit" value="Order" id="submit_button">
`;
    document.querySelector(".form_tickets-left").innerText = 100 - Number(response);
    submitButton = document.querySelector("#submit_button");
    submitButton.addEventListener("click", () => saveParticipant());
  })();


  // show the corresponding message once submit is pressed
  function showMessage(message) {
    const submitMessage = document.querySelector(".event_submit-message");
    const messageText = document.querySelector(".event_submit-message-text");

    submitMessage.classList.add("event_submit-message-displaying");
    messageText.innerText = message;
  }

  // save what is in the form into the database, and create a participant
  async function saveParticipant() {
    document.querySelector(".event_submit-message").classList.remove("event_submit-message-displaying");

    const contactName = document.querySelector("#form_name").value;
    const contactEmail = document.querySelector("#form_email").value;
    const phoneNumber = document.querySelector("#form_phone-number").value;
    const payment = document.querySelector("#form_payment").checked;

    if (!payment || !contactName.trim() || !contactEmail.trim() || !contactEmail.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g) || !phoneNumber.trim() || !phoneNumber.match(/(\+45)?[0-9]{8}|(\+45 )?[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}/g)) {
      showMessage("Name, email, Danish phone number and payment method are required.");
      return;
    }

    submitButton.classList.add("form_submit-hidden");
    loaderSubmitting.classList.add("shown");

    const rawUserAmount = await fetch("https://feum-ticketing.dk/.netlify/functions/get-current-user-amount");

    if (rawUserAmount.status !== 200) {
      showMessage("There has been an error, please try again later.")
      return;
    }
    let newUserAmount = Number(await rawUserAmount.json());
    newUserAmount = newUserAmount + 1;

    const rawDatabaseResponse = await fetch("https://feum-ticketing.dk/.netlify/functions/save-user-db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        participantId: newUserAmount,
        name: contactName,
        email: contactEmail,
        phone: phoneNumber,
      })
    });
    if (rawDatabaseResponse.status !== 200) {
      showMessage(await rawDatabaseResponse.text());
      submitButton.classList.remove("form_submit-hidden");
      loaderSubmitting.classList.remove("shown");
      return;
    }
    const response = await rawDatabaseResponse.json();
    sendConfirmationEmail(response);
  }

  async function sendConfirmationEmail(participantInfo) {
    const rawData = await fetch("https://feum-ticketing.dk/.netlify/functions/send-confirmation-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        participantId: participantInfo.participantId,
        contactEmail: participantInfo.email,
        contactName: participantInfo.name
      })
    });
    showMessage(await rawData.text());
    submitButton.classList.remove("form_submit-hidden");
    loaderSubmitting.classList.remove("shown");

    const rawUserAmount = await fetch("https://feum-ticketing.dk/.netlify/functions/get-current-user-amount");

    if (rawUserAmount.status !== 200) {
      return;
    }
    const newUserAmount = await rawUserAmount.json();
    document.querySelector(".form_tickets-left").innerText = 100 - Number(newUserAmount);
  }
});