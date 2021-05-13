<template>
  <section>
    <transition name="fade">
      <div v-if="getMessage" class="form__message">
        <p class="message__text">{{ getMessage }}</p>
      </div>
    </transition>
    <g-image
      v-if="isLoading"
      class="loader"
      src="~/assets/golden.svg"
      alt="Loading spinner"
    />
    <div v-else>
      <transition name="appear" mode="out-in" @after-enter="handleStepChange">
        <div key="input" v-if="!hasPersistedData" class="form__container">
          <h2>Payment info</h2>
          <label for="name">Full name</label>
          <input
            v-model="userName"
            type="text"
            id="name"
            class="form__field form__field--name"
          />
          <label for="email">Email</label>
          <input
            v-model="userEmail"
            type="email"
            id="email"
            class="form__field form__field--email"
          />
          <label for="phone">Phone number</label>
          <input
            v-model="userPhone"
            type="tel"
            id="phone"
            maxlength="8"
            placeholder="+45"
            class="form__field form__field--phone"
          />
          <input
            class="form__submit button"
            type="button"
            value="Next"
            @click="verifyUserInput"
          />
        </div>
        <g-link class="snipcart-checkout" ref="snipcartTrigger" v-else>
          Go to Snipcart
        </g-link>
      </transition>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TheTicketForm",
  data: function () {
    return {
      userName: "",
      userEmail: "",
      userPhone: "",
    };
  },
  props: {
    eventPrice: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      "hasTicketsLeft",
      "getMessage",
      "hasPersistedData",
      "isLoading",
    ]),
  },
  methods: {
    async verifyUserInput() {
      this.$store.commit("resetMessageText");
      if (
        !this.userName.trim() ||
        !this.userEmail.match(
          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g
        ) ||
        !this.userPhone.match(/[0-9]{8}/g)
      ) {
        this.$store.dispatch(
          "displayMessage",
          "Name, email, and a Danish phone number are required."
        );
        return;
      }
      await this.$store.dispatch("persistUserData", {
        userName: this.userName.trim(),
        userEmail: this.userEmail.trim(),
        userPhone: this.userPhone,
      });
    },
    handleStepChange() {
      // if (this.hasPersistedData && this.$refs.snipcartTrigger) {
      // }
    },
    async makePayment(adyenData) {
      this.$store.commit("setLoading", true);
      await this.$store.dispatch("checkParticipantAmount");
      if (!this.hasTicketsLeft) {
        throw new Error(
          "The maximum attendance capacity has unfortunately been reached."
        );
      }
      this.$store.commit("setLoading", false);
    },
  },
  mounted: function () {
    this.handleStepChange();
  },
};
</script>

<style lang="scss" scoped>
.form__container {
  display: flex;
  flex-flow: column nowrap;
  padding: 32px 32px 0 32px;

  &.appear-leave-active {
    height: 0px;
  }

  h2 {
    margin-bottom: 16px;
  }

  .form__field:not(:nth-of-type(3)) {
    margin-bottom: 16px;
  }

  .form__submit {
    width: 100%;
    margin: 32px auto;
    height: $spacer * 2;
    border: none;
    background-color: $heading;
  }
}

.form__message {
  background-color: $red;
  padding: 16px 32px;

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

.appear-enter-active,
.appear-leave-active {
  transition: opacity 0.1s;
}
.appear-enter,
.appear-leave-to {
  opacity: 0;
}

// Snipcart styling
::v-deep .snipcart__container {
  &.appear-leave-active {
    margin-top: $spacer;
  }
}
</style>
