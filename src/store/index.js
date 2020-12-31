import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    message: "",
    participantAmount: 0,
    loading: false
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
    }
  },
  getters: {
    getTicketsLeft(state) {
      return (
        Number(process.env.VUE_APP_EVENT_CAPACITY) - state.participantAmount
      );
    },
    getMessage(state) {
      return state.message;
    },
    isLoading(state) {
      return state.loading;
    }
  },
  actions: {
    async checkParticipantAmount({ commit, dispatch }) {
      const rawData = await fetch(
        "https://feum-ticketing.dk/.netlify/functions/get-current-user-amount"
      );
      if (rawData.status !== 200) {
        dispatch(
          "displayMessage",
          "There has been an error, please try again later."
        );
        return;
      }
      const response = await rawData.json();
      commit("setCurrentParticipantAmount", Number(response));
    },
    async sendConfirmationEmail({ dispatch }, participantInfo) {
      const rawData = await fetch(
        "https://feum-ticketing.dk/.netlify/functions/send-confirmation-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            participantId: participantInfo.participantId,
            contactEmail: participantInfo.email,
            contactName: participantInfo.name
          })
        }
      );
      await dispatch("checkParticipantAmount");
      dispatch("displayMessage", await rawData.text());
    },
    displayMessage({ commit }, messageText) {
      commit("setMessageText", messageText);
      commit("setLoading", false);

      setTimeout(() => commit("resetMessageText"), 5000);
    }
  }
});
