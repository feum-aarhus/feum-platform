<template>
  <div>
    <div class="partyhome">
      <img src="../assets/logo-banner.png" alt="FEUM logo" />
      <h1>
        The site is being worked on, stay tuned for more exciting events in the
        near future!
      </h1>
    </div>
  </div>
</template>

<script>
// import TheNavigation from "@/components/TheNavigation.vue";
// import MiniGame from "@/components/MiniGame.vue";
// import EventInformation from "@/components/EventInformation";

export default {
  name: "PartyHome",
  metaInfo: {
    title: "Hello, world!",
  },
  // components: {
  //   TheNavigation,
  //   MiniGame,
  //   EventInformation,
  // },
  created: async function () {
    // this.$store.commit("setLoading", true);
    // await this.$store.dispatch("checkParticipantAmount");
    // this.$store.commit("setLoading", false);
  },
};
</script>

<page-query>

</page-query>

<style lang="scss">
body {
  margin: 1rem !important;
  background-color: $background;

  @include screen-is(lg) {
    width: 45%;
    margin: 0rem auto !important;
  }
}
.partyhome {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  height: 100vh;
  max-width: 500px;
  margin: 0 auto;

  * {
    padding: 2rem 0;
  }
}
</style>
