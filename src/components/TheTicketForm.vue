<template>
  <section>
    <transition name="fade">
      <div v-if="getMessage" class="form__message">
        <p class="message__text">{{ getMessage }}</p>
      </div>
    </transition>
    <transition name="swipe" mode="out-in" @after-enter="handleStepChange">
      <div key="input" v-if="!hasPersistedData" class="form__container">
        <h2>Ticket info</h2>
        <input
          v-model="userName"
          type="text"
          placeholder="Full name"
          class="form__field form__field--name"
        />
        <input
          v-model="userEmail"
          type="email"
          placeholder="Email"
          class="form__field form__field--email"
        />
        <input
          v-model="userPhone"
          type="tel"
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
      <div key="adyen" v-else ref="adyenContainer"></div>
    </transition>
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
    ...mapGetters(["getTicketsLeft", "getMessage", "hasPersistedData"]),
  },
  methods: {
    async verifyUserInput() {
      this.$store.commit("resetMessageText");

      if (
        !this.userName.trim() ||
        !this.userEmail.trim() ||
        !this.userEmail.match(
          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g
        ) ||
        !this.userPhone.trim() ||
        !this.userPhone.match(
          /(\+45)?[0-9]{8}|(\+45 )?[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}/g
        )
      ) {
        this.$store.dispatch(
          "displayMessage",
          "Name, email, and a Danish phone number are required."
        );
        return;
      }

      await this.$store.dispatch("persistUserData", {
        userName: this.userName,
        userEmail: this.userEmail,
        userPhone: this.userPhone,
      });

      // this.$store.commit("setLoading", true);

      // await this.$store.dispatch("checkParticipantAmount");

      // const ticketsLeft = this.getTicketsLeft;
      // if (ticketsLeft <= 0) {
      //   this.$store.dispatch(
      //     "displayMessage",
      //     "The maximum attendance capacity has unfortunately been reached."
      //   );
      //   return;
      // }
      // const newUserAmount = ticketsLeft + 1;

      // const rawDatabaseResponse = await fetch(
      //   `${process.env.GRIDSOME_API_URL}.netlify/functions/save-user-db`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       participantId: newUserAmount,
      //       name: this.userName,
      //       email: this.userEmail,
      //       phone: this.userPhone,
      //     }),
      //   }
      // );
      // if (rawDatabaseResponse.status !== 200) {
      //   this.$store.dispatch(
      //     "displayMessage",
      //     await rawDatabaseResponse.text()
      //   );
      //   return;
      // }
      // const response = await rawDatabaseResponse.json();
      // await this.$store.dispatch("sendConfirmationEmail", response);
      // this.$store.commit("setLoading", false);
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
          console.log(state, dropin);
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

  h2 {
    margin-bottom: 8px;
  }

  .form__field {
    display: flex;
    align-items: center;
    height: 34px;
    background-color: $background;
    border: 1px solid $grey-light;
    border-radius: 0;
    padding: 6px 8px;
    color: $grey-light;
    margin-bottom: 4px;

    &::placeholder {
      color: $content;
      font-family: "Roboto-Regular";
      font-size: 14px;
      line-height: 16px;
    }

    &:invalid {
      border-color: $grey-light;
      box-shadow: none;
    }
  }
  .form__submit {
    width: 30%;
    margin: 16px auto;
    padding: 8px;
    border: none;
    background-color: $heading;
  }
}

.form__message {
  background-color: $red;
  padding: 6px 8px;
  margin-bottom: 8px;

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

.swipe-enter-active,
.swipe-leave-active {
  transition: transform 0.1s;
}
.swipe-enter,
.swipe-leave-to {
  transform: translateX(-100%);
}
</style>
