import Vue from "vue";
import PartyHome from "./PartyHome.vue";
import store from "./store";
import "@/assets/reset.css";
import "@/assets/fonts.css";

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(PartyHome)
}).$mount("#app");
