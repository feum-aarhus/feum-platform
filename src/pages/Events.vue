<template>
  <Layout>
    <div class="event__container">
      <figure
        class="event__card"
        v-for="event in $page.events.edges"
        :key="event.node.title"
      >
        <div class="event__timeframe">
          <h3>
            {{
              new Date(event.node.start).getTime() > Date.now()
                ? "Future event"
                : "Past event"
            }}
          </h3>
        </div>
        <g-image
          class="event__logo"
          :src="event.node.logo"
          alt="Event poster"
        />
        <h2 class="underline">{{ event.node.title }}</h2>
        <p>
          <span v-for="artist in event.node.lineup" :key="artist.name">{{
            `${artist.name}(${artist.country}) [${artist.label}] `
          }}</span>
        </p>
      </figure>
    </div>
  </Layout>
</template>

<script>
export default {
  name: "Events",
  metaInfo: {
    title: "Events",
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
  flex-flow: row wrap;
  justify-content: flex-start;

  .event__card {
    display: flex;
    flex-flow: column nowrap;
    border: 2px solid $content;
    margin: 4rem;

    & > * {
      padding: 1rem;
    }

    .event__timeframe {
      border-bottom: 2px solid $content;
    }
    .event__logo {
      max-width: 100%;
      height: 500px;
      border-bottom: 2px solid $content;
      object-fit: contain;
    }
  }
}
</style>
