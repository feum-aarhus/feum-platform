<template>
  <div id="partyhome">
    <TheNavigation />
    <EventInformation />
  </div>
</template>

<script>
import TheNavigation from "@/components/TheNavigation.vue";
import EventInformation from "@/components/EventInformation";

export default {
  name: "PartyHome",
  components: {
    TheNavigation,
    EventInformation
  }
};
</script>

<style lang="scss"></style>
