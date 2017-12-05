<template>
  <div>
    {{msg}}
  </div>

</template>

<script>
  export default {
    name: 'articles-main',
    data () {
      return {
        msg: '文章'
      };
    }
  };
</script>

<style>
  @import '../../styles/articles.css';
</style>
