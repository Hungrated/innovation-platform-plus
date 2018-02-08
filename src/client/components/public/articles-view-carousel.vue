<template>
  <carousel-3d class="g-container">
    <slide :index="0">
      <span class="g-carousel" v-if="carouselList.length > 0">
        <span class="g-img">
          <img :src="carouselList[0].cover">
        </span>
        <span class="g-title">
          {{carouselList[0].title}}
        </span>
      </span>
      <span class="g-carousel g-carousel-empty" v-else>
        虚位以待...
      </span>
    </slide>
    <slide :index="1">
      <span class="g-carousel" v-if="carouselList.length > 1">
        <span class="g-img">
          <img :src="carouselList[1].cover">
        </span>
        <span class="g-title">
          {{carouselList[1].title}}
        </span>
      </span>
      <span class="g-carousel g-carousel-empty" v-else>
        虚位以待...
      </span>
    </slide>
    <slide :index="2">
      <span class="g-carousel" v-if="carouselList.length > 2">
        <span class="g-img">
          <img :src="carouselList[2].cover">
        </span>
        <span class="g-title">
          {{carouselList[2].title}}
        </span>
      </span>
      <span class="g-carousel g-carousel-empty" v-else>
        虚位以待...
      </span>
    </slide>
    <slide :index="3">
      <span class="g-carousel" v-if="carouselList.length > 3">
        <span class="g-img">
          <img :src="carouselList[3].cover">
        </span>
        <span class="g-title">
          {{carouselList[3].title}}
        </span>
      </span>
      <span class="g-carousel g-carousel-empty" v-else>
        虚位以待...
      </span>
    </slide>
    <slide :index="4">
      <span class="g-carousel" v-if="carouselList.length > 4">
        <span class="g-img">
          <img :src="carouselList[4].cover">
        </span>
        <span class="g-title">
          {{carouselList[4].title}}
        </span>
      </span>
      <span class="g-carousel g-carousel-empty" v-else>
        虚位以待...
      </span>
    </slide>
  </carousel-3d>
</template>

<script>
  import { Carousel3d, Slide } from 'vue-carousel-3d-modified';

  export default {
    name: 'article-view-carousel',
    props: ['carouselList'],
    components: {
      Carousel3d,
      Slide
    },
    methods: {
      revealDetails (index) {
        this.$router.push('/articles/details?index=' + index);
      }
    },
    mounted () {
    }
  };
</script>

<style scoped lang="scss">
  @import "../../styles/article-carousel";
</style>

