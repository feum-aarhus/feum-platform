<template>
  <div
    class="dropdown__container"
    :style="{ height: contentHeight + 56 + 'px' }"
  >
    <div
      class="dropdown__trigger"
      :class="{
        'dropdown__trigger--borderless': hideBorderOnClose,
        'dropdown__trigger--hide-bottom-border': hideBorderOnClose && !expanded,
      }"
      @click="toggleDropdown"
    >
      <h4>{{ this.title }}</h4>
      <div class="trigger__icon" :class="{ minus: expanded }"></div>
    </div>
    <transition
      name="expand"
      @after-enter="handleDropdownShift"
      @after-leave="handleDropdownShift"
    >
      <div
        v-show="expanded"
        ref="dropdownContent"
        class="dropdown__content"
        v-html="content"
      ></div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "ContentDropdown",
  data: function () {
    return {
      expanded: false,
      contentHeight: 0,
    };
  },
  props: {
    title: {
      required: true,
      type: String,
    },
    content: {
      required: true,
      type: String,
    },
    hideBorderOnClose: {
      required: false,
      default: false,
      type: Boolean,
    },
  },
  methods: {
    toggleDropdown() {
      this.expanded = !this.expanded;
    },
    handleDropdownShift() {
      this.contentHeight = this.$refs.dropdownContent.offsetHeight;
      if (this.expanded) {
        this.$refs.dropdownContent.scrollIntoView({ behavior: "smooth" });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown__container {
  transition: height 0.2s ease;

  .dropdown__trigger {
    border: $heading 1px solid;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    height: $spacer * 2 - 2px;
    background-color: $background;
    cursor: pointer;
    font-size: 12px;
    line-height: 17px;
    text-transform: uppercase;

    &--borderless {
      padding-top: 1px;
    }

    &--hide-bottom-border {
      border-bottom: none;
    }

    .trigger__icon {
      width: 13px;
      height: 13px;
      position: relative;

      &::after,
      &::before {
        content: "";
        height: 1px;
        width: 100%;
        display: block;
        background: $heading;
        position: absolute;
        bottom: 50%;
      }

      &::after {
        transform: rotate(-90deg);
        transition: 0.1s ease transform;
        left: 0%;
      }

      &.minus::after {
        transform: rotate(0);
      }
    }
  }

  .dropdown__content {
    background-color: $grey;
    padding: 16px;
    position: relative;
    z-index: -1;
  }
}

.expand-enter,
.expand-leave-to {
  opacity: 0;
}
</style>
