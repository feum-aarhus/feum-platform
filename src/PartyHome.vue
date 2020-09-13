<template>
  <div id="partyhome">
    <TheNavigation />
    <MiniGame />
    <EventInformation />
  </div>
</template>

<script>
import TheNavigation from "@/components/TheNavigation.vue";
import MiniGame from "@/components/MiniGame.vue";
import EventInformation from "@/components/EventInformation";

export default {
  name: "PartyHome",
  components: {
    TheNavigation,
    MiniGame,
    EventInformation
  },
  created: async function() {
    this.$store.commit("setLoading", true);
    await this.$store.dispatch("checkParticipantAmount");
    this.$store.commit("setLoading", false);
  }
};
</script>

<style lang="scss">
body {
  margin: 1rem !important;
  background-color: $background;

  @include screen-is(lg) {
    width: 50%;
    margin: 0rem auto !important;
  }
}
</style>
