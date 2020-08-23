document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#submit_button").addEventListener("click", () => submitForm());

  async function submitForm() {
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
    if (rawData.status === 424) {
      console.log(await rawData.text());
      return;
    }
    const response = await rawData.json();
    console.log(response);
  }

  const processHeader = document.querySelector(".event_process-header");
  const steps = document.querySelector(".event_the-steps");
  processHeader.addEventListener("click", () => {
    steps.classList.remove("event_process-hidden");
    steps.classList.add("event_process-displaying");
  });
});