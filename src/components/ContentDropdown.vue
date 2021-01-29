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
      <g-image
        class="trigger__icon"
        :class="{ flipped: expanded }"
        src="~/assets/chevron.svg"
        alt="Chevron icon"
      />
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

    &--borderless {
      padding-top: 1px;
    }

    &--hide-bottom-border {
      border-bottom: none;
    }

    .trigger__icon {
      transform: none;
      transition: 0.2s ease transform;

      &.flipped {
        transform: rotate(180deg);
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

.expand-enter-active,
.expand-leave-active {
  transition: all 0.1s;
}
.expand-enter,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
