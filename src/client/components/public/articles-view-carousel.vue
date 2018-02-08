<template>
  <carousel-3d class="g-container" v-model="carouselList">
    <slide v-for="item in carouselList" :key="item.blog_id" :index="item.index">
      <span class="g-carousel">
        <span class="g-img">
          <img :src="carouselList[0].cover">
        </span>
        <span class="g-title">
          {{carouselList[0].title}}
        </span>
      </span>
    </slide>
  </carousel-3d>
</template>

<script>
  import { Carousel3d, Slide } from 'vue-carousel-3d';

  export default {
    name: 'article-view-carousel',
    props: ['articleList'],
    components: {
      Carousel3d,
      Slide
    },
    data () {
      return {
        carouselList: [{
          index: 0,
          blog_id: '',
          labels: null,
          title: '',
          description: '',
          content: '',
          cover: null,
          publishTime: ''
        }]
      };
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

