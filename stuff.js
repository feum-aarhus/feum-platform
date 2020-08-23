const processHeader = document.querySelector(".event_process-header");
const steps = document.querySelector(".event_the-steps");
processHeader.addEventListener("click", () => {
  steps.classList.remove("event_process-hidden");
  steps.classList.add("event_process-displaying");
});