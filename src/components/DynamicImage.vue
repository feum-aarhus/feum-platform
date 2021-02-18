<template>
  <g-image :src="src" :alt="alt" @load="imageLoaded" v-show="loaded" />
</template>

<script>
export default {
  name: "DynamicImage",
  props: {
    src: {
      required: true,
      type: String,
    },
    alt: {
      required: true,
      type: String,
    },
    loaded: {
      required: true,
      default: false,
      type: Boolean,
    },
  },
  methods: {
    imageLoaded() {
      this.$emit("image-loaded", this.src);
    },
  },
};
</script>

<style lang="scss" scoped>
img {
  opacity: 0;
  object-fit: contain;
  max-width: 100%;
  animation: appear 0.5s ease forwards;

  @keyframes appear {
    to {
      opacity: 1;
    }
  }

  @include screen-is(md) {
    flex-grow: 1;
    object-fit: cover;
    height: $imageHeight;
  }
}
</style>
