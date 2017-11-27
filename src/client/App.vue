<template>
  <div id="app">
<global-header></global-header>
    <global></global>
    <global-footer></global-footer>
  </div>
</template>

<script>
  import global from './components/global/global';
  import globalHeader from './components/global/global-header';
  import globalFooter from './components/global/global-footer';
  export default {
    name: 'app',
    components: {
      global, globalHeader, globalFooter
    }
  };
</script>

<style>
  * {
    box-sizing: border-box;
    position: relative;
    /*border: 1px solid red;*/
    margin: 0;
    padding: 0;
  }

  html {
    min-height: 100vh;
  }

  body {
    min-height: 100vh;
  }

  #app {
    min-height: 100vh;
    padding-bottom: 360px;
    background: url('./assets/bg.png') repeat-y;
    background-size: 100% auto;
  }
</style>
