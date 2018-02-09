<template>
  <mavon-editor :value="value" :editable="false" default_open="preview"
                :subfield="false" :toolbarsFlag="false"/>
</template>
<script>
  import 'mavon-editor/dist/css/index.css';

  export default {
    name: 'event-details',
    props: ['value']
  };
</script>
