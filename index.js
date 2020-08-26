document.addEventListener("DOMContentLoaded", () => {
  // when the form is successfully displayed, this becomes a query selector
  let submitButton = null;
  const loaderSubmitting = document.querySelector(".loader_submitting");

  // immediately invoked expression to check how many people have signed up - display the form when <100
  (async function getParticipantAmount() {
    const rawData = await fetch("https://feum-ticketing.dk/.netlify/functions/get-current-user-amount");
    if (rawData.status !== 200) {
      document.querySelector(".event_home-form").innerHTML = "<h2>There has been an error, please try again later.</h2>";
      return;
    }
    const response = await rawData.json();
    if (Number(response) > 99) {
      document.querySelector(".event_home-form").innerHTML = "<h2>The maximum attendance capacity has unfortunately been reached.</h2>";
      return;
    }
    document.querySelector(".event_home-form").innerHTML = `
<h4>Order your ticket **</h4>
<div class="form_tickets-left-container">
  <h2>Tickets left:</h2>
  <h2 class="form_tickets-left"></h2>
</div>
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
  <input type="tel" placeholder="+45" pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}" required id="form_phone-number">
</div>
<div class="form_elements">
  <label for="form_payment-type">Payment<small> *</small></label>
  <div class="form_payment-type-container">
    <input class="form_payment-type" type="radio" value="MobilePay" required>
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
    const contactName = document.querySelector("#form_name").value;
    const contactEmail = document.querySelector("#form_email").value;
    const phoneNumber = document.querySelector("#form_phone-number").value;

    if (!contactName.trim() || !contactEmail.trim() || !phoneNumber.trim()) {
      showMessage("Name, email, and phone number are required.");
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
        phone: phoneNumber
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
  }

  // showing the steps upon click
  const processHeader = document.querySelector(".event_process-header");
  const steps = document.querySelector(".event_the-steps");
  processHeader.addEventListener("click", () => {
    steps.classList.remove("event_process-hidden");
    steps.classList.add("event_process-displaying");
  });
});