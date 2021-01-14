<template>
  <nav class="navigation">
    <transition name="slide" mode="in-out">
      <div key="head" class="navigation__head" v-if="collapsed">
        <div class="navigation__toggle" @click="toggleNav">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <g-link to="/events" class="button">Events</g-link>
      </div>
      <div key="drawer" class="navigation__drawer" v-else>
        <div class="drawer__close" @click="toggleNav"></div>
      </div>
    </transition>
  </nav>
</template>

<script>
export default {
  name: "TheNavigation",
  data: function () {
    return {
      collapsed: true,
    };
  },
  methods: {
    toggleNav() {
      this.collapsed = !this.collapsed;
    },
  },
};
</script>

<style lang="scss" scoped>
.navigation {
  .navigation__head {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .navigation__toggle {
      div {
        height: 3px;
        width: 20px;
        background-color: $grey-light;

        &:not(:last-child) {
          margin-bottom: 3px;
        }
      }
    }
  }

  .navigation__drawer {
    height: calc(100vh - #{$spacer} * 2);
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $background;
    padding: $spacer;

    .drawer__close {
      width: 18px;
      height: 18px;
      text-align: center;
      &::before,
      &::after {
        position: absolute;
        content: "";
        height: 18px;
        width: 3px;
        background-color: $grey-light;
      }
      &::before {
        transform: rotate(45deg);
      }
      &::after {
        transform: rotate(-45deg);
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
    transform: translateX(100%);
  }
}
</style>
