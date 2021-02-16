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
        <div
          key="adyen"
          class="adyen__container"
          v-else
          ref="adyenContainer"
        ></div>
      </transition>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
let AdyenCheckout = null;
try {
  AdyenCheckout = require("@adyen/adyen-web");
} catch (error) {
  console.log(error);
}
import "@adyen/adyen-web/dist/adyen.css";

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
    summonAdyen() {
      const configuration = {
        paymentMethodsResponse: {
          paymentMethods: [
            {
              name: "MobilePay",
              supportsRecurring: true,
              type: "mobilepay",
            },
          ],
        },
        clientKey: process.env.GRIDSOME_ADYEN_CLIENT,
        locale: "en-US",
        environment: "test",
        onSubmit: (state, dropin) => {
          this.makePayment(state.data)
            .then((response) => {
              if (response.action) {
                dropin.handleAction(response.action);
              } else {
                console.log(response); // Handle cases without an action
              }
            })
            .catch((error) => {
              this.$store.dispatch("displayMessage", error.message);
              setTimeout(() => {
                this.$emit("closeForm");
              }, 5000);
            });
        },
        onAdditionalDetails: (state, dropin) => {
          console.log(state, dropin);
        },
      };
      const checkout = new AdyenCheckout(configuration);
      checkout.create("dropin").mount(this.$refs.adyenContainer);
    },
    handleStepChange() {
      if (this.hasPersistedData && this.$refs.adyenContainer) {
        this.summonAdyen();
      }
    },
    async makePayment(adyenData) {
      this.$store.commit("setLoading", true);
      await this.$store.dispatch("checkParticipantAmount");
      if (!this.hasTicketsLeft) {
        throw new Error(
          "The maximum attendance capacity has unfortunately been reached."
        );
      }

      const rawDatabaseResponse = await fetch(
        `${process.env.GRIDSOME_API_URL}.netlify/functions/make-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: { currency: "DKK", value: this.eventPrice },
            adyenData,
            telephoneNumber: "+45" + this.userPhone,
            reference: this.userName.trim(),
          }),
        }
      );
      const response = await rawDatabaseResponse.json();
      this.$store.commit("setLoading", false);
      if (response?.action?.paymentData && typeof window !== "undefined") {
        window.localStorage.setItem("paymentData", response.action.paymentData);
        return response;
      }
      throw new Error(
        "Something happened while redirecting you to MobilePay, please try again later."
      );
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

// Adyen styling
::v-deep .adyen__container {
  &.appear-leave-active {
    margin-top: $spacer;
  }

  .adyen-checkout__payment-method {
    border-radius: 0;
    padding: 0 16px;
    background-color: $background;
    border: none;

    .adyen-checkout__payment-method__header {
      display: none;
    }

    .adyen-checkout__payment-method__details__content {
      margin: 0;

      button {
        border-radius: 0;
        font-family: "Benzin-Semibold";
        background-color: $heading;
        text-transform: uppercase;
        color: $background;
        height: $buttonHeight;
        margin-bottom: $spacer;
        line-height: 20px;

        &:hover,
        &:focus {
          background-color: $heading;
          box-shadow: none;
        }

        .adyen-checkout__button__text {
          overflow: visible;
        }
      }
    }
  }
}
</style>
