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
        <transition name="swap" mode="out-in" @after-enter="handleFormShift">
          <div
            key="button"
            v-if="!formActive"
            class="button event__purchase"
            @click="toggleForm"
          >
            Buy ticket
          </div>
          <div key="form" class="event__form" v-else>
            <div class="form__close" @click="toggleForm"></div>
            <h2>Summary</h2>
            <p>Your order: 1 ticket to {{ $page.event.title }}</p>
            <p>Total amount: {{ $page.event.price }} Kr.</p>
            <div v-if="hasPersistedData" class="form__user">
              <h4 class="semi-bold">Your information:</h4>
              <p>{{ this.$store.state.userName }}</p>
              <p>{{ this.$store.state.userEmail }}</p>
              <p>{{ this.$store.state.userPhone }}</p>
            </div>
            <hr />
            <TheTicketForm
              :eventPrice="$page.event.price"
              ref="theTicketForm"
            />
          </div>
        </transition>
      </div>
    </div>
    <div class="event__gallery">
      <h2>Memories</h2>
      <div class="gallery__container">
        <g-image
          v-for="photo in $page.event.photos_list"
          v-bind:key="photo.event_photo"
          class="gallery__photo"
          :src="photo.event_photo"
          alt="Event Gallery Photo"
        />
      </div>
      <h2>Load More</h2>
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
    };
  },
  computed: {
    ...mapGetters(["hasPersistedData"]),
    isFutureEvent() {
      return new Date(this.$page.event.start).getTime() > Date.now();
    },
  },
  methods: {
    toggleForm() {
      this.formActive = !this.formActive;
    },
    handleFormShift() {
      if (this.formActive) {
        this.$nextTick(() => {
          this.$refs.theTicketForm.$el.scrollIntoView({ behavior: "smooth" });
        });
      }
    },
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
    display: flex;
    flex-flow: column nowrap;

    h2 {
      margin-bottom: 12px;
    }

    hr {
      height: 1px;
      width: 100%;
      background-color: $grey-light;
      margin-top: 0;
      margin-bottom: $spacer;
    }

    .form__close {
      width: 20px;
      height: 20px;
      text-align: center;
      align-self: flex-end;
      cursor: pointer;
      padding: 8px;
      background-color: $heading;

      &::before,
      &::after {
        position: absolute;
        content: "";
        height: 20px;
        width: 1px;
        background-color: $background;
      }
      &::before {
        transform: rotate(45deg);
      }
      &::after {
        transform: rotate(-45deg);
      }
    }

    .form__user {
      margin-top: 12px;
    }
  }
}

//Gallery
.event__gallery {
  text-align: center;

  .gallery__container {
    margin: $spacer 0px;
    display: flex;
    flex-flow: column;

    @include screen-is(md) {
      display: flex;
      flex-flow: row wrap;
    }

    .gallery__photo:nth-child(1n + 2) {
      margin-top: 16px;
    }

    @include screen-is(md) {
      .gallery__photo:nth-child(1n + 1) {
        margin-top: 0px;
        margin-right: 24px;
        margin-bottom: 24px;
      }

      .gallery__photo:last-child {
        margin-right: 0px;
      }

      .gallery__photo {
        max-width: 100%;
        height: 300px;
        object-fit: cover;
      }
    }
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
