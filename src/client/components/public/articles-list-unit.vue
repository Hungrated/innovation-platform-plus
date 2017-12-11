<template>
  <Card disHover>
    <span slot="title">
      {{msg}}
      {{msg}}
      {{msg}}
    </span>
  </Card>
</template>

<script>
  export default {
    name: 'articles-list-unit',
    props: ['data'],
    data () {
      return {
        msg: 'list unit'
      };
    }
  };
</script>

<style scoped>

</style>
