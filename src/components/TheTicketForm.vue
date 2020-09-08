<template>
  <section class="getticketform">
    <!-- Here will be the steps of the progress, and the form where
    you fill in the data, possibly with the connection to the payment thingy -->
    <div class="event_submit-message">
      <h2 class="event_submit-message-text">{{ getErrorMessage }}</h2>
    </div>
    <img
      v-if="isLoading"
      class="loader_submitting"
      src="assets/loading.gif"
      alt=""
    />
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
    ...mapGetters(["getTicketsLeft", "getErrorMessage", "isLoading"])
  },
  methods: {
    async saveParticipant() {
      this.$store.commit("resetError");

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
        this.$store.commit(
          "setError",
          "Name, email, Danish phone number and payment method are required."
        );
        return;
      }

      this.$store.commit("setLoading", true);

      const rawUserAmount = await fetch(
        "https://feum-ticketing.dk/.netlify/functions/get-current-user-amount"
      );

      if (rawUserAmount.status !== 200) {
        this.$store.commit(
          "setError",
          "There has been an error, please try again later."
        );
        return;
      }
      let newUserAmount = Number(await rawUserAmount.json());
      newUserAmount = newUserAmount + 1;

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
        this.$store.commit("setError", await rawDatabaseResponse.text());
        this.$store.commit("setLoading", false);
        return;
      }
      const response = await rawDatabaseResponse.json();
      // sendConfirmationEmail(response);
      console.log(response);
    }
  }
};
</script>

<style lang="scss" scoped>
.loader {
  width: 100px;
  margin: 0rem auto;
  display: block;

  &_submitting {
    display: none;

    &.shown {
      width: 100px;
      margin: 0rem auto;
      display: block;
    }
  }
}
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
      border: 2px solid black;

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
        border: 2px solid black;
        margin: 0rem 1rem 0rem -0.5rem;
      }
      .form_payment-type:checked {
        background-color: black;
      }
    }
  }
  small {
    padding: 0.8rem 0rem;
    font-size: 12px;
    color: #ff5555;
  }
  .form_submit {
    width: 30%;
    margin: 1rem auto;
    padding: 0.5rem;
    border: 2px solid black;
    background-color: #ff5555;
    font-family: "SourceCode-Bold", "sans-serif";
    display: block;

    &.form_submit-hidden {
      display: none;
    }
  }
}
.event_submit-message {
  display: none;
  background-color: #ff5555;
  border: 2px solid black;
  padding: 0;

  h2 {
    padding: 0.5rem;
  }
  &.event_submit-message-displaying {
    display: block;
  }
}
</style>
