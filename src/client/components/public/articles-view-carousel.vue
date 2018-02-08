<template>
  <carousel-3d>
    <slide :index="0">
      Slide 1 Content
    </slide>
    <slide :index="1">
      Slide 2 Content
    </slide>
  </carousel-3d>
</template>

<script>
  import { Carousel3d, Slide } from 'vue-carousel-3d';

  export default {
    name: 'article-view-caoursel',
    props: ['articleList', 'count'],
    components: {
      Carousel3d,
      Slide
    },
    methods: {
      revealDetails (index) {
        this.$router.push('/articles/details?index=' + index);
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../styles/article-list";
</style>

