<template>
  <div id="index">
    <index-main-banner></index-main-banner>
  </div>
</template>

<script>
  import indexMainBanner from '../public/index-main-banner.vue';

  export default {
    name: 'index-main',
    components: {
      indexMainBanner
    }
  };
</script>

<style>
  @import '../../styles/index.less';

</style>
