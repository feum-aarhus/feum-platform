<template>
  <Layout>
    <div class="event__container" :class="{ 'event--future': isFutureEvent }">
      <div class="event__static">
        <g-image
          class="event__banner"
          :src="$static.futureEvent.banner"
          alt="Event banner"
        />
        <div class="event__info">
          <div class="info__point info__point--start">
            <h4 class="semi-bold">Date &amp; Time</h4>
            <p>{{ $static.futureEvent.start }}</p>
          </div>
          <div class="info__point info__point--price">
            <h4 class="semi-bold">Price</h4>
            <div class="event__sale">
              <p>{{ $static.futureEvent.price + " Kr." }}</p>
              <span class="sale__online" v-if="$static.futureEvent.presale_only"
                >(Online presale only)</span
              >
            </div>
          </div>
          <div class="info__point info__point--address">
            <h4 class="semi-bold">Location</h4>
            <p>{{ $static.futureEvent.address }}</p>
          </div>
          <div class="info__point info__point--artists">
            <h4 class="semi-bold">Event performed by</h4>
            <div class="event__lineup">
              <p
                v-for="artist in $static.futureEvent.lineup"
                :key="artist.name"
                class="lineup__artist"
              >
                {{
                  `${artist.name} (${artist.country}) (${
                    artist.label ? artist.label : "no label"
                  })`
                }}
                <g-link
                  v-if="artist.link"
                  :to="artist.link"
                  class="lineup__link"
                  >Listen to {{ artist.name }} here</g-link
                >
              </p>
            </div>
          </div>
        </div>
        <h4 class="semi-bold">About the event</h4>
        <div class="event__content" v-html="$static.futureEvent.content"></div>
        <!-- <ContentDropdown
          title="About the event"
          :content="$static.futureEvent.content"
          hideBorderOnClose
        /> -->
        <!-- <ContentDropdown
          title="Listen to the artists"
          content="...when this feature is developed"
        /> -->
      </div>
      <div v-if="isFutureEvent">
        <transition name="swap" mode="out-in">
          <div
            key="button"
            v-if="!formActive"
            class="event__purchase"
            @click="toggleForm"
          >
            <g-image
              v-if="isLoading"
              class="loader"
              src="~/assets/golden.svg"
              alt="Loading spinner"
            />
            <div
              v-else
              class="button full-height"
              :class="{ disabled: !hasTicketsLeft }"
            >
              {{
                this.hasTicketsLeft
                  ? "Buy ticket (" + this.getTicketsLeft + " left)"
                  : "Event sold out"
              }}
            </div>
          </div>
          <div key="form" class="event__form" v-else>
            <div class="form__wrapper">
              <div class="form__close" @click="toggleForm"></div>
              <div class="form__summary">
                <h2>Your order</h2>
                <p>1 ticket to {{ $static.futureEvent.title }}</p>
                <p>{{ $static.futureEvent.price }} Kr.</p>
              </div>
              <hr />
              <div v-if="hasPersistedData" class="form__user">
                <h2>Your information</h2>
                <p>{{ this.$store.state.userName }}</p>
                <p>{{ this.$store.state.userEmail }}</p>
                <p>{{ this.$store.state.userPhone }}</p>
              </div>
              <TheTicketForm
                :eventPrice="$static.futureEvent.price"
                ref="theTicketForm"
                @closeForm="formActive = false"
              />
            </div>
          </div>
        </transition>
      </div>
    </div>
    <!-- <ImageGallery
      :images="$static.futureEvent.photos_list"
      v-if="!isFutureEvent && !!$static.futureEvent.photos_list.length"
    /> -->
  </Layout>
</template>

<static-query>
query {
  futureEvent: events(id: "afaa0c54477560c43429f8c50f59cc38") {
    banner
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
      link
    }
    music
    content
  }
}
</static-query>

<script>
import ContentDropdown from "@/components/ContentDropdown.vue";
import TheTicketForm from "@/components/TheTicketForm.vue";
import ImageGallery from "@/components/ImageGallery.vue";
import { mapGetters } from "vuex";

export default {
  name: "Event",
  metaInfo() {
    return {
      title: this.$static.futureEvent.title,
    };
  },
  components: {
    ContentDropdown,
    TheTicketForm,
    ImageGallery,
  },
  data: function () {
    return {
      formActive: false,
    };
  },
  computed: {
    ...mapGetters([
      "hasPersistedData",
      "hasTicketsLeft",
      "isLoading",
      "getTicketsLeft",
    ]),
    isFutureEvent() {
      return new Date(this.$static.futureEvent.start).getTime() > Date.now();
    },
  },
  methods: {
    toggleForm() {
      if (this.hasTicketsLeft) this.formActive = !this.formActive;
      else this.formActive = false;
    },
  },
  mounted: async function () {
    this.$store.commit("setLoading", true);
    await this.$store.dispatch("checkParticipantAmount");
    this.$store.commit("setLoading", false);
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

    .event__banner {
      max-width: 100%;
      object-fit: contain;
      margin-bottom: 72px;
    }

    .event__info {
      margin-bottom: 18px;

      .info__point {
        p:not(.lineup__artist) {
          margin-bottom: 18px;
        }
        .event__sale {
          display: flex;

          .sale__online {
            margin-left: 4px;
          }
        }
        .event__lineup {
          .lineup__artist:not(:last-child) {
            margin-bottom: 12px;
          }

          .lineup__link {
            display: block;
          }
        }
      }
    }

    ::v-deep .event__content p:not(:last-child) {
      margin-bottom: 12px;
    }

    @include screen-is(md) {
      margin-top: $spacer * 2;

      .event__banner {
        margin-bottom: $spacer * 2;
      }
      .event__info {
        margin-bottom: 26px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 26px;

        .info__point {
          p:not(.lineup__artist) {
            margin-bottom: 0;
          }

          &--start,
          &--price,
          &--address {
            grid-column: 1/2;
          }

          &--artists {
            grid-column: 2/3;
            grid-row: 1/4;
          }
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

    @media (min-width: $contentWidth + 32px) {
      left: unset;
      position: static;
    }

    .disabled {
      cursor: default;
      color: grey;
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

.swap-enter-active,
.swap-leave-active {
  transition: transform 0.2s;
}
.swap-enter,
.swap-leave-to {
  transform: translateY(300%);
}

::v-deep .event--future ~ .footer {
  margin-bottom: 84px;

  @include screen-is(md) {
    margin-bottom: 42px;
  }
}
</style>
