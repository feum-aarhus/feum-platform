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
            <p>{{ $page.event.price + " Kr." }}</p>
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
      <div v-if="isFutureEvent">
        <transition name="swap" mode="out-in">
          <div
            key="button"
            v-if="!formActive"
            class="button event__purchase"
            @click="toggleForm"
          >
            Buy ticket
          </div>
          <div key="form" class="event__form" v-else>
            <div class="form__wrapper">
              <div class="form__close" @click="toggleForm"></div>
              <div class="form__summary">
                <h2>Your order</h2>
                <p>1 ticket to {{ $page.event.title }}</p>
                <p>{{ $page.event.price }} Kr.</p>
              </div>
              <hr />
              <div v-if="hasPersistedData" class="form__user">
                <h2>Your information</h2>
                <p>{{ this.$store.state.userName }}</p>
                <p>{{ this.$store.state.userEmail }}</p>
                <p>{{ this.$store.state.userPhone }}</p>
              </div>
              <TheTicketForm
                :eventPrice="$page.event.price"
                ref="theTicketForm"
              />
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="event__gallery" v-if="!isFutureEvent && !!imageLoop.length">
      <h2>Memories</h2>
      <div class="gallery__container">
        <g-image
          v-for="photo in imageLoop"
          v-bind:key="photo.event_photo"
          class="gallery__photo"
          :src="photo.event_photo"
          alt="Event Gallery Photo"
        />
      </div>
      <div
        class="gallery__more"
        v-if="showAmount < this.$page.event.photos_list.length"
        @click="showMoreImages"
      >
        <h2>Load More</h2>
      </div>
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
    photos_list {
      event_photo
    }
  }
}
</page-query>

<script>
import ContentDropdown from "@/components/ContentDropdown.vue";
import TheTicketForm from "@/components/TheTicketForm.vue";
import { mapGetters } from "vuex";

export default {
  name: "Event",
  metaInfo() {
    return {
      title: this.$page.event.title,
    };
  },
  components: {
    ContentDropdown,
    TheTicketForm,
  },
  data: function () {
    return {
      formActive: false,
      showAmount: 4,
    };
  },
  computed: {
    ...mapGetters(["hasPersistedData"]),
    isFutureEvent() {
      return new Date(this.$page.event.start).getTime() > Date.now();
    },
    imageLoop() {
      return this.$page.event.photos_list.slice(0, this.showAmount);
    },
  },
  methods: {
    toggleForm() {
      this.formActive = !this.formActive;
    },
    showMoreImages() {
      this.showAmount = this.showAmount + 4;
    },
  },
};
</script>

<style lang="scss" scoped>
.event__container {
  max-width: $contentWidth;
  margin: 0 auto;

  .semi-bold {
    font-size: 12px;
    line-height: 17px;
    text-transform: uppercase;
  }

  // Static event info
  .event__static {
    margin-bottom: $spacer * 2;
    margin-top: 44px;

    .event__logo {
      max-width: 100%;
      object-fit: contain;
      margin-bottom: 72px;
    }

    .event__info {
      margin-bottom: $spacer;

      p:not(:last-child) {
        margin-bottom: 18px;
      }

      p:last-child {
        margin-bottom: $spacer * 2;
      }

      .event__sale {
        display: flex;

        .sale__online {
          margin-left: 4px;
        }
      }
    }

    @include screen-is(md) {
      margin-top: $spacer * 2;

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

  // Ticket form
  .event__purchase {
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    height: $buttonHeight;
    justify-content: center;
    padding: 0;
    max-width: $contentWidth;
    cursor: pointer;

    @media (min-width: $contentWidth + 32px) {
      left: unset;
    }
  }
  .event__form {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background-color: $background;

    @include screen-is(md) {
      align-items: center;
    }

    .form__wrapper {
      display: flex;
      flex-flow: column nowrap;
      max-width: $contentWidth;
      border: 1px solid $heading;
      height: calc(100% - 2px);
      overflow-y: scroll;

      @include screen-is(md) {
        height: auto;
        overflow-y: hidden;
      }

      .form__summary {
        padding: 0 32px;

        h2 {
          margin-bottom: 12px;
        }

        p:last-child {
          margin-top: 6px;
        }
      }

      hr {
        height: 1px;
        width: calc(100% - 2px);
        background-color: $grey-light;
        margin-top: $spacer;
        margin-bottom: 0;
      }

      .form__close {
        width: 20px;
        height: 20px;
        text-align: center;
        align-self: flex-end;
        cursor: pointer;
        padding: 16px 16px 0 16px;
        flex-shrink: 0;

        &::before,
        &::after {
          position: absolute;
          content: "";
          height: 20px;
          width: 1px;
          background-color: $heading;
        }
        &::before {
          transform: rotate(45deg);
        }
        &::after {
          transform: rotate(-45deg);
        }
      }

      .form__user {
        margin: $spacer 0;
        padding: 0 32px;

        h2 {
          margin-bottom: 12px;
        }
      }
    }
  }
}

// Gallery
.event__gallery {
  text-align: center;

  .gallery__container {
    margin: 16px 0px;
    display: flex;
    flex-flow: column;

    .gallery__photo:not(:first-child) {
      margin-top: 16px;
    }

    @include screen-is(md) {
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;

      .gallery__photo {
        flex-grow: 1;
        height: 500px;
        object-fit: cover;
        margin: 12px;

        &:not(:first-child) {
          margin: 12px;
        }

        @include screen-is(xl) {
          max-width: calc(50% - 24px);
        }
      }
    }
  }

  .gallery__more {
    cursor: pointer;
  }
}

.swap-enter-active,
.swap-leave-active {
  transition: transform 0.2s;
}
.swap-enter,
.swap-leave-to {
  transform: translateY(100%);
}
</style>
