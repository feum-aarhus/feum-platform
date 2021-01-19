<template>
  <Layout>
    <div class="event__container">
      <div class="events--future" v-if="futureEvents && futureEvents.length">
        <h3>Future events</h3>
        <EventCard
          v-for="future in futureEvents"
          :key="future.node.title"
          :eventInfo="future.node"
        />
      </div>
      <div class="events--past" v-if="pastEvents && pastEvents.length">
        <h3>Past events</h3>
        <EventCard
          v-for="past in pastEvents"
          :key="past.node.title"
          :eventInfo="past.node"
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
        address
        price
        presale_only
        lineup {
          name
          country
          label
        }
        music
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
  margin-top: $spacer;

  & > div:not(:first-child) {
    margin-top: 44px;
  }

  h3 {
    text-align: center;
  }
}
</style>
