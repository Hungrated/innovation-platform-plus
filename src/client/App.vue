<template>
  <div id="app">
    <global-header></global-header>
    <global-main></global-main>
    <global-footer></global-footer>
  </div>
</template>

<script>
  import globalHeader from './components/global/global-header';
  import globalMain from './components/global/global-main';
  import globalFooter from './components/global/global-footer';

  export default {
    name: 'app',
    components: {
      globalHeader, globalMain, globalFooter
    }
  };
</script>

<style scoped lang="scss">
  @import 'styles/base';

  #app {
    min-height: 100vh;
    background: url('./assets/bg.png') repeat-y;
    background-size: 100% auto;
    min-width: 900px !important;
  }

</style>
