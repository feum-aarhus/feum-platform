<template>
  <nav class="navigation">
    <!-- Phone -->
    <div class="navigation--phone">
      <transition name="slide" mode="in-out">
        <div key="head" class="navigation__head" v-if="collapsed">
          <div class="navigation__toggle" @click="toggleNav">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <g-link
            class="navigation__events button"
            v-if="$route.fullPath === '/'"
            to="/events"
            >Events</g-link
          >
          <g-image
            v-else
            class="head__logo"
            src="~/assets/logo.svg"
            alt="FEUM logo"
          />
        </div>
        <div key="drawer" class="navigation__drawer" v-else>
          <div class="drawer__close" @click="toggleNav"></div>
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

  .navigation__head {
    display: flex;
    flex-direction: column;
    height: 72px;
    justify-content: center;

    .navigation__toggle {
      position: absolute;

      div {
        height: 1px;
        width: 26px;
        background-color: $grey-light;

        &:not(:last-child) {
          margin-bottom: 6px;
        }
      }
    }
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

    .drawer__close {
      width: 20px;
      height: 20px;
      text-align: center;
      grid-column: 1/2;
      &::before,
      &::after {
        position: absolute;
        content: "";
        height: 20px;
        width: 1px;
        background-color: $grey-light;
      }
      &::before {
        transform: rotate(45deg);
      }
      &::after {
        transform: rotate(-45deg);
      }
    }
    .drawer__logo {
      grid-column: 2/3;
      justify-self: center;
    }

    .drawer__links {
      text-align: center;
      align-self: center;
      grid-row: 2/3;
      grid-column: 2/3;

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
  }
}

.navigation--desktop {
  display: none;

  .desktop__links {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    margin-bottom: $spacer * 2;

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
