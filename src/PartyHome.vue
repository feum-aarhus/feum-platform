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
  created: function() {
    this.$store.dispatch("checkParticipantAmount");
  }
};
</script>

<style lang="scss">
body {
  margin: 1rem !important;
  background-color: $background;

  @include screen-is(lg) {
    width: 30%;
    margin: 0rem auto !important;
  }
}
</style>
