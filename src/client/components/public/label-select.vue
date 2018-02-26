<template>
  <div class="m-labels">
    <div class="m-labels info">
      <span>
        <Icon type="information-circled"></Icon>&nbsp;
        请选择至少一个分类标签：
      </span>
    </div>
    <div class="m-labels body">
      labelList
    </div>
  </div>
</template>

<script>
  export default {
    name: 'label-select',
    props: ['type', 'labels'],
    data () {
      return {
        selectList: [],
        labelList: []
      };
    },
    methods: {
      refresh () {

      }
    },
    mounted () {
      // this.refresh();
    }
  };
</script>

<style scoped lang="scss">
  @import '../../styles/label-select';
</style>
