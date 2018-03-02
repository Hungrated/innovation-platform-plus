<template>
  <main id="global-main" class="g-container">
    <router-view></router-view>
    <BackTop></BackTop>
  </main>
</template>

<script>
  export default {
    name: 'global-main'
  };
</script>

<style scoped lang="scss">
  @import "../../styles/global-main";
</style>
