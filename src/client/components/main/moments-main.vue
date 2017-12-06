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
        msg: '动 态'
      };
    }
  };
</script>

<style>
  @import '../../styles/articles.css';
</style>
