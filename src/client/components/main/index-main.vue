<template>
  <div id="index">
    <index-main-banner></index-main-banner>
    <div class="index-extras">
      <moments-main :limit="10"></moments-main>
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

<style>
  @import '../../styles/index.css';
</style>
