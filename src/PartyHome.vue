<template>
  <div id="partyhome">
    <TheNavigation />
    <EventInformation />
  </div>
</template>

<script>
import TheNavigation from "@/components/TheNavigation.vue";
import EventInformation from "@/components/EventInformation";

export default {
  name: "PartyHome",
  components: {
    TheNavigation,
    EventInformation
  }
  // created: async function() {
  //   const rawData = await fetch(
  //     "https://feum-ticketing.dk/.netlify/functions/get-current-user-amount"
  //   );
  //   if (rawData.status !== 200) {
  //     this.$store.commit(
  //       "setError",
  //       "There has been an error, please try again later."
  //     );
  //     return;
  //   }
  //   const response = await rawData.json();
  //   this.$store.commit("setCurrentParticipantAmount", Number(response));

  //   if (!this.$store.getters.getTicketsLeft) {
  //     this.$store.commit(
  //       "setError",
  //       "The maximum attendance capacity has unfortunately been reached."
  //     );
  //     return;
  //   }
  // }
};
</script>

<style lang="scss"></style>
