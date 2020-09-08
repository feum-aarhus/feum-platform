import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    errorMessage: "",
    participantAmount: 0,
    loading: false
  },
  mutations: {
    setError(state, message) {
      state.errorMessage = message;
    },
    resetError(state) {
      state.errorMessage = "";
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
    getErrorMessage(state) {
      return state.errorMessage;
    },
    isLoading(state) {
      return state.loading;
    }
  }
});
