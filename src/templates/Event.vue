<template>
  <Layout>
    <g-image class="event__logo" :src="$page.event.logo" alt="Event logo" />
    <div class="event__info">
      <h4 class="bold">{{ $page.event.title }}</h4>
      <h5 class="bold">Start</h5>
      <p>{{ $page.event.start }}</p>
      <h5 class="bold">Location</h5>
      <p>{{ $page.event.address }}</p>
      <h5 class="bold">Price</h5>
      <div class="event__sale">
        <p>{{ $page.event.price }}</p>
        <span class="sale__online" v-if="$page.event.presale_only"
          >(Online presale only)</span
        >
      </div>
      <h5 class="bold">Event performed by</h5>
      <div class="event__lineup">
        <p v-for="artist in $page.event.lineup" :key="artist.name">
          {{ `${artist.name} (${artist.country}) (${artist.label})` }}
        </p>
      </div>
    </div>
    <ContentDropdown
      title="Hi!"
      content="This is an amazing text I send through"
    />
  </Layout>
</template>

<page-query>
query ($id: ID!) {
  event: events(id: $id) {
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
</page-query>

<script>
import ContentDropdown from "@/components/ContentDropdown.vue";

export default {
  name: "Event",
  metaInfo() {
    return {
      title: this.$page.event.title,
    };
  },
  components: {
    ContentDropdown,
  },
};
</script>

<style lang="scss" scoped>
.event__logo {
  max-width: 100%;
  object-fit: contain;
  margin-top: $spacer;
  margin-bottom: $spacer * 2;
}

.event__info {
  margin-bottom: $spacer;

  h4,
  p:not(:last-child) {
    margin-bottom: 8px;
  }

  .event__sale {
    display: flex;

    .sale__online {
      margin-left: 4px;
    }
  }
}
</style>
