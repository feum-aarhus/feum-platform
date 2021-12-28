<template>
  <section>
    <div class="form__progress">
      {{ "Step " + currentStep + "/2" }}
    </div>
    <transition name="fade">
      <div v-if="getMessage" class="form__message">
        <p class="message__text">{{ getMessage }}</p>
      </div>
    </transition>
    <transition-group name="appear">
      <hr v-if="hasPersistedData" key="line" class="marginless" />
      <div
        class="stripe__container"
        v-if="hasPersistedData && hasTicketsLeft"
        key="card-field"
      >
        <h2 class="stripe__heading">Step 2: Card info</h2>
        <div class="stripe__card" ref="stripeContainer"></div>
      </div>
    </transition-group>
    <g-image
      v-if="isLoading"
      class="loader form__loader"
      src="~/assets/golden.svg"
      alt="Loading spinner"
    />
    <div v-else-if="!hasTicketsLeft" class="form--sold">
      <h2>Sorry, this event just got sold out.</h2>
    </div>
    <div v-else>
      <transition name="appear" mode="out-in">
        <div key="input" v-if="!hasPersistedData" class="form__container">
          <h2>Step 1: Your info</h2>
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
            class="form__field form__field--phone"
            maxlength="15"
          />
          <input
            class="form__submit button"
            type="button"
            value="Next"
            @click="verifyUserInput"
          />
        </div>
        <div key="stripe" class="submit__wrapper" v-else>
          <div class="form__terms">
            <input type="checkbox" id="terms" v-model="agreedWithTerms" />
            <label for="terms" class="marginless"
              ><a
                v-if="!agreedWithTerms"
                href="https://feum-ticketing.dk/terms"
                target="_blank"
                rel="noopener noreferrer"
                >Here are our terms and conditions</a
              >{{
                !this.agreedWithTerms
                  ? ", are you on board?"
                  : "Cool, let's go!"
              }}</label
            >
          </div>
          <div
            v-if="hasInitializedPayment"
            ref="stripeSubmit"
            :class="{ disabled: isCardFieldEmpty }"
            class="submit__button button"
          >
            {{ "Pay " + eventPrice + " kr." }}
          </div>
          <div class="form__back" @click="editInformation">Edit your info</div>
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import { loadStripe } from "@stripe/stripe-js/pure";

