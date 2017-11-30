<template>
  <main id="global-main" class="layout-container">
    <router-view></router-view>
  </main>
</template>

<script>
  import indexMain from '../main/index-main'

  export default {
    name: 'global-main',
    components: {
      indexMain
    }
  }
</script>
