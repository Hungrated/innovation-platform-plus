<template>
  <mavon-editor :value="value" :editable="false" default_open="preview"
                :subfield="false" :toolbarsFlag="false"/>
</template>
<script>
  import 'mavon-editor/dist/css/index.css';

  export default {
    name: 'markdown-details',
    props: ['value']
  };
</script>

<style scoped lang="scss">
  @import '../../styles/articles-compose-event';
</style>
