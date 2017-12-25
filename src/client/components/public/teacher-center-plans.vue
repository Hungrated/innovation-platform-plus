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
            <Table :columns="studentCols" :data="studentArr" style="min-width: 800px" stripe></Table>
          </span>
          <Modal
            v-model="studentDetails"
            title="学生详细信息"
            width="90"
            @on-ok="closeStudentDetails()"
            cancel-text="">
            <div class="plans-student-details-container" v-model="curStudentDetail">
              <div class="student-details-header">
                <p>
                  <Icon type="information-circled"></Icon>&nbsp;
                  基本信息
                </p>
                <Button type="primary" @click="">导出所有信息为Word</Button>
              </div>
              <div class="student-details-body">
                <div class="student-details-profile">

                </div>
                <div class="student-details-plans">
                  <Table :columns="curStudentDetail.plans.cols" :data="curStudentDetail.plans.data" stripe></Table>
                </div>
                <div class="student-details-meetings">
                  <Table :columns="curStudentDetail.meetings.cols" :data="curStudentDetail.meetings.data"
                         stripe></Table>
                </div>
              </div>
            </div>
          </Modal>
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
            width: 140,
            sortable: true
          },
          {
            title: '姓 名',
            key: 'name',
            width: 130
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
            title: '详 情',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.revealStudentDetails(params.row.school_id);
                    }
                  }
                }, '查看与管理')
              ]);
            }
          }
        ],
        studentArr: [],
        studentDetails: false,
        curStudentDetail: {
          profile: {},
          plans: {
            cols: [
              {
                title: '学 年',
                key: 'year',
                width: 120,
                sortable: true
              },
              {
                title: '学 期',
                key: 'term',
                width: 70
              },
              {
                title: '实行日期',
                key: 'start',
                width: 120,
                sortable: true
              },
              {
                title: '截止日期',
                key: 'deadline',
                width: 120,
                sortable: true
              },
              {
                title: '内 容',
                key: 'content'
              },
              {
                title: '状 态',
                key: 'status',
                width: 75,
                render: (h, params) => {
                  return h('div', [
                    h('strong', {
                      style: {
                        color: '#999999'
                      }
                    }, params.row.status)
                  ]);
                }
              },
              {
                title: '操 作',
                key: 'action',
                width: 150,
                align: 'center',
                render: (h, params) => {
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                        }
                      }
                    }, '编 辑')
                  ]);
                }
              }
            ],
            data: []
          },
          meetings: {
            cols: [
              {
                title: '学 年',
                key: 'year',
                width: 120,
                sortable: true
              },
              {
                title: '学 期',
                key: 'term',
                width: 70
              },
              {
                title: '实行日期',
                key: 'start',
                width: 120,
                sortable: true
              },
              {
                title: '截止日期',
                key: 'deadline',
                width: 120,
                sortable: true
              },
              {
                title: '内 容',
                key: 'content'
              },
              {
                title: '状 态',
                key: 'status',
                width: 75,
                render: (h, params) => {
                  return h('div', [
                    h('strong', {
                      style: {
                        color: '#999999'
                      }
                    }, params.row.status)
                  ]);
                }
              },
              {
                title: '操 作',
                key: 'action',
                width: 150,
                align: 'center',
                render: (h, params) => {
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                        }
                      }
                    }, '编 辑')
                  ]);
                }
              }
            ],
            data: []
          }
        }
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
      },
      revealStudentDetails (id) {
        // let _this = this;
        this.studentDetails = true;
        this.$ajax.post('/api/profile/query', {
          request: {
            school_id: id,
            details: true
          }
        })
          .then(function (res) {
            console.log(res.data);
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      closeStudentDetails () {
        this.studentDetails = false;
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
