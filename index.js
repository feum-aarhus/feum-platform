document.addEventListener("DOMContentLoaded", () => {
  (async function getParticipantAmount() {
    const rawData = await fetch("https://feum-days.netlify.app/.netlify/functions/get-current-user-amount");
    if (rawData.status === 200) {
      document.querySelector(".event_home-form").innerHTML = "<h1>There has been an error, please try again later.</h1>"
      return;
    }
    const response = await rawData.json();
    if (Number(response) > 99) {
      document.querySelector(".event_home-form").innerHTML = "<h1>The maximum attendance capacity has unfortunately been reached.</h1>"
    }
    document.querySelector(".form_tickets-left").innerText = 100 - Number(response);
  })();

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
    if (rawData.status !== 200) {
      console.log(await rawData.text());
      return;
    }
    const response = await rawData.json();
    console.log(response);
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
    if (rawData.status !== 200) {
      console.log(await rawData.text());
      return;
    }
    const response = await rawData.json();
    console.log(response);
    if (response && respose.email) {
      sendConfirmationEmail();
    }
  }

  const processHeader = document.querySelector(".event_process-header");
  const steps = document.querySelector(".event_the-steps");
  processHeader.addEventListener("click", () => {
    steps.classList.remove("event_process-hidden");
    steps.classList.add("event_process-displaying");
  });

  const submitButton = document.querySelector(".form_submit");
  const submitMessage = document.querySelector(".event_submit-message");
  const bottomPage = 0;
  submitButton.addEventListener("click", () => {
    submitButton.classList.add("event_submit-message-hidden");
    window.scrollTo({
      top: bottomPage,
      behavior: "smooth"
    })
    submitMessage.classList.remove("event_submit-message-hidden");
    submitMessage.classList.add("event_submit-message-displaying");
  });
});