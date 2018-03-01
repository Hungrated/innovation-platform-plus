<template>
  <div id="index">
    <index-main-banner/>
    <div class="g-extras">
      <moments-main :limit="5" :nav="false"/>
    </div>
  </div>
</template>

<script>
  import indexMainBanner from '../public/index-main-banner';
  import momentsMain from './moments-main';

  export default {
    name: 'index-main',
    components: {
      indexMainBanner,
      momentsMain
    }
  };
</script>

<style scoped lang="scss">
  @import '../../styles/index';
</style>
