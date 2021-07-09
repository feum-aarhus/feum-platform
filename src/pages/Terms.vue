<template>
  <Layout>
    <div class="terms__container" v-html="$static.theTerms.body"></div>
  </Layout>
</template>

<static-query>
query {
  theTerms: pages(id: "7f9cf3d076639f80af622e7a137b5a2a") {
    body
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
.terms__container > * {
  margin-bottom: 16px;
}
</style>
