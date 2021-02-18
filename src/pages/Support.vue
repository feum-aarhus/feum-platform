<template>
  <Layout>
    <div class="support__container">
      <h2>Support us</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
        ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
        dis parturient montes, nascetur ridiculus mus. Donec quam felis,
        ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa
        quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget,
        arcu.
      </p>
      <a
        href="https://mobilepay.dk/erhverv/betalingslink/betalingslink-svar?phone=29750"
        class="button support__button"
      >
        <span>Donate</span>
        <g-image src="~/assets/mobilepay.svg" alt="MobilePay logo" />
      </a>
      <h2>Become a member</h2>
      <div class="member__form">
        <label for="name">Full name</label>
        <input type="text" id="name" class="form__field" />
        <label for="email">Email</label>
        <input type="email" id="email" class="form__field" />
        <div class="form__field--consent">
          <input type="checkbox" id="consent" />
          <label for="consent"
            >Yes, I want to receive exclusive event invites and news</label
          >
        </div>
        <div class="button member__button">Join us</div>
      </div>
    </div>
  </Layout>
</template>

<script>
export default {
  name: "Support",
  metaInfo: {
    title: "Support Us",
  },
};
</script>

<style lang="scss" scoped>
.support__container {
  margin: 32px auto 0 auto;
  max-width: $contentWidth;

  @include screen-is(md) {
    margin-top: $spacer * 4;
  }

  h2 {
    text-align: center;
    margin-bottom: $spacer;
  }

  .support__button img {
    width: 24px;
    margin-left: 8px;
  }

  .support__button,
  .member__button {
    height: $buttonHeight;
    width: 160px;
    margin: 32px auto $spacer * 2 auto;
  }

  .member__form {
    display: flex;
    flex-flow: column nowrap;

    .form__field {
      margin-bottom: 8px;

      &--consent {
        margin-top: 16px;
        display: flex;
        align-items: flex-start;

        input[type="checkbox"] {
          margin-right: 8px;
        }

        label {
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          color: inherit;
          margin-bottom: 0;
        }
      }
    }

    .member__button {
      margin-bottom: 0;
    }
  }
}
</style>
