<template>
  <div class="teacher-center-plans">
    <Card disHover>
      <!--<span slot="title">-->
      <!--<span class="plans-card-header">-->
      <!--<strong>学 生</strong>-->
      <!--<Button @click="" type="text" size="small">导 出</Button>-->
      <!--</span>-->
      <!--</span>-->
      <div class="plans-card-body">
        <div class="plans-card-body-left" v-model="classArr">
          <span class="unit-title">
            <span>班级信息</span>
          </span>
          <span class="plans-class-list">
            <span class="plans-class-unit" v-for="unit in classArr" :key="unit.class_id">
              <strong style="margin-left: 15px;">{{unit.cname}}</strong>
              <Button size="large" type="text" @click="changeClass(unit)">{{unit.class_id}}</Button>
            </span>
          </span>
        </div>
        <div class="plans-card-body-right" v-model="cur_class">
          <span class="unit-title">
            <span>学生信息 - <em>{{cur_class.class_id}}</em></span>
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
            title: '学 号',
            key: 'school_id',
            width: 100,
            sortable: true
          },
          {
            title: '姓 名',
            key: 'name',
            width: 100
          },
          {
            title: '最新计划',
            key: 'school_id'
          },
          {
            title: '最新记录',
            key: 'school_id'
          },
          {
            title: '总 评',
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
              _this.refreshStudentList(_this.cur_class.class_id);
            }
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      refreshStudentList (id) {
        let _this = this;
        this.$ajax.post('/api/profile/query', {
          request: {
            cur_class: id
          }
        })
          .then(function (res) {
            _this.studentArr = res.data;
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      changeClass (unit) {
        this.cur_class = unit;
        this.refreshStudentList(unit.class_id);
      }
    },
    mounted () {
      this.refreshClassList();
    }
  };
</script>

<style>
  @import '../../styles/teacher-center-plans.less';
</style>
