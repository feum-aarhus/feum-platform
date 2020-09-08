// document.addEventListener("DOMContentLoaded", () => {
//   // show the corresponding message once submit is pressed

//   // save what is in the form into the database, and create a participant

//   async function sendConfirmationEmail(participantInfo) {
//     const rawData = await fetch(
//       "https://feum-ticketing.dk/.netlify/functions/send-confirmation-email",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           participantId: participantInfo.participantId,
//           contactEmail: participantInfo.email,
//           contactName: participantInfo.name
//         })
//       }
//     );
//     showMessage(await rawData.text());
//     submitButton.classList.remove("form_submit-hidden");
//     loaderSubmitting.classList.remove("shown");

//     const rawUserAmount = await fetch(
//       "https://feum-ticketing.dk/.netlify/functions/get-current-user-amount"
//     );

//     if (rawUserAmount.status !== 200) {
//       return;
//     }
//     const newUserAmount = await rawUserAmount.json();
//     document.querySelector(".form_tickets-left").innerText =
//       100 - Number(newUserAmount);
//   }
// });
