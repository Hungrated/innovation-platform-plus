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

<style>
  @import './styles/global.css';
</style>