export default {
  name: "TheTicketForm",
  data: function () {
    return {
      userName: "",
      userEmail: "",
      userPhone: "",
      isCardFieldEmpty: true,
      agreedWithTerms: false,
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
      "hasInitializedPayment",
    ]),
    currentStep() {
      return this.hasPersistedData ? 2 : 1;
    },
  },
  methods: {
    async verifyUserInput() {
      this.$store.commit("resetMessageText");
      if (
        !this.userName.trim() ||
        !this.userEmail.match(
          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g
        ) ||
        !this.userPhone.match(/[0-9 ]{8,}/g)
      ) {
        this.$store.dispatch("displayMessage", {
          messageText: "Name, and a valid email and phone number are required.",
          keepUpFor: 5000,
        });
        return;
      }
      this.$store.commit("setLoading", true);
      try {
        await this.$store.dispatch(
          "checkForDuplicateParticipant",
          this.userEmail.trim()
        );
      } catch (error) {
        this.$store.dispatch("displayMessage", {
          messageText: error,
          keepUpFor: 5000,
        });
        return;
      }
      this.$store.commit("setLoading", false);
      await this.$store.dispatch("persistUserData", {
        userName: this.userName.trim(),
        userEmail: this.userEmail.trim(),
        userPhone: this.userPhone,
      });
      this.summonStripe();
    },
    async summonStripe() {
      if (this.hasPersistedData && this.$refs.stripeContainer) {
        this.$store.commit("setLoading", true);
        if (!this.$store.state.paymentId) {
          // The price must be in øre...hence times 100
          await this.$store.dispatch("createPayment", this.eventPrice * 100);
        }
        const stripe = await loadStripe(process.env.GRIDSOME_STRIPE_PUBLIC_KEY);
        this.$store.commit("setLoading", false);
        const elements = stripe.elements({
          fonts: [
            {
              cssSrc:
                "https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap",
            },
          ],
        });
        const card = elements.create("card", {
          style: {
            base: {
              color: "#e1e1e1",
              iconColor: "#e1e1e1",
              fontFamily: "Roboto, sans-serif",
              fontSmoothing: "antialiased",
              fontSize: "16px",
              "::placeholder": {
                color: "#e1e1e1",
              },
            },
            invalid: {
              fontFamily: "Roboto, sans-serif",
              color: "#ff5555",
              iconColor: "#ff5555",
            },
          },
        });
        await this.$nextTick();
        // Stripe injects an iframe into the DOM
        card.mount(".stripe__card");
        this.isCardFieldEmpty = true;
        card.on("change", (event) => {
          this.isCardFieldEmpty = event.empty;
        });
        this.$refs.stripeSubmit.addEventListener("click", () =>
          this.makePayment(stripe, card)
        );
      }
    },
    async makePayment(
      stripeLibrary,
      cardElement,
      paymentId = this.$store.state.paymentId
    ) {
      if (this.isCardFieldEmpty) return;
      if (!this.agreedWithTerms) {
        this.$store.dispatch("displayMessage", {
          messageText: "Sorry, the terms are there for a reason.",
          keepUpFor: 5000,
        });
        return;
      }
      this.$store.commit("setLoading", true);
      await this.$store.dispatch("checkParticipantAmount");
      if (!this.hasTicketsLeft) {
        this.$store.dispatch("displayMessage", {
          messageText:
            "The maximum attendance capacity has unfortunately just been reached.",
          keepUpFor: 5000,
        });
        this.$store.commit("resetPaymentData");
        return;
      }
      const paymentResponse = await stripeLibrary.confirmCardPayment(
        paymentId,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: this.$store.state.userEmail,
              name: this.$store.state.userName,
              phone: this.$store.state.userPhone,
            },
          },
        }
      );
      this.$store.commit("setLoading", false);
      if (paymentResponse.error) {
        this.$store.dispatch("displayMessage", {
          messageText: paymentResponse.error.message,
          keepUpFor: 5000,
        });
        this.summonStripe();
      } else {
        this.handleSuccess();
      }
    },
    async handleSuccess() {
      this.$store.commit("setLoading", true);
      this.$store
        .dispatch("saveParticipant", {
          email: this.$store.state.userEmail,
          name: this.$store.state.userName,
          phone: this.$store.state.userPhone,
        })
        .then((message) => {
          this.$router.push("/confirmation", () =>
            this.$store.dispatch("displayMessage", {
              messageText: message,
              keepUpFor: null,
            })
          );
        });
    },
    editInformation() {
      this.$store.commit("confirmUserData", false);
    },
  },
  mounted: function () {
    this.summonStripe();
  },
  beforeDestroy: function () {
    if (this.$refs.stripeSubmit) {
      this.$refs.stripeSubmit.removeEventListener(
        "click",
        () => this.makePayment
      );
    }
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

.form--sold {
  padding: 32px;
  background-color: $red;
}

.form__loader {
  margin-top: $spacer;
}

.submit__wrapper {
  .submit__button {
    margin: 16px 32px 16px 32px;
    padding: 8px;

    &.disabled {
      cursor: default;
      color: grey;
    }
  }
  .form__terms {
    margin: 0 32px;
    display: flex;

    input {
      margin-right: 8px;
      -webkit-appearance: none;
      -moz-appearance: none;
      width: $spacer / 2;
      height: $spacer / 2;
      background-color: $grey-light;

      &:checked {
        background-color: greenyellow;
      }
    }
  }
  .form__back {
    margin: 32px;
    text-decoration: underline;
    cursor: pointer;

    &::before {
      content: "\2190\0020";
    }
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

.form__progress {
  text-transform: uppercase;
  text-align: center;
  font-family: "Helvetica-Bold";
  padding: 4px 0;
  color: $background;
  background-color: $grey-light;
}

.appear-enter-active,
.appear-leave-active {
  transition: opacity 0.5s;
}
.appear-enter,
.appear-leave-to {
  opacity: 0;
}

// Stripe styling
.stripe__container {
  margin: $spacer 0 $spacer * 1.5 0;

  .stripe__heading {
    margin-bottom: 12px;
    padding: 0 32px;
  }

  .stripe__card {
    height: $stripeCardHeight;
    padding: 16px 32px;
    background-color: $grey;
  }
}
</style>
