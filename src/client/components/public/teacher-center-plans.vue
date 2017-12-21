<template>
  <div class="teacher-center-plans">
    <Card disHover>
      <span slot="title">
        <span class="plans-card-header">
          <strong>学生计划</strong>
          <Button @click="" type="text" size="small">导 出</Button>
        </span>
      </span>
      <div class="plans-card-body">
        <div class="plans-card-body-left" v-model="classArr">
          <span class="unit-title">
            <span>班级信息</span>
          </span>
          <span class="plans-class-list">

          </span>

        </div>
        <div class="plans-card-body-right" v-model="cur_class">
          <span class="unit-title">
            <span>学生管理 - <em>{{cur_class.class_id}}</em></span>
          </span>
          <span class="plans-students-list">
                <Table :columns="studentCols" :data="studentArr" stripe></Table>
          </span>

        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  export default {
    name: 'teacher-center-plans',
    data () {
      return {
        classArr: [],
        cur_class: {},
        studentCols: [
          {
            title: 'school_id',
            key: 'school_id'
          }
        ],
        studentArr: []
      };
    },
    methods: {
      refreshClassList () {
        let _this = this;
        this.$ajax.post('/api/class/query', {
          request: JSON.parse(window.localStorage.user).school_id
        })
          .then(function (res) {
            if (res.data.status === 6000) {
              _this.classArr = res.data.classArr;
              _this.cur_class = _this.classArr[0];
            }
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    },
    mounted () {
      this.refreshClassList();
    }
  };
</script>

<style>
  @import '../../styles/teacher-center-plans.css';
</style>
