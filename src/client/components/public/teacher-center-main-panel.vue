<template>
  <div class="teacher-center-main-panel">
    <div class="main-panel-header">
      <div class="main-panel-left">
        <Card disHover>
          <span slot="title">
            <span class="main-panel-card-header">
              <strong>我的班级</strong>
              <Button @click="editPlans()" type="text" size="small">管 理</Button>
            </span>
          </span>
        </Card>
      </div>
      <div class="main-panel-right">
        <Card disHover>
          <span slot="title">
            <span class="main-panel-card-header">
              <strong>我的资料</strong>
              <Button @click="" type="text" size="small">管 理</Button>
            </span>
          </span>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'teacher-center-main-panel',
    data () {
      return {
        classData: []
      };
    },
    methods: {
      refreshData () {
        let _this = this;
        this.$ajax.post('/api/class/query', {
          request: JSON.parse(window.localStorage.user).school_id
        })
          .then(function (res) {
            if (res.data.status === 6000) {
              _this.$Message.success(res.data.msg);
              _this.classData = res.data.classArr;
            } else {
              _this.$Message.info(res.data.msg);
            }
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    },
    mounted () {
      this.refreshData();
    }
  };
</script>

<style>
  @import '../../styles/teacher-center-main-panel.css';
</style>
