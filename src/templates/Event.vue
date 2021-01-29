<template>
  <Layout>
    <div class="event__container">
      <div class="event__static">
        <g-image class="event__logo" :src="$page.event.logo" alt="Event logo" />
        <div class="event__info">
          <h4 class="semi-bold">Start</h4>
          <p>{{ $page.event.start }}</p>
          <h4 class="semi-bold">Location</h4>
          <p>{{ $page.event.address }}</p>
          <h4 class="semi-bold">Price</h4>
          <div class="event__sale">
            <p>{{ $page.event.price }}</p>
            <span class="sale__online" v-if="$page.event.presale_only"
              >(Online presale only)</span
            >
          </div>
          <h4 class="semi-bold">Event performed by</h4>
          <div class="event__lineup">
            <p v-for="artist in $page.event.lineup" :key="artist.name">
              {{ `${artist.name} (${artist.country}) (${artist.label})` }}
            </p>
          </div>
        </div>
        <ContentDropdown
          title="About the event"
          :content="$page.event.content"
          hideBorderOnClose
        />
        <ContentDropdown
          title="Listen to the artists"
          content="...when this feature is developed"
        />
      </div>
      <div class="button event__purchase">Buy ticket</div>
    </div>
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
$buttonHeight: $spacer * 2;
$contentWidth: 685px;

.event__container {
  max-width: $contentWidth;
  margin: 0 auto;

  .semi-bold {
    font-size: 12px;
    line-height: 17px;
  }

  .event__static {
    margin-bottom: $spacer * 2 + $buttonHeight;

    .event__logo {
      max-width: 100%;
      object-fit: contain;
      margin-bottom: 12px;
    }

    .event__info {
      margin-bottom: $spacer;

      p:not(:last-child) {
        margin-bottom: 18px;
      }

      .event__sale {
        display: flex;

        .sale__online {
          margin-left: 4px;
        }
      }
    }

    @include screen-is(md) {
      .event__logo {
        margin-bottom: $spacer * 2;
      }

      .event__info {
        margin-bottom: $spacer * 2;

        p:not(:last-child) {
          margin-bottom: 26px;
        }
      }
    }
  }

  .event__purchase {
    position: fixed;
    bottom: $spacer;
    width: 100%;
    left: 0;
    height: $buttonHeight;
    justify-content: center;
    padding: 0;
    max-width: $contentWidth;
    cursor: pointer;

    &::after {
      position: absolute;
      content: "";
      height: $spacer;
      width: 100%;
      background-color: $background;
      bottom: -$spacer;
    }

    @media (min-width: $contentWidth + 32px) {
      left: unset;
    }

    @include screen-is(md) {
      bottom: $spacer * 2;

      &::after {
        height: $spacer * 2;
        bottom: -$spacer * 2;
      }
    }
  }
}
</style>
