<template>
  <div class="m-labels">
    <div class="m-labels info">
      <span>
        <Icon type="information-circled"></Icon>&nbsp;
        请选择至少一个分类标签：
      </span>
    </div>
    <div class="m-labels body" v-model="labelList">
      <span class="m-label" v-for="label in labelList" :key="label.label_id">
        <Button @click="addLabel(label)"
                size="small"
                :type="label.category === 'both' ? 'success' : (label.category === 'blog' ? 'primary' : 'warning')">
          <strong>{{label.name}}</strong>
        </Button>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'label-select',
    props: ['type', 'selectList'],
    data () {
      return {
        labelList: []
      };
    },
    methods: {
      compareLabel (label1, label2) {
        return label1.label_id === label2.label_id;
      },
      addLabel (label) {
        let selectList = this.selectList;
        for (let i = 0; i < selectList.length; i++) {
          if (this.compareLabel(selectList[i], label)) {
            this.$emit('changeLabels', selectList);
            return;
          }
        }
        selectList.push(label);
        this.$emit('changeLabels', this.selectList);
      },
      refresh (type) {
        let _this = this;
        this.$ajax.post('/api/label/query', {
          type: type
        })
          .then(function (res) {
            _this.labelList = res.data;
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    },
    mounted () {
      this.refresh(this.type);
    }
  };
</script>

<style scoped lang="scss">
  @import '../../styles/label-select';
</style>
