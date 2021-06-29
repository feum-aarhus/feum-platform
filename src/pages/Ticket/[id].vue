<template>
  <div class="verification__container">
    <g-image
      v-if="isLoading"
      class="loader verification__loader"
      src="~/assets/golden.svg"
      alt="Loading spinner"
    />
    <div class="verification__visuals" v-else>
      <g-image
        v-if="ticketValid"
        src="~/assets/tick-grey.svg"
        alt="Success tick icon"
      />
      <g-image v-else src="~/assets/cross-grey.svg" alt="Invalid cross icon" />
      <h1>This ticket is {{ this.ticketValid ? "valid" : "invalid" }}!</h1>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Ticket",
  metaInfo() {
    return {
      title: "Ticket " + this.$route.params.id,
    };
  },
  data: function () {
    return {
      ticketValid: null,
    };
  },
  computed: {
    ...mapGetters(["isLoading"]),
  },
  mounted: async function () {
    if (!this.$route.params.id) return;
    this.$store.commit("setLoading", true);
    try {
      await this.$store.dispatch("verifyTicket", this.$route.params.id);
      this.ticketValid = true;
      document.body.style.backgroundColor = "greenyellow";
    } catch (error) {
      this.ticketValid = false;
      document.body.style.backgroundColor = "#ff5555";
    }
    this.$store.commit("setLoading", false);
  },
};
</script>

<style lang="scss" scoped>
.verification__container {
  display: flex;
  align-items: center;
  justify-content: center;

  .verification__visuals {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    margin: $spacer;

    h1 {
      margin-top: $spacer;
      text-align: center;
      color: $grey;
    }
  }
  .verification__loader {
    margin-top: $spacer;
  }
}
</style>
