<template>
  <mavon-editor :value="value" :editable="false" default_open="preview"
                :subfield="false" :toolbarsFlag="false"/>
</template>
<script>
  export default {
    name: 'event-details',
    props: ['value']
  };
</script>
