import Vuex from "vuex";
import DefaultLayout from "@/layouts/Default.vue";
import "@/assets/reset.css";
import "@/assets/fonts.css";
import "@/assets/style.scss";

export default function (Vue, { appOptions }) {
  Vue.component("Layout", DefaultLayout);
  Vue.use(Vuex);

  appOptions.store = new Vuex.Store({
    state: {
      message: "",
      participantAmount: 0,
      loading: false,
      userName: null,
      userEmail: null,
      userPhone: null,
      isUserDataConfirmed: false,
      paymentId: null,
      userFlowSuccessful: false,
      eventCapacity: 0,
      confirmationEmailText: null,
    },
    mutations: {
      setMessageText(state, message) {
        state.message = message;
      },
      resetMessageText(state) {
        state.message = "";
      },
      setCurrentParticipantAmount(state, amount) {
        state.participantAmount = amount;
      },
      setLoading(state, setTo) {
        state.loading = setTo;
      },
      setUserData(state, userData) {
        state.userName = userData.userName;
        state.userEmail = userData.userEmail;
        state.userPhone = userData.userPhone;
      },
      setEventCapacity(state, eventCapacity) {
        state.eventCapacity = eventCapacity;
      },
      setConfirmationEmailText(state, emailText) {
        state.confirmationEmailText = emailText;
      },
      confirmUserData(state, setTo) {
        state.isUserDataConfirmed = setTo;
      },
      setPaymentId(state, newId) {
        state.paymentId = newId;
      },
      resetPaymentData(state) {
        state.userName =
          state.userEmail =
          state.userPhone =
          state.paymentId =
            null;
      },
      setFlowSuccess(state, didSucceed) {
        state.userFlowSuccessful = didSucceed;
      },
    },
    getters: {
      hasTicketsLeft(state) {
        return state.eventCapacity > state.participantAmount;
      },
      getTicketsLeft(state) {
        return state.eventCapacity - state.participantAmount;
      },
      getMessage(state) {
        return state.message;
      },
      isLoading(state) {
        return state.loading;
      },
      hasPersistedData(state) {
        return (
          !!state.userName &&
          !!state.userEmail &&
          !!state.userPhone &&
          state.isUserDataConfirmed
        );
      },
      hasInitializedPayment(state) {
        return !!state.paymentId;
      },
    },
    actions: {
      async checkParticipantAmount({ commit, dispatch }) {
        const rawData = await fetch(
          `${process.env.GRIDSOME_API_URL}.netlify/functions/get-current-user-amount`
        );
        if (rawData.status !== 200) {
          dispatch("displayMessage", {
            messageText:
              "There has been an error with our database, please try again later.",
            keepUpFor: 5000,
          });
          return;
        }
        const response = await rawData.json();
        commit("setCurrentParticipantAmount", Number(response));
      },
      async saveParticipant({ commit, state }, participantInfo) {
        const rawData = await fetch(
          `${process.env.GRIDSOME_API_URL}.netlify/functions/save-user-db`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: participantInfo.email,
              name: participantInfo.name,
              phone: participantInfo.phone,
            }),
          }
        );
        if (rawData.status !== 200) {
          return await rawData.text();
        }
        const userData = await rawData.json();

        const rawEmail = await fetch(
          `${process.env.GRIDSOME_API_URL}.netlify/functions/send-confirmation-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...userData,
              emailBody: state.confirmationEmailText,
            }),
          }
        );
        if (rawEmail.status === 200) {
          commit("setFlowSuccess", true);
        }
        return await rawEmail.text();
      },
      async createPayment({ commit }, paymentAmount) {
        const rawData = await fetch(
          `${process.env.GRIDSOME_API_URL}.netlify/functions/create-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentAmount,
            }),
          }
        );
        if (rawData.status !== 200) {
          dispatch("displayMessage", {
            messageText:
              "There has been an error with the payment provider, please try again later.",
            keepUpFor: 5000,
          });
          return;
        }
        const response = await rawData.json();
        commit("setPaymentId", response.clientSecret);
      },
      async checkForDuplicateParticipant(context, userEmail) {
        const rawData = await fetch(
          `${process.env.GRIDSOME_API_URL}.netlify/functions/validate-signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userEmail,
            }),
          }
        );
        if (rawData.status !== 200) {
          throw await rawData.text();
        }
      },
      async verifyTicket(context, ticketId) {
        const rawVerification = await fetch(
          `${process.env.GRIDSOME_API_URL}.netlify/functions/verify-ticket`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ticketId,
            }),
          }
        );
        if (rawVerification.status !== 200) {
          throw await rawVerification.text();
        }
      },
      displayMessage({ commit }, { messageText, keepUpFor }) {
        commit("setMessageText", messageText);
        commit("setLoading", false);
        if (!keepUpFor) return;
        setTimeout(() => commit("resetMessageText"), keepUpFor);
      },
      persistUserData({ commit }, userData) {
        commit("setUserData", userData);
        commit("confirmUserData", true);
      },
    },
  });
}
