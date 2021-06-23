<template>
  <nav class="navigation">
    <!-- Phone -->
    <!-- <div class="navigation--phone">
      <div class="navigation__toggle" @click="toggleNav">
        <div class="toggle__icon" :class="{ active: !collapsed }"></div>
      </div>
      <transition name="slide" mode="in-out">
        <div key="head" class="navigation__head" v-if="collapsed">
          <g-link to="/" class="head__logo">
            <g-image src="~/assets/logo.svg" alt="FEUM logo" />
          </g-link>
        </div>
        <div key="drawer" class="navigation__drawer" v-else>
          <g-image
            class="drawer__logo"
            src="~/assets/logo.svg"
            alt="FEUM logo"
          />
          <ol @click="toggleNav" class="drawer__links">
            <li>
              <g-link to="/" class="link">Events</g-link>
            </li>
            <li class="drawer__some">
              <a
                href="https://www.facebook.com/feumdk/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <g-image src="~/assets/facebook.svg" alt="Facebook logo" />
              </a>
              <a
                href="https://www.instagram.com/feum_dk/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <g-image src="~/assets/instagram.svg" alt="Instagram logo" />
              </a>
            </li>
          </ol>
        </div>
      </transition>
    </div> -->
    <!-- Desktop -->
    <div class="navigation__inner">
      <ol class="nav__links">
        <li class="link--back__container">
          <g-link to="https://feum.net" class="link--back">
            <g-image
              src="~/assets/chevron-left.svg"
              alt="Back to the FEUM site"
            />
            <p class="back__text">Back to the FEUM site</p>
          </g-link>
        </li>
        <li>
          <g-image src="~/assets/logo.svg" alt="FEUM logo" />
        </li>
      </ol>
    </div>
  </nav>
</template>

<script>
export default {
  name: "TheNavigation",
};
</script>

<style lang="scss" scoped>
// Phone nav
// .navigation--phone {
//   display: block;

//   @include screen-is(md) {
//     display: none;
//   }

//   .navigation__toggle {
//     position: absolute;
//     overflow: hidden;
//     z-index: 2;
//     top: 17px;
//     height: 21px;
//     width: 26px;
//     padding: 9.5px 7px 9.5px 0;

//     .toggle__icon {
//       position: relative;
//       top: 10px;
//       height: 1px;
//       width: 100%;
//       background-color: $grey-light;
//       transition: background-color 0.125s ease-in 0.175s;

//       &::after,
//       &::before {
//         content: "";
//         height: 1px;
//         display: block;
//         background-color: $grey-light;
//         position: absolute;
//         width: 100%;
//       }

//       &::before {
//         bottom: 9px;
//         left: 0;
//         transition: transform 0.125s cubic-bezier(0.6, 0.04, 0.98, 0.335),
//           top 0.05s 0.125s linear, left 0.125s 0.175s ease-in;
//       }

//       &::after {
//         top: 9px;
//         right: 0;
//         transition: transform 0.125s cubic-bezier(0.6, 0.04, 0.98, 0.335),
//           top 0.05s 0.125s linear, right 0.125s 0.175s ease-in;
//       }

//       &.active {
//         background-color: transparent;
//       }

//       &.active::before {
//         left: -80px;
//         top: -80px;
//         transform: translate3d(80px, 80px, 0) rotate(45deg);
//         transition: left 0.125s ease-out, top 0.05s 0.125s linear,
//           transform 0.125s 0.175s cubic-bezier(0.075, 0.82, 0.165, 1);
//       }

//       &.active::after {
//         right: -80px;
//         top: -80px;
//         transform: translate3d(-80px, 80px, 0) rotate(-45deg);
//         transition: right 0.125s ease-out, top 0.05s 0.125s linear,
//           transform 0.125s 0.175s cubic-bezier(0.075, 0.82, 0.165, 1);
//       }
//     }
//   }

//   .navigation__head {
//     display: flex;
//     flex-direction: column;
//     height: 72px;
//     justify-content: center;

//     .navigation__events {
//       height: $spacer;
//       font-size: 12px;
//       align-self: flex-end;
//     }
//     .head__logo {
//       align-self: center;
//     }
//   }

//   .navigation__drawer {
//     height: calc(100vh - #{$spacer} * 2);
//     position: absolute;
//     z-index: 1;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-color: $background;
//     padding: $spacer 16px;
//     display: grid;
//     grid-template-columns: 20px 1fr 20px;
//     grid-template-rows: 20px 1fr;

//     .drawer__logo {
//       grid-column: 2/3;
//       justify-self: center;
//       animation: reveal 0.6s ease 0.2s 1 forwards;
//       opacity: 0;
//     }

//     .drawer__links {
//       text-align: center;
//       align-self: center;
//       grid-row: 2/3;
//       grid-column: 2/3;
//       animation: reveal 0.6s ease 0.2s 1 forwards;
//       opacity: 0;

//       li {
//         .link {
//           display: block;
//           padding: 26px 0;
//         }

//         &.drawer__some {
//           margin-top: 26px;
//           text-align: center;

//           a {
//             padding: 0 8px;
//           }
//         }
//       }
//     }

//     @keyframes reveal {
//       from {
//         opacity: 0;
//       }
//       to {
//         opacity: 1;
//       }
//     }
//   }
// }

.navigation__inner {
  max-width: $contentWidth;
  margin: 0 auto;

  .nav__links {
    display: grid;
    height: $navHeight;
    justify-items: center;
    align-items: center;
    font-size: 12px;
    grid-template-columns: $navHeight 1fr $navHeight;

    .link--back__container {
      justify-self: baseline;

      .link--back {
        display: flex;
        align-items: center;

        .back__text {
          display: none;
        }
      }
    }

    @include screen-is(md) {
      grid-template-columns: 1fr 1fr 1fr;

      .link--back__container .link--back .back__text {
        display: block;
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
