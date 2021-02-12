<template>
  <Layout>
    <h1>Hello there!</h1>
  </Layout>
</template>

<script>
export default {
  name: "Payment",
  metaInfo: {
    title: "Payment status",
  },
  mounted: async function () {
    console.log(this.$route.query.payload);
  },
};
</script>

<style lang="scss" scoped></style>
