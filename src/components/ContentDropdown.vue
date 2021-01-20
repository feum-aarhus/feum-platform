<template>
  <div>
    <div class="dropdown__trigger" @click="toggleDropdown">
      <h4>{{ this.title }}</h4>
      <g-image
        class="trigger__icon"
        :class="{ flipped: expanded }"
        src="~/assets/chevron.svg"
        alt="Chevron icon"
      />
    </div>
    <transition name="expand">
      <div
        ref="dropdownContent"
        v-if="expanded"
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
  },
  methods: {
    toggleDropdown() {
      this.expanded = !this.expanded;
      if (this.expanded) {
        this.$nextTick(() => {
          this.$refs.dropdownContent.scrollIntoView({ behavior: "smooth" });
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown__trigger {
  border: $heading 1px solid;
  display: flex;
  justify-content: space-between;
  padding: 12px;

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
  padding: 12px;
  position: relative;
  z-index: -1;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s;
}
.expand-enter,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
