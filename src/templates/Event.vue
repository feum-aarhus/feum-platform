<template>
  <Layout>
    <div class="event__static">
      <g-image class="event__logo" :src="$page.event.logo" alt="Event logo" />
      <div class="event__info">
        <h4 class="semi-bold">{{ $page.event.title }}</h4>
        <h5 class="semi-bold">Start</h5>
        <p>{{ $page.event.start }}</p>
        <h5 class="semi-bold">Location</h5>
        <p>{{ $page.event.address }}</p>
        <h5 class="semi-bold">Price</h5>
        <div class="event__sale">
          <p>{{ $page.event.price }}</p>
          <span class="sale__online" v-if="$page.event.presale_only"
            >(Online presale only)</span
          >
        </div>
        <h5 class="semi-bold">Event performed by</h5>
        <div class="event__lineup">
          <p v-for="artist in $page.event.lineup" :key="artist.name">
            {{ `${artist.name} (${artist.country}) (${artist.label})` }}
          </p>
        </div>
      </div>
      <ContentDropdown
        title="About the event"
        :content="$page.event.content"
        isFirst
      />
      <ContentDropdown
        title="Listen to the artists"
        content="...when this feature is developed"
      />
    </div>
    <div class="button event__purchase">Buy ticket</div>
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
    content
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
.event__static {
  margin-bottom: $spacer + 36px;

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
}

.event__purchase {
  position: fixed;
  bottom: $spacer;
  width: calc(100% - #{$spacer} * 2);
  height: 48px;
  justify-content: center;
  padding: 0;

  &::after {
    position: absolute;
    content: "";
    height: $spacer;
    width: 100%;
    background-color: $background;
    bottom: -$spacer;
  }
}
</style>
