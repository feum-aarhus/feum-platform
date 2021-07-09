<template>
  <Layout>
    <div class="terms__container" v-html="$static.theTerms.content"></div>
  </Layout>
</template>

<static-query>
query {
  theTerms: pages(id: "7f9cf3d076639f80af622e7a137b5a2a") {
    content
  }
}
</static-query>

<script>
export default {
  name: "Terms",
  metaInfo: {
    title: "Our Terms and Conditions",
  },
};
</script>

<style lang="scss" scoped>
::v-deep .terms__container {
  max-width: $contentWidth;
  margin: $spacer * 2 auto;

  & > * {
    margin-bottom: 16px;
  }
}
</style>
