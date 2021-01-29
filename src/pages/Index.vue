<template>
  <Layout>
    <div class="partyhome">
      <g-image
        class="home__image"
        src="~/assets/home.png"
        alt="FEUM logo, styled"
      />
    </div>
  </Layout>
</template>

<script>
// import TheNavigation from "@/components/TheNavigation.vue";
// import MiniGame from "@/components/MiniGame.vue";
// import EventInformation from "@/components/EventInformation";

export default {
  name: "PartyHome",
  metaInfo: {
    title: "Home",
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

<style lang="scss" scoped>
.partyhome {
  min-height: calc(100vh - #{$spacer} - 72px);
  display: flex;
  align-items: center;
  justify-content: center;

  .home__image {
    width: 100%;
    max-width: 724px;
  }

  @include screen-is(md) {
    min-height: calc(100vh - 38px * 3);
  }
}
</style>
