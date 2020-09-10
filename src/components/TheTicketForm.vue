<template>
  <section class="event_the-form-container">
    <!-- Here will be the steps of the progress, and the form where
    you fill in the data, possibly with the connection to the payment thingy -->
    <div v-if="!isLoading" class="event_submit-message-container">
      <transition name="fade">
        <div v-if="getMessage" class="event_submit-message">
          <h2 class="event_submit-message-text">{{ getMessage }}</h2>
        </div>
      </transition>
    </div>
    <img v-if="isLoading" class="loader" src="@/assets/loading.gif" alt="" />
    <div v-else class="event_home-form">
      <h4>Order your ticket **</h4>
      <div class="form_elements">
        <label for="form_name">Name<small> *</small></label>
        <input
          v-model="inputName"
          class="form_name"
          type="text"
          placeholder="Your full name"
          required
          id="form_name"
        />
      </div>
      <div class="form_elements">
        <label for="form_email">E-mail<small> *</small></label>
        <input
          v-model="inputEmail"
          class="form_email"
          type="email"
          placeholder="Your e-mail"
          required
          id="form_email"
        />
      </div>
      <div class="form_elements">
        <label for="form_phone-number">Phone Number<small> *</small></label>
        <input
          v-model="inputPhoneNumber"
          type="tel"
          placeholder="+45"
          required
          id="form_phone-number"
        />
      </div>
      <div class="form_elements">
        <label for="form_payment-type">Payment<small> *</small></label>
        <div class="form_payment-type-container">
          <input
            v-model="inputPayment"
            class="form_payment-type"
            type="radio"
            value="MobilePay"
            id="form_payment"
          />
          <label for="form_payment-type">MobilePay</label>
        </div>
      </div>
      <small>* Required</small>
      <small class="black"
        >** Tickets are not refundable. In case you resell the ticket to someone
        else, it is your responsibility to inform us by email (<a
          href="mailto:feumticketing@gmail.com"
          >feumticketing@gmail.com</a
        >) the full name of the new owner followed by the ticket number.</small
      >
      <input
        class="form_submit"
        type="submit"
        value="Order"
        id="submit_button"
        @click="saveParticipant"
      />
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TheTicketForm",
  data: function() {
    return {
      inputName: "",
      inputEmail: "",
      inputPhoneNumber: "",
      inputPayment: ""
    };
  },
  computed: {
    ...mapGetters(["getTicketsLeft", "getMessage", "isLoading"])
  },
  methods: {
    async saveParticipant() {
      this.$store.commit("resetMessageText");

      if (
        !this.inputPayment ||
        !this.inputName.trim() ||
        !this.inputEmail.trim() ||
        // eslint-disable-next-line
        !this.inputEmail.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g) ||
        !this.inputPhoneNumber.trim() ||
        !this.inputPhoneNumber.match(
          /(\+45)?[0-9]{8}|(\+45 )?[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}/g
        )
      ) {
        this.$store.dispatch(
          "displayMessage",
          "Name, email, Danish phone number and payment method are required."
        );
        return;
      }

      await this.$store.dispatch("checkParticipantAmount");

      const ticketsLeft = this.$store.getters.getTicketsLeft;
      if (!ticketsLeft) {
        this.$store.dispatch(
          "displayMessage",
          "The maximum attendance capacity has unfortunately been reached."
        );
        return;
      }
      const newUserAmount = ticketsLeft + 1;

      const rawDatabaseResponse = await fetch(
        "https://feum-ticketing.dk/.netlify/functions/save-user-db",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            participantId: newUserAmount,
            name: this.inputName,
            email: this.inputEmail,
            phone: this.inputPhoneNumber
          })
        }
      );
      if (rawDatabaseResponse.status !== 200) {
        this.$store.dispatch(
          "displayMessage",
          await rawDatabaseResponse.text()
        );
        return;
      }
      const response = await rawDatabaseResponse.json();
      this.$store.dispatch("sendConfirmationEmail", response);
    }
  }
};
</script>

<style lang="scss" scoped>
.event_home-form {
  display: flex;
  flex-flow: column nowrap;

  h4 {
    padding: 0.8rem 0rem;
  }

  @include screen-is(lg) {
    margin: 0rem auto;
  }

  .form_elements {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding: 0.5rem 0rem;

    label {
      width: 50%;

      small {
        font-weight: bolder;
      }
    }

    input {
      width: 100%;
      padding: 0.5rem;
      border: 2px solid $black;

      @include screen-is(lg) {
        width: 50%;
      }
    }
    .form_payment-type-container {
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;

      @include screen-is(lg) {
        width: 50%;
      }

      .form_payment-type {
        -webkit-appearance: none;
        height: 15px;
        width: 15px;
        border-radius: 50%;
        border: 2px solid $black;
        margin: 0rem 1rem 0rem -0.5rem;
      }
      .form_payment-type:checked {
        background-color: $black;
      }
    }
  }
  small {
    padding: 0.8rem 0rem;
    font-size: 12px;
    color: $red;
  }
  .form_submit {
    width: 30%;
    margin: 1rem auto;
    padding: 0.5rem;
    border: 2px solid $black;
    background-color: $red;
    font-family: "SourceCode-Bold", "sans-serif";
    display: block;
  }
}
.event_submit-message-container {
  height: 60px;

  .event_submit-message {
    &.fade-enter-active,
    &.fade-leave-active {
      transition: all 0.5s;
    }
    &.fade-enter,
    &.fade-leave-to {
      transform: translateY(-100%);
      opacity: 0;
    }
    background-color: $red;
    border: 2px solid $black;
    padding: 0rem;

    h2 {
      padding: 0.5rem;
    }
  }
}
</style>
