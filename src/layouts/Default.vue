<template>
  <div class="layout">
    <header class="header">
      <TheNavigation />
    </header>
    <slot />
    <TheFooter />
  </div>
</template>

<script>
import TheNavigation from "@/components/TheNavigation.vue";
import TheFooter from "@/components/TheFooter.vue";
export default {
  name: "DefaultLayout",
  components: {
    TheNavigation,
    TheFooter,
  },
};
</script>
