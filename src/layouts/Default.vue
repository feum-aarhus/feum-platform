<template>
  <div class="layout">
    <header class="header">
      <TheNavigation />
    </header>
    <slot />
  </div>
</template>

<script>
import TheNavigation from "@/components/TheNavigation.vue";

export default {
  name: "DefaultLayout",
  components: {
    TheNavigation,
  },
};
</script>
