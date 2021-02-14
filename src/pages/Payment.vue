<template>
  <Layout>
    <div class="status__wrapper">
      <g-image
        v-if="isLoading"
        class="loader"
        src="~/assets/golden.svg"
        alt="Loading spinner"
      />
      <transition name="enlarge">
        <div
          v-if="paymentStatus"
          class="status__container"
          :class="
            paymentSucceeded
              ? 'status__container--success'
              : 'status__container--fail'
          "
        >
          <h2>
            {{
              paymentSucceeded
                ? "The payment succeeded!"
                : "The payment failed."
            }}
          </h2>
          <p v-if="!paymentSucceeded">
            No money was subtracted from your account.
          </p>
          <p v-else-if="paymentSucceeded">
            A confirmation email has been sent to your mailbox.
          </p>
        </div>
      </transition>
    </div>
  </Layout>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Payment",
  metaInfo: {
    title: "Payment Status",
  },
  data: function () {
    return {
      paymentStatus: null,
    };
  },
  computed: {
    ...mapGetters(["isLoading"]),
    paymentSucceeded() {
      switch (this.paymentStatus?.resultCode) {
        case "Authorised":
          return true;
        default:
          return false;
      }
    },
  },
  mounted: async function () {
    if (typeof window === "undefined") return;
    const paymentData = window.localStorage.getItem("paymentData");
    if (!this.$route.query.payload || !paymentData) {
      console.log(
        "Data incomplete, query: ",
        this.$route.query.payload,
        "localStorage thingy: ",
        paymentData
      );
      this.$router.push("/");
      return;
    }

    this.$store.commit("setLoading", true);
    const rawPaymentStatus = await fetch(
      `${process.env.GRIDSOME_API_URL}.netlify/functions/get-payment-status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentData,
          details: {
            redirectResult: decodeURIComponent(this.$route.query.payload),
          },
        }),
      }
    );
    if (rawPaymentStatus.status !== 200) {
      window.localStorage.removeItem("paymentData");
      this.$router.push("/");
      return;
    }
    const paymentStatus = await rawPaymentStatus.json();
    this.$store.commit("setLoading", false);
    this.paymentStatus = paymentStatus;
  },
};
</script>

<style lang="scss" scoped>
.status__wrapper {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;

  .loader,
  .status__container {
    margin-top: 32px;

    @include screen-is(md) {
      margin: $spacer * 2;
    }
  }

  .status__container {
    padding: 16px;
    text-align: center;

    h2 {
      margin-bottom: 8px;
      color: $background;
    }

    p {
      color: $background;
    }

    &--success {
      background-color: $grey-light;
    }
    &--fail {
      background-color: $red;
    }

    @include screen-is(md) {
      padding: $spacer;
    }
  }
}

.enlarge-enter-active,
.enlarge-leave-active {
  transition: transform 0.2s;
}
.enlarge-enter,
.enlarge-leave-to {
  transform: scale(0);
}
</style>
