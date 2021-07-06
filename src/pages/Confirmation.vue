<template>
  <Layout>
    <div class="outcome__container">
      <g-image
        class="outcome__icon"
        src="~/assets/tick.svg"
        alt="Success tick icon"
        v-if="$store.state.userSavedSuccessfully"
      />
      <g-image
        class="outcome__icon"
        src="~/assets/cross.svg"
        alt="Failure cross icon"
        v-else
      />
      <h2>
        {{
          this.$store.state.userSavedSuccessfully
            ? "Thank you!"
            : "Sorry about the inconvenience!"
        }}
      </h2>
      <div
        v-if="getMessage"
        class="form__message"
        :class="{
          'form__message--failure': !this.$store.state.userSavedSuccessfully,
        }"
      >
        <p class="message__text">{{ getMessage }}</p>
      </div>
      <p class="message__note">
        *Note: Do not scan the QR code yourself, as that would mark the ticket
        as used, and it therefore won't work at the event!
      </p>
    </div>
  </Layout>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Confirmation",
  metaInfo: {
    title: "Payment Confirmation",
  },
  computed: {
    ...mapGetters(["getMessage"]),
  },
};
</script>

<style lang="scss" scoped>
.outcome__container {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  margin-top: $spacer;
  text-align: center;
  margin-bottom: $spacer * 3;

  h2 {
    margin-bottom: 12px;
  }
  .outcome__icon {
    width: 50%;
    max-width: $contentWidth;
    margin-bottom: $spacer;

    @include screen-is(md) {
      width: max-content;
    }
  }
  .message__note {
    margin-top: $spacer;
  }
}

.form__message {
  background-color: $grey-light;
  padding: 16px 32px;
  max-width: $contentWidth;
  margin: 0 auto;

  .message__text {
    color: $background;
  }

  &--failure {
    background-color: $red;
  }
}
</style>
