<template>
  <nav class="navigation">
    <!-- Phone -->
    <div class="navigation--phone">
      <div class="navigation__toggle" @click="toggleNav">
        <div class="toggle__icon" :class="{ active: !collapsed }"></div>
      </div>
      <transition name="slide" mode="in-out">
        <div key="head" class="navigation__head" v-if="collapsed">
          <g-link
            class="navigation__events button"
            v-if="$route.fullPath === '/'"
            to="/events"
          >
            Events
          </g-link>
          <g-image
            v-else
            class="head__logo"
            src="~/assets/logo.svg"
            alt="FEUM logo"
          />
        </div>
        <div key="drawer" class="navigation__drawer" v-else>
          <g-image
            class="drawer__logo"
            src="~/assets/logo.svg"
            alt="FEUM logo"
          />
          <ol @click="toggleNav" class="drawer__links">
            <li>
              <g-link to="/" class="link">Home</g-link>
            </li>
            <li>
              <g-link to="/events" class="link">Events</g-link>
            </li>
            <li>
              <g-link to="/about" class="link">About</g-link>
            </li>
            <li>
              <g-link to="/support" class="link">Support</g-link>
            </li>
            <li>
              <g-link to="/contact" class="link">Contact</g-link>
            </li>
            <li class="drawer__some">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <g-image src="~/assets/facebook.svg" alt="Facebook logo" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <g-image src="~/assets/instagram.svg" alt="Instagram logo" />
              </a>
            </li>
          </ol>
        </div>
      </transition>
    </div>
    <!-- Desktop -->
    <div class="navigation--desktop">
      <ol class="desktop__links">
        <li>
          <g-link to="/" class="link">Home</g-link>
        </li>
        <li>
          <g-link to="/about" class="link">About</g-link>
        </li>
        <g-image
          v-if="$route.fullPath !== '/'"
          class="desktop__logo"
          src="~/assets/logo.svg"
          alt="FEUM logo"
        />
        <li>
          <g-link to="/support" class="link">Support</g-link>
        </li>
        <li>
          <g-link to="/contact" class="link">Contact</g-link>
        </li>
      </ol>
      <g-link class="button desktop__events" to="/events"> Our events </g-link>
      <div class="desktop__some">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <g-image src="~/assets/facebook.svg" alt="Facebook logo" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <g-image src="~/assets/instagram.svg" alt="Instagram logo" />
        </a>
      </div>
    </div>
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
.navigation--phone {
  display: block;

  @include screen-is(md) {
    display: none;
  }

  .navigation__toggle {
    position: absolute;
    overflow: hidden;
    z-index: 2;
    top: 17px;
    height: 21px;
    width: 26px;
    padding: 9.5px 7px;

    .toggle__icon {
      position: relative;
      top: 10px;
      height: 1px;
      width: 100%;
      background-color: $grey-light;
      transition: background-color 0.125s ease-in 0.175s;

      &::after,
      &::before {
        content: "";
        height: 1px;
        display: block;
        background-color: $grey-light;
        position: absolute;
        width: 100%;
      }

      &::before {
        bottom: 9px;
        left: 0;
        transition: transform 0.125s cubic-bezier(0.6, 0.04, 0.98, 0.335),
          top 0.05s 0.125s linear, left 0.125s 0.175s ease-in;
      }

      &::after {
        top: 9px;
        right: 0;
        transition: transform 0.125s cubic-bezier(0.6, 0.04, 0.98, 0.335),
          top 0.05s 0.125s linear, right 0.125s 0.175s ease-in;
      }

      &.active {
        background-color: transparent;
      }

      &.active::before {
        left: -80px;
        top: -80px;
        transform: translate3d(80px, 80px, 0) rotate(45deg);
        transition: left 0.125s ease-out, top 0.05s 0.125s linear,
          transform 0.125s 0.175s cubic-bezier(0.075, 0.82, 0.165, 1);
      }

      &.active::after {
        right: -80px;
        top: -80px;
        transform: translate3d(-80px, 80px, 0) rotate(-45deg);
        transition: right 0.125s ease-out, top 0.05s 0.125s linear,
          transform 0.125s 0.175s cubic-bezier(0.075, 0.82, 0.165, 1);
      }
    }
  }

  .navigation__head {
    display: flex;
    flex-direction: column;
    height: 72px;
    justify-content: center;

    .navigation__events {
      height: $spacer;
      font-size: 12px;
      align-self: flex-end;
    }
    .head__logo {
      align-self: center;
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
    padding: $spacer 16px;
    display: grid;
    grid-template-columns: 20px 1fr 20px;
    grid-template-rows: 20px 1fr;

    .drawer__logo {
      grid-column: 2/3;
      justify-self: center;
      animation: reveal 0.6s ease 0.2s 1 forwards;
      opacity: 0;
    }

    .drawer__links {
      text-align: center;
      align-self: center;
      grid-row: 2/3;
      grid-column: 2/3;
      animation: reveal 0.6s ease 0.2s 1 forwards;
      opacity: 0;

      li {
        .link {
          display: block;
          padding: 26px 0;
        }

        &.drawer__some {
          margin-top: 26px;
          text-align: center;

          a {
            padding: 0 8px;
          }
        }
      }
    }

    @keyframes reveal {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }
}

.navigation--desktop {
  display: none;

  .desktop__links {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
  }
  .desktop__some {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  @include screen-is(md) {
    display: grid;
    grid-template-columns: 1fr 685px 1fr 148px 70px;
    gap: 68px;
    grid-template-rows: 36px;

    .desktop__links {
      grid-column: 2/3;
    }
    .desktop__events {
      grid-column: 4/5;
    }
    .desktop__some {
      grid-column: 5/6;
    }
  }
  @include screen-is(lg) {
    grid-template-columns: 70px 148px 1fr 685px 1fr 148px 70px;

    .desktop__links {
      grid-column: 4/5;
    }
    .desktop__events {
      grid-column: 6/7;
    }
    .desktop__some {
      grid-column: 7/8;
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
