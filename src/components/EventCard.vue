<template>
  <figure class="event__card">
    <g-image class="event__logo" :src="eventInfo.logo" alt="Event poster" />
    <div class="event__info">
      <p>{{ eventInfo.start }}</p>
      <h4>{{ eventInfo.title }}</h4>
    </div>
  </figure>
</template>

<script>
export default {
  name: "EventCard",
  props: {
    eventInfo: {
      required: true,
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
.event__card {
  display: flex;
  flex-flow: column nowrap;
  background-color: $grey;
  margin-top: 20px;

  .event__logo {
    max-width: 100%;
    height: 180px;
    object-fit: contain;
  }
  .event__info {
    padding: 10px;

    p {
      margin-bottom: 4px;
    }
  }
}
</style>
