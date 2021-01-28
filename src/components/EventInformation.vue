<template>
  <section>
    <!-- Here there will be the event information, like date, price artists, etc.
    This is where the changes to the content will happen -->
    <div class="event_information">
      <h4 class="red">FEUM Daze Event</h4>
      <h2>Fri. 18 September 2020</h2>
      <h2>From 16:00 to 00:00</h2>
      <h2>Ticket 120.00 kr.</h2>
      <h2>Venue limited to 100 people.</h2>
    </div>
    <div class="event_important-info">
      <h4 class="red">Please, read carefully.</h4>
      <div>
        <u
          >If you have the possibility, please, be present at the event before
          18:00.</u
        >
      </div>
      <b>FEUM is a community. </b>
      <span
        >And what creates this singular alchemy during our events is therefore a
      </span>
      <b>collective work. </b>
      <span>An </span>
      <b>authentic cooperation </b>
      <span
        >in which every single person is equally participating in setting the
        mood. A contribution provided by the staff, artists and you, the crowd.
      </span>
      <b
        >You, as a single human being, have an important influence regarding the
        outcome of this event.
      </b>
      <span
        >After spending hours to sharply select tracks, talented artists are
        crossing Denmark to share their passion for music. On the other side,
        you expect to be taken through a truly journey. This very specific and
        mutually beneficial relation between artists and the crowd is hardly
        describable. However, in any case, it must be preserved.
      </span>
    </div>
    <div class="event_tickets-container">
      <div
        v-if="getTicketsLeft && !isLoading"
        class="event_go-to-ticket"
        v-on:click="scrollToBottom()"
      >
        <h2>Get your ticket</h2>
      </div>
      <img v-if="isLoading" class="loader" src="@/assets/loading.gif" alt="" />
      <h4 v-else>Tickets left: {{ getTicketsLeft }}</h4>
    </div>
    <div class="event_welcome-message">
      <h4 class="red">Hejsa!</h4>
      <br />
      <h2>
        For those who were present at our last event, we hope that you had a
        great time :). For those who were too late to get a ticket, it is your
        chance to not make this mistake again! Our next event will be the 18th
        September 2020, from 16:00 to 00:00. It will take place under the bridge
        not far from Institut for X. It might be a bit chilly over there, so
        bring warm clothes. Do not worry however, we will make sure to prepare
        some bonfires around :). For this lovely day, we will welcome Markovela,
        Ida Daugaard, S.A.M. and Anastasia Kristensen. All of them will ensure
        to make you move and satisfy your ears.
      </h2>
      <br />
      <h2>
        As you know, we are evolving in a very particular situation. Therefore,
        we need to make sure that current rules related to health policy are
        strictly followed and applied. Thus, the event will
        <b>only be accessible for 100 people.</b> No ticket will be delivered at
        the entrance.
      </h2>
    </div>
    <div class="event_process-container">
      <div v-if="stepsVisible" class="event_the-steps">
        <div class="event_process-header">
          <h4 class="red">How to get your ticket</h4>
        </div>
        <div class="event_process-steps">
          <h2>01.</h2>
          <h3>
            You will have to provide your full name, email and phone number in
            the following form to book a ticket.
          </h3>
        </div>
        <div class="event_process-steps">
          <h2>02.</h2>
          <h3>
            Then, a confirmation email will be sent with details about the
            payment method. You will have a ticket reserved only when you are
            done with the payment.
          </h3>
        </div>
        <div class="event_process-steps">
          <h2>03.</h2>
          <h3>
            We would like to notice that you will not receive your e-tickets
            automatically after you pay. Yet, we will make sure that you receive
            it within 24 hours. Take it as a trust test between us ;).
          </h3>
        </div>
        <div class="event_process-steps">
          <h2>04.</h2>
          <h3>
            Finally, <b>bring your ticket and your ID. </b>We will check
            everything out at the entrance.
          </h3>
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
    TheTicketForm,
  },
  data: function () {
    return {
      stepsVisible: true,
    };
  },
  computed: {
    ...mapGetters(["getTicketsLeft", "isLoading"]),
  },
  methods: {
    scrollToBottom() {
      // this.stepsVisible = !this.stepsVisible;

      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.event_information {
  display: flex;
  flex-flow: column nowrap;
  border: 2px solid $content;

  h4 {
    padding: 0.5rem 0rem;
  }

  @include screen-is(lg) {
    margin: 0rem auto;
  }
}
.event_information > * {
  margin-left: 1.6rem;

  @include screen-is(lg) {
  }
}
.event_important-info {
  margin-top: 1.5rem;
  line-height: 1.3rem;
  hyphens: auto;

  h4 {
    text-align: center;
    margin-bottom: 0.8rem;
  }
}
.event_tickets-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  padding: 0.8rem 0rem;
  border: 2px solid $content;

  h4 {
    text-transform: uppercase;
  }

  .event_go-to-ticket {
    padding: 0.5rem;
    background-color: $highlight;
    border: 2px solid $content;
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
    border: 2px solid $content;
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
