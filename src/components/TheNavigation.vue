<template>
  <section class="navigation">
    <!-- Here there will be the logo for example, and other 
    navigation stuff, potentally also skip game button -->
    <img class="event_logo" src="@/assets/feum-days-logo--new.png" alt="" />
  </section>
</template>

<script>
export default {
  name: "TheNavigation",
};
</script>

<style lang="scss" scoped>
.navigation {
  .event_logo {
    width: 100%;
    margin: 1.5rem auto;
    display: block;
  }
}
</style>
