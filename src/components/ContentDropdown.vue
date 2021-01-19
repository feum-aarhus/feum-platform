<template>
  <div>
    <div class="dropdown__trigger" @click="toggleDropdown">
      <h4>{{ this.title }}</h4>
      <span>Click me</span>
    </div>
    <transition name="expand">
      <div v-if="expanded" class="dropdown__content">
        {{ this.content }}
      </div>
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
}

.dropdown__content {
  background-color: $grey;
  padding: 12px;
  position: relative;
  z-index: -1;
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
