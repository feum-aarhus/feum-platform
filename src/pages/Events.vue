<template>
  <Layout>
    <div class="event__container">
      <div v-if="futureEvents && futureEvents.length">
        <h3>Future events</h3>
        <EventCard
          v-for="future in futureEvents"
          :key="future.node.title"
          :eventInfo="future.node"
          class="event__card"
        />
      </div>
      <div v-if="pastEvents && pastEvents.length">
        <h3>Past events</h3>
        <EventCard
          v-for="past in pastEvents"
          :key="past.node.title"
          :eventInfo="past.node"
          class="event__card"
        />
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
        logo
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
.event__container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: stretch;
  margin-top: 32px;

  & > div:not(:first-child) {
    margin-top: $spacer;
  }

  h3 {
    text-align: center;
    margin-bottom: $spacer;
  }

  .event__card:not(:last-child) {
    margin-bottom: 18px;
  }
}
</style>
