<template>
  <div class="teacher-center-plans">
    <Card disHover>
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
            <div class="plans-student-details-container" v-model="curStudentDetails">
              <div class="student-details-subtitle">
                <p>
                  <Icon type="information-circled"></Icon>&nbsp;&nbsp;基本信息
                </p>
                <Button type="primary" @click="">导出所有信息为Word</Button>
              </div>

              <div class="student-details-profile">
                <div class="details-profile-avatar">
                  <img style="width: 100%; border-radius: 5px;" :src="curStudentDetails.profile.avatar">
                </div>
                <div class="details-profile-info">
                  <p class="details-profile-info-unit details-profile-info-name">
                    <strong>{{curStudentDetails.profile.name}}</strong>
                    <Icon v-if="curStudentDetails.profile.sex && curStudentDetails.profile.sex === '男'"
                          style="font-size: 20px;color: #999999"
                          type="male"></Icon>
                    <Icon v-if="curStudentDetails.profile.sex && curStudentDetails.profile.sex === '女'"
                          style="font-size: 20px;color: #999999"
                          type="female"></Icon>
                  </p>
                  <p class="details-profile-info-unit">
                    <Icon type="university"></Icon>&emsp;{{curStudentDetails.profile.academy}}
                    {{curStudentDetails.profile.grade}}级 {{curStudentDetails.profile.class_id}}班
                  </p>
                  <p class="details-profile-info-unit details-profile-info-sub">
                    <Icon type="card"></Icon>&emsp;学 号：
                    {{curStudentDetails.profile.school_id}}
                  </p>
                  <p class="details-profile-info-unit details-profile-info-sub details-profile-info-divided">
                    <Icon type="person-stalker"></Icon>&emsp;导 师：
                    {{curStudentDetails.profile.supervisor}}
                  </p>
                  <p class="details-profile-info-unit details-profile-info-sub">
                    <Icon type="ios-body"></Icon>&emsp;生 日：
                    <em v-if="!curStudentDetails.profile.description">未填写</em>
                    {{curStudentDetails.profile.birth_date}}
                  </p>
                  <p class="details-profile-info-unit details-profile-info-sub">
                    <Icon type="ios-telephone"></Icon>&emsp;电 话：
                    <em v-if="!curStudentDetails.profile.description">未填写</em>
                    {{curStudentDetails.profile.phone_num}}
                  </p>
                  <p class="details-profile-info-unit details-profile-info-sub">
                    <Icon type="ios-lightbulb"></Icon>&emsp;简 介：
                    <em v-if="!curStudentDetails.profile.description">未填写</em>
                    {{curStudentDetails.profile.description}}
                  </p>
                </div>
              </div>
              <div class="student-details-subtitle">
                <p>
                  <Icon type="navicon-round"></Icon>&nbsp;&nbsp;计划 & 课堂记录
                </p>
              </div>
              <div class="student-details-plans">
                <Table :columns="curStudentDetails.plans.cols" :data="curStudentDetails.plans.data" stripe></Table>
              </div>
              <div class="student-details-meetings">
                <Table :columns="curStudentDetails.meetings.cols" :data="curStudentDetails.meetings.data"
                       stripe></Table>
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <Modal
        v-model="classRec"
        width="750px"
        :closable="false"
        @on-ok="submitClassRec()"
        @on-cancel="addClassRecCancel()">
        <i-input v-model="classRecData.content" :placeholder="curClassRecProfile.name + '的新课堂记录...'"></i-input>
      </Modal>
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
            width: 85,
            sortable: true,
            render: (h, params) => {
              return h('strong', params.row.name);
            }
          },
          {
            title: '最新计划',
            render: (h, params) => {
              if (params.row.newest_plan !== null) {
                return h('div', {
                  style: {
                    padding: '5px'
                  }
                }, [
                  h('span', {
                    style: {
                      padding: '1px 5px',
                      borderRadius: '3px',
                      background: '#19be6b',
                      color: '#FFFFFF',
                      marginRight: '5px'
                    }
                  }, params.row.newest_plan.start + ' - ' +
                    params.row.newest_plan.deadline + '  |  ' +
                    params.row.newest_plan.status),
                  h('br'),
                  h('strong', params.row.newest_plan.content)
                ]);
              } else {
                return h('div', {
                  style: {
                    padding: '5px'
                  }
                }, [
                  h('span', '暂 无')
                ]);
              }
            }
          },
          {
            title: '最新课堂记录',
            render: (h, params) => {
              if (params.row.newest_meeting !== null) {
                return h('div', {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '5px'
                  }
                }, [
                  h('span', [
                    h('span', {
                      style: {
                        padding: '1px 5px',
                        borderRadius: '3px',
                        background: '#19be6b',
                        color: '#FFFFFF',
                        marginRight: '5px'
                      }
                    }, params.row.newest_meeting.date),
                    h('br'),
                    h('strong', params.row.newest_meeting.content)
                  ]),
                  h('span', {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      marginLeft: '10px'
                    }
                  }, [
                    h('Button', {
                      props: {
                        type: 'dashed',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.addClassRec(params.row);
                        }
                      }
                    }, [
                      h('Icon', {
                        props: {
                          type: 'edit'
                        }
                      }),
                      h('span', ' 新 增')
                    ])
                  ])
                ]);
              } else {
                return h('div', {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '5px'
                  }
                }, [
                  h('span', '暂 无'),
                  h('span', {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      marginLeft: '10px'
                    }
                  }, [
                    h('Button', {
                      props: {
                        type: 'dashed',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.addClassRec(params.row);
                        }
                      }
                    }, [
                      h('Icon', {
                        props: {
                          type: 'edit'
                        }
                      }),
                      h('span', ' 新 增')
                    ])
                  ])
                ]);
              }
            }
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
        curStudentDetails: {
          profile: {
            avatar: null
          },
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
                title: '审 核',
                key: 'action',
                width: 100,
                render: (h, params) => {
                  if (params.row.status === '未审核') {
                    return h('div', [
                      h('Button', {
                        props: {
                          type: 'success',
                          size: 'small'
                        },
                        style: {
                          marginRight: '5px'
                        },
                        on: {
                          click: () => {
                            this.verifyPlan(params.row.plan_id, 1);
                            params.row.status = '已通过';
                          }
                        }
                      }, [
                        h('Icon', {
                          props: {
                            type: 'checkmark'
                          }
                        })
                      ]),
                      h('Button', {
                        props: {
                          type: 'error',
                          size: 'small'
                        },
                        style: {
                          marginRight: '5px'
                        },
                        on: {
                          click: () => {
                            this.verifyPlan(params.row.plan_id, 0);
                            params.row.status = '未通过';
                          }
                        }
                      }, [
                        h('Icon', {
                          props: {
                            type: 'close'
                          }
                        })
                      ])
                    ]);
                  } else {
                    return h('div', [
                      h('em', {
                        style: {
                          color: '#999999'
                        }
                      }, '已审核')
                    ]);
                  }
                }
              }
            ],
            data: []
          },
          meetings: {
            cols: [
              {
                title: '日 期',
                key: 'date',
                width: 240,
                sortable: true
              },
              {
                title: '内 容',
                key: 'content'
              }
            ],
            data: []
          }
        },
        curClassRecProfile: {},
        classRecData: {
          date: '',
          content: '',
          student_id: null,
          class_id: ''
        },
        classRec: false
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
        let _this = this;
        this.studentDetails = true;
        this.$ajax.post('/api/profile/query', {
          request: {
            school_id: id,
            details: true
          }
        })
          .then(function (res) {
            _this.curStudentDetails.profile = res.data.profile;
            _this.curStudentDetails.plans.data = res.data.plans;
            _this.curStudentDetails.meetings.data = res.data.meetings;
            if (_this.curStudentDetails.profile.avatar === null) {
              _this.curStudentDetails.profile.avatar = require('../../assets/avatar.jpg');
            }
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      closeStudentDetails () {
        this.studentDetails = false;
      },
      verifyPlan (id, op) {
        let _this = this;
        this.$ajax.post('/api/plan/op', {
          plan_id: id,
          op: op
        })
          .then(function (res) {
            _this.$Message.success(res.data.msg);
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      now (time) {
        let curTime = time;
        let convert = function (digit) {
          if (digit < 10) return '0' + digit;
          else return digit.toString();
        };
        let year = curTime.getFullYear();
        let month = convert(curTime.getMonth() + 1);
        let day = convert(curTime.getDate());
        return year + '-' + month + '-' + day;
      },
      addClassRec (profile) {
        this.curClassRecProfile = profile;
        this.classRecData = {
          date: this.now(new Date()),
          student_id: profile.school_id,
          class_id: profile.cur_class
        };
        this.classRec = true;
      },
      addClassRecCancel () {
        this.classRec = false;
      },
      submitClassRec () {
        let _this = this;
        this.$ajax.post('/api/meeting/submit', this.classRecData)
          .then(function (res) {
            _this.$Message.success(res.data.msg);
          })
          .catch(function (e) {
            console.log(e);
          });
        this.refreshStudentList(this.cur_class.class_id);
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
