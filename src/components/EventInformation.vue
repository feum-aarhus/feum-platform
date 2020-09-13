<template>
  <section>
    <!-- Here there will be the event information, like date, price artists, etc.
    This is where the changes to the content will happen -->
    <div class="event_information">
      <h4>FEUM Days Event</h4>
      <h2>Fri. 18.September 2020, 12:00-00:00.</h2>
      <h2>Event is limited to 100 people.</h2>
      <h2>Ticket 100.00 kr.</h2>
    </div>
    <div class="event_tickets-container">
      <div class="event_go-to-ticket" v-on:click="scrollToBottom()">
        <h2>Get your ticket</h2>
      </div>
      <img v-if="isLoading" class="loader" src="@/assets/loading.gif" alt="" />
      <h4 v-else>Tickets left: {{ getTicketsLeft }}</h4>
    </div>
    <div class="event_welcome-message">
      <h2>
        Hejsa! It has been a long time since we have seen each other, right?
        What about breaking this very boring habit? The 5th September 2020, from
        12PM to 12AM, an intimate meeting is organised. Forgive us for keeping
        the location secret though but we would like to surprise you :). For
        this great occasion, we will welcome Karsten Pflum, a talented Dane
        called as a sonic architect, producing very particular sounds. Around
        him, most of the FEUM crew will make sure to satisfy your ears.
      </h2>
      <h2>
        As you know, we are evolving in a very particular situation at the
        moment. Therefore, we need to make sure that current rules related to
        health policy are strictly followed and applied.
      </h2>
    </div>
    <div class="event_process-container">
      <div v-if="stepsVisible" class="event_the-steps">
        <div class="event_process-header">
          <h4><u>Important to know</u></h4>
        </div>
        <div class="event_process-steps">
          <h2>01.</h2>
          <h3>
            The event will only be accessible for 100 people. No ticket will be
            delivered at the entrance. If you ended up here too late, fear not!
            We will have many other opportunities to meet again :).
          </h3>
        </div>
        <div class="event_process-steps">
          <h2>02.</h2>
          <h3>
            For those who are on time, you will have to provide your full name,
            email and phone number in order to book a ticket.
          </h3>
        </div>
        <div class="event_process-steps">
          <h2>03.</h2>
          <h3>
            Then, a confirmation email will be sent with details about the
            payment method. You will have a ticket reserved only when you are
            done with the payment.
          </h3>
        </div>
        <div class="event_process-steps">
          <h2>04.</h2>
          <h3>
            We would like to notice that you will not receive your e-tickets
            automatically after you pay. However, we will make sure that you
            receive it within 24 hours.
          </h3>
        </div>
        <div class="event_process-steps">
          <h2>05.</h2>
          <h3>
            Finally, <b>bring your ticket and your ID. </b>We will check
            everything out at the entrance.
          </h3>
        </div>
        <div class="event_process-header">
          <h4><u>Important to know</u></h4>
        </div>
      </div>
      <TheTicketForm />
    </div>
  </section>
</template>

<script>
import TheTicketForm from "@/components/TheTicketForm";
import { mapGetters } from "vuex";

export default {
  name: "EventInformation",
  components: {
    TheTicketForm
  },
  data: function() {
    return {
      stepsVisible: true
    };
  },
  computed: {
    ...mapGetters(["getTicketsLeft", "isLoading"])
  },
  methods: {
    scrollToBottom() {
      // this.stepsVisible = !this.stepsVisible;

      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.event_information {
  display: flex;
  flex-flow: column nowrap;
  border: 2px solid $black;

  h4 {
    padding: 0.5rem 0rem;
    text-align: center;
  }

  @include screen-is(lg) {
    margin: 0rem auto;
  }
}
.event_information > * {
  width: 90%;
  margin: 0rem auto;

  @include screen-is(lg) {
    width: 40%;
  }
}
.event_tickets-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  padding: 0.8rem 0rem;
  border: 2px solid $black;

  h4 {
    text-transform: uppercase;
  }

  .event_go-to-ticket {
    padding: 0.5rem;
    background-color: $highlight;
    border: 2px solid $black;
    cursor: pointer;

    h2 {
      font-family: "SourceCode-Bold", "sans-serif";
    }
  }

  .event_tickets-left {
    padding: 0rem 0.5rem;
  }
}
.event_tickets-container > * {
  width: 80%;
  margin: 0.5rem auto;
  text-align: center;

  @include screen-is(lg) {
    width: 30%;
  }
}

.event_welcome-message {
  padding: 4.8rem 0rem 1.6rem 0;
}

.event_process-container {
  padding-top: 0;

  .event_process-header {
    display: flex;
    justify-content: center;
    padding: 0.4rem 0;

    h4 {
      font-family: "SourceCode-Bold", "sans-serif";
      text-transform: uppercase;
    }
  }

  .event_the-steps {
    border: 2px solid $black;
    padding: 1.2rem 1.6rem;
    margin-bottom: 1.6rem;

    .event_process-steps {
      display: flex;
      flex-flow: row nowrap;
      padding: 0.8rem 0rem;

      h2 {
        font-family: "SourceCode-Bold", "sans-serif";
      }
      h3 {
        padding-left: 0.8rem;
      }
    }
  }
}
</style>
