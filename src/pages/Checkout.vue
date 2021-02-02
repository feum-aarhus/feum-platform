<template>
  <div>
    <div ref="adyenContainer"></div>
  </div>
</template>

<script>
import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";

export default {
  name: "Checkout",
  metaInfo: {
    title: "Checkout",
  },
  mounted: function () {
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
      amount: {
        value: 1000,
        currency: "DKK",
      },
    };
    const checkout = new AdyenCheckout(configuration);
    checkout.create("dropin").mount(this.$refs.adyenContainer);
  },
};
</script>

<style lang="scss" scoped></style>
