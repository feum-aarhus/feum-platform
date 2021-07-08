<template>
  <nav class="navigation__inner">
    <ol class="nav__links">
      <li>
        <g-image class="nav__logo" src="~/assets/logo.svg" alt="FEUM logo" />
      </li>
      <li>
        <g-link to="https://feum.net/allevents" class="link--back">
          <p class="back__text">Back to all events</p>
        </g-link>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  name: "TheNavigation",
};
</script>

<style lang="scss" scoped>
.navigation__inner {
  max-width: $contentWidth;
  margin: 0 auto;

  .nav__links {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    font-size: 12px;

    .nav__logo {
      height: $navHeight;
      margin-top: $spacer;
      margin-bottom: $spacer * 3;

      @include screen-is(md) {
        margin-bottom: $spacer * 6;
        margin-top: 0;
      }
    }

    .link--back {
      display: flex;

      &::before {
        content: "\2190\0020";
        margin-right: 8px;
      }
      .back__text {
        text-transform: uppercase;
      }
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s;
}
.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
