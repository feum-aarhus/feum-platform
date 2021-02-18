<template>
  <div class="event__gallery">
    <h2>Memories</h2>
    <div class="gallery__container">
      <DynamicImage
        v-for="photo in imageLoop"
        :key="photo.event_photo"
        :src="photo.event_photo"
        :loaded="loadedImages.includes(photo.event_photo)"
        alt="Event Gallery Photo"
        class="gallery__photo"
        @image-loaded="addToLoaded($event)"
      />
    </div>
    <div
      class="gallery__more"
      v-if="showAmount < this.images.length"
      @click="showMoreImages"
    >
      <h2>Load More</h2>
    </div>
  </div>
</template>

<script>
import DynamicImage from "@/components/DynamicImage";

export default {
  name: "ImageGallery",
  components: {
    DynamicImage,
  },
  props: {
    images: {
      required: true,
      type: Array,
    },
  },
  data: function () {
    return {
      showAmount: 4,
      loadedImages: [],
    };
  },
  computed: {
    imageLoop() {
      return this.images.slice(0, this.showAmount);
    },
  },
  methods: {
    showMoreImages() {
      this.showAmount = this.showAmount + 4;
    },
    addToLoaded(imageSrc) {
      this.loadedImages.push(imageSrc);
    },
  },
};
</script>

<style lang="scss" scoped>
.event__gallery {
  text-align: center;

  .gallery__container {
    margin: 16px 0px;
    display: flex;
    flex-flow: column;

    .gallery__photo:not(:first-child) {
      margin-top: 16px;
    }

    @include screen-is(md) {
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;

      .gallery__photo {
        flex-grow: 1;
        margin: 12px;

        &:not(:first-child) {
          margin: 12px;
        }

        @include screen-is(xl) {
          max-width: calc(50% - 24px);
        }
      }
    }
  }

  .gallery__more {
    cursor: pointer;
  }
}
</style>
