<template>
  <main id="global-main" class="layout-container">
    <transition name="fade"><router-view></router-view></transition>
  </main>
</template>

<script>
  import indexMain from '../main/index-main';
  export default {
    name: 'global-main',
    components: {
      indexMain
    }
  }
</script>
