<template>
  <Layout>
    <div class="events__container">
      <div v-if="futureEvents && futureEvents.length">
        <h2>Future events</h2>
        <div class="events--future">
          <EventCard
            v-for="future in futureEvents"
            :key="future.node.title"
            :eventInfo="future.node"
            class="event__wrapper"
          />
        </div>
      </div>
      <div v-if="pastEvents && pastEvents.length">
        <h2>Past events</h2>
        <div class="events--past">
          <EventCard
            v-for="past in pastEvents"
            :key="past.node.title"
            :eventInfo="past.node"
            class="event__wrapper"
          />
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import EventCard from "@/components/EventCard.vue";

export default {
  name: "Events",
  metaInfo: {
    title: "Events",
  },
  components: {
    EventCard,
  },
  computed: {
    futureEvents() {
      return this.$page.events.edges.filter(
        (event) => new Date(event.node.start).getTime() > Date.now()
      );
    },
    pastEvents() {
      return this.$page.events.edges.filter(
        (event) => !this.futureEvents.includes(event)
      );
    },
  },
};
</script>

<page-query>
query events {
  events: allEvents {
    edges {
      node {
        id
        card_image
        title
        start
        end
        lineup {
          name
          country
          label
        }
      }
    }
  }
}
</page-query>

<style lang="scss">
.events__container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: stretch;
  margin-top: 32px;

  & > div:not(:first-child) {
    margin-top: $spacer;
  }

  h2 {
    text-align: center;
    margin-bottom: $spacer;
  }

  .event__wrapper:not(:last-child) {
    margin-bottom: 18px;
  }

  @include screen-is(md) {
    margin-top: $spacer * 2;

    .event__wrapper {
      flex: 0 1 calc(100% / 3 - 24px);
      max-width: 420px;
      margin-right: 24px;
      margin-bottom: 24px !important;

      &:nth-of-type(3n + 3) {
        margin-right: 0;

        @include screen-is(lg) {
          margin-right: 24px;
        }
      }
    }

    h2 {
      text-align: left;
      margin-bottom: 18px;
    }

    .events--future,
    .events--past {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
  }

  @include screen-is(lg) {
    .event__wrapper {
      flex: 0 1 25%;

      &:nth-of-type(4n + 4) {
        margin-right: 0;
      }
    }
  }
}
</style>
