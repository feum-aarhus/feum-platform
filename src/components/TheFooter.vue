<template>
  <footer class="footer">
    <p>FEUM 2022 All rights reserved</p>
    <p class="footer__email">
      | <a href="mailto:hello@feum.net">hello@feum.net</a> |
    </p>
    <div class="footer__social">
      <a
        href="https://www.facebook.com/feumdk/"
        target="_blank"
        rel="noopener noreferrer"
        ><g-image src="~/assets/facebook-small.svg" alt="Facebook icon"
      /></a>
      <a
        href="https://www.instagram.com/feum_dk/"
        target="_blank"
        rel="noopener noreferrer"
        ><g-image src="~/assets/instagram-small.svg" alt="Instagram icon"
      /></a>
      <a
        href="https://soundcloud.com/feum"
        target="_blank"
        rel="noopener noreferrer"
        ><g-image src="~/assets/soundcloud-small.svg" alt="Soundcloud icon"
      /></a>
    </div>
  </footer>
</template>

<script>
export default {
  name: "TheFooter",
};
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  margin: 42px 0 $spacer 0;

  @include screen-is(md) {
    flex-flow: row nowrap;
    margin-bottom: 42px;

    .footer__email {
      margin: 0 $spacer 0 6px;
    }
  }

  .footer__social {
    width: 90px;
    margin-top: 16px;
    display: flex;
    justify-content: space-between;

    @include screen-is(md) {
      margin-top: 0;
    }
  }
}
</style>
