document.addEventListener("DOMContentLoaded", () => {
  (async function getParticipantAmount() {
    const rawData = await fetch("https://feum-days.netlify.app/.netlify/functions/get-current-user-amount");
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
  const submitButton = document.querySelector(".form_submit");
  const submitMessage = document.querySelector(".event_submit-message");
  const messageText = document.querySelector(".event_submit-message-text");
  submitButton.addEventListener("click", () => {
    submitButton.classList.add("event_submit-message-hidden");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    submitMessage.classList.remove("event_submit-message-hidden");
    submitMessage.classList.add("event_submit-message-displaying");
  });

  // submitting the info upon clicking the submit button
  document.querySelector("#submit_button").addEventListener("click", () => saveParticipant());

  async function sendConfirmationEmail() {
    const contactName = document.querySelector("#form_name").value;
    const contactEmail = document.querySelector("#form_email").value;
    const phoneNumber = document.querySelector("#form_phone-number").value;

    const rawData = await fetch("https://feum-days.netlify.app/.netlify/functions/send-confirmation-email", {
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
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    messageText.innerText = await rawData.text();
  }

  //To save what is in the form into the database, and to create a participant.
  async function saveParticipant() {
    const contactName = document.querySelector("#form_name").value;
    const contactEmail = document.querySelector("#form_email").value;
    const phoneNumber = document.querySelector("#form_phone-number").value;

    const rawData = await fetch("https://feum-days.netlify.app/.netlify/functions/save-user-db", {
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
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    if (rawData.status !== 200) {
      submitMessage.classList.remove("event_submit-message-hidden");
      messageText.innerText = await rawData.text();
      return;
    }
    const response = await rawData.json();
    if (response && respose.email) {
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