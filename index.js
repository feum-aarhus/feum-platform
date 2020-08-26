document.addEventListener("DOMContentLoaded", () => {
  (async function getParticipantAmount() {
    const rawData = await fetch("https://feum-ticketing.dk/.netlify/functions/get-current-user-amount");
    if (rawData.status !== 200) {
      document.querySelector(".event_home-form").innerHTML = "<h1>There has been an error, please try again later.</h1>"
      return;
    }
    const response = await rawData.json();
    if (Number(response) > 99) {
      document.querySelector(".event_home-form").innerHTML = "<h1>The maximum attendance capacity has unfortunately been reached.</h1>"
    }
    document.querySelector(".form_tickets-left").innerText = 100 - Number(response);
  })();

  // hiding the form and scrolling to the top once submit is pressed
  const submitMessage = document.querySelector(".event_submit-message");
  const messageText = document.querySelector(".event_submit-message-text");
  const submitButton = document.querySelector("#submit_button");

  // submitting the info upon clicking the submit button
  submitButton.addEventListener("click", () => saveParticipant());

  async function sendConfirmationEmail() {
    const contactName = document.querySelector("#form_name").value;
    const contactEmail = document.querySelector("#form_email").value;
    const phoneNumber = document.querySelector("#form_phone-number").value;

    const rawData = await fetch("https://feum-ticketing.dk/.netlify/functions/send-confirmation-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contactName,
        contactEmail,
        phoneNumber
      })
    });
    messageText.innerText = await rawData.text();

    submitButton.classList.add("form_submit-hidden");
    submitMessage.classList.add("event_submit-message-displaying");
  }

  //To save what is in the form into the database, and to create a participant.
  async function saveParticipant() {
    const contactName = document.querySelector("#form_name").value;
    const contactEmail = document.querySelector("#form_email").value;
    const phoneNumber = document.querySelector("#form_phone-number").value;

    const rawData = await fetch("https://feum-ticketing.dk/.netlify/functions/save-user-db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        participantId: 0,
        name: contactName,
        email: contactEmail,
        phone: phoneNumber
      })
    });
    if (rawData.status !== 200) {
      submitMessage.classList.add("event_submit-message-displaying");
      messageText.innerText = await rawData.text();
      return;
    }
    const response = await rawData.json();
    if (response && response.email) {
      sendConfirmationEmail();
    }
  }

  // showing the steps upon click
  const processHeader = document.querySelector(".event_process-header");
  const steps = document.querySelector(".event_the-steps");
  processHeader.addEventListener("click", () => {
    steps.classList.remove("event_process-hidden");
    steps.classList.add("event_process-displaying");
  });
});