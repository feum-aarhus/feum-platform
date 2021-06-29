<template>
  <Layout>
    <transition name="fade">
      <div v-if="getMessage" class="form__message">
        <p class="message__text">{{ getMessage }}</p>
      </div>
    </transition>
    <div class="success__container">
      <g-image
        class="success__tick"
        src="~/assets/tick.svg"
        alt="Success tick icon"
      />
      <h2>Thank you!</h2>
      <p>A confirmation email should be arriving shortly in your mailbox.</p>
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
  mounted: async function () {},
};
</script>

<style lang="scss" scoped>
.success__container {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  margin-top: $spacer;
  text-align: center;

  h2 {
    margin-bottom: 8px;
  }
  .success__tick {
    width: max-content;
    max-width: $contentWidth;
    margin-bottom: $spacer;
  }

  @include screen-is(md) {
    margin: $spacer * 2;
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

  &.fade-enter-active,
  &.fade-leave-active {
    transition: all 0.5s;
  }
  &.fade-enter,
  &.fade-leave-to {
    transform: translateY(-100%);
    opacity: 0;
  }
}
</style>
