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
export default {
  name: "PartyHome",
  metaInfo: {
    title: "Home",
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
    min-height: calc(100vh - 36px - 60px - 42px);
  }
}
</style>
