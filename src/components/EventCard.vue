<template>
  <g-link :to="`/event/${eventInfo.id}`">
    <figure class="event__card">
      <g-image
        class="event__logo"
        :src="eventInfo.card_image"
        alt="Event logo small"
      />
      <div class="event__info">
        <p class="dimmed">{{ eventInfo.start }}</p>
        <h4 class="event__title">{{ eventInfo.title }}</h4>
      </div>
    </figure>
  </g-link>
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
  height: 100%;

  .event__logo {
    max-width: 100%;
    height: 180px;
    object-fit: cover;
  }
  .event__info {
    padding: 10px;

    p {
      margin-bottom: 4px;
    }
  }

  @include screen-is(md) {
    .event__logo {
      height: 220px;
    }
    .event__info {
      padding: 16px;

      p {
        margin-bottom: 8px;
      }
      .event__title {
        text-transform: uppercase;
      }
    }
  }
}
</style>
