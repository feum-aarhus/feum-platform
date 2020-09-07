<template>
  <section class="event_information">
    <!-- Here there will be the event information, like date, price artists, etc.
    This is where the changes to the content will happen -->
    <h4>FEUM Days Event</h4>
    <h2>Fri. 18.September 2020, 12:00-00:00.</h2>
    <h2>Event is limited to 100 people.</h2>
    <h2>Ticket 100.00 kr.</h2>
    <div class="event_tickets-container">
      <h4>Tickets left:</h4>
      <h4 class="event_tickets-left"></h4>
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
  </section>
</template>

<script>
export default {
  name: "EventInformation"
};
</script>

<style lang="scss" scoped>
.event_information {
  display: flex;
  flex-flow: column nowrap;

  h4 {
    padding: 0.5rem 0rem;
  }

  @include screen-is(lg) {
    margin: 0rem auto;
  }

  .event_tickets-container {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    padding: 0.8rem 0rem;

    h4 {
      text-transform: uppercase;
    }

    .event_tickets-left {
      padding: 0rem 0.5rem;
    }
  }

  .event_welcome-message {
    padding: 0.8rem 0rem;
  }
}
</style>
