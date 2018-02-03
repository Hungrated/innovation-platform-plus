<template>
  <div class="g-plans">
    <Card disHover>
      <div class="g-plans body">
        <div class="g-plans left" v-model="classArr">
          <span class="m-unit title">
            <span class="m-unit info">班级课程信息</span>
          </span>
          <span class="m-list-cls">
            <span class="m-unit-cls" v-for="unit in classArr" :key="unit.class_id">
              <strong style="margin-left: 15px;">{{unit.cname}}</strong>
              <Button size="large" type="text" @click="changeClass(unit)">{{unit.class_id}}</Button>
            </span>
          </span>
        </div>
        <div class="g-plans right" v-model="cur_class">
          <span class="m-unit title">
            <span class="m-unit info">学生信息： <strong>{{cur_class.class_id}}</strong></span>
            <span class="m-unit btn">
              <span class="m-unit export" v-if="displayMode === 'total'">
                <Button size="small" type="success" @click="exportFinal(cur_class.class_id)">导出期末成绩表</Button>
              </span>
              <ButtonGroup shape="circle">
                <Button :type="(displayMode === 'plans') ? ('primary') : ('ghost')"
                        @click="changeDisplayMode('plans')"
                        size="small">
                  &nbsp;<Icon type="clipboard"></Icon>&nbsp;计 划
                </Button>
                <Button :type="(displayMode === 'total') ? ('primary') : ('ghost')"
                        @click="changeDisplayMode('total')"
                        size="small">
                  <Icon type="edit"></Icon>&nbsp;总 评&nbsp;
                </Button>
              </ButtonGroup>
            </span>
          </span>
          <span class="m-list-stu">
            <Table :columns="studentCols" :data="studentArr" style="min-width: 800px" stripe></Table>
          </span>
          <Modal
            v-model="studentDetails"
            title="学生详细信息"
            width="90"
            @on-ok="closeStudentDetails()"
            cancel-text="">
            <div class="m-stu" v-model="curStudentDetails">
              <div class="m-stu subtitle">
                <p>
                  <Icon type="information-circled"></Icon>&nbsp;&nbsp;基本信息
                </p>
                <Button type="success"
                        size="small"
                        @click="exportPlan(curStudentDetails.profile.school_id)">
                  导出所有信息为Word
                </Button>
              </div>
              <div class="m-profile">
                <div class="m-profile avatar">
                  <img style="width: 100%; border-radius: 5px;" :src="curStudentDetails.profile.avatar">
                </div>
                <div class="m-height m-profile info">
                  <div class="m-profile info info-name">
                    <strong>{{curStudentDetails.profile.name}}</strong>
                    <Icon v-if="curStudentDetails.profile.sex && curStudentDetails.profile.sex === '男'"
                          style="font-size: 20px;color: #999999"
                          type="male"></Icon>
                    <Icon v-if="curStudentDetails.profile.sex && curStudentDetails.profile.sex === '女'"
                          style="font-size: 20px;color: #999999"
                          type="female"></Icon>
                  </div>
                  <div class="m-profile info-block">
                    <span class="m-profile info info-blkunit">
                      <p class="m-profile info">
                        <Icon type="university"></Icon>&emsp;{{curStudentDetails.profile.academy}}
                        {{curStudentDetails.profile.grade}}级 {{curStudentDetails.profile.class_id}}班
                      </p>
                      <p class="m-profile info info-sub">
                        <Icon type="card"></Icon>&emsp;学 号：
                        {{curStudentDetails.profile.school_id}}
                      </p>
                      <p class="m-profile info info-sub">
                        <Icon type="person-stalker"></Icon>&emsp;导 师：
                        {{curStudentDetails.profile.supervisor}}
                      </p>
                    </span>
                    <span class="m-profile info info-blkunit-right">
                      <p class="m-profile info info-sub">
                        <Icon type="ios-body"></Icon>&emsp;生 日：
                        <em v-if="!curStudentDetails.profile.description">未填写</em>
                        {{curStudentDetails.profile.birth_date}}
                      </p>
                      <p class="m-profile info info-sub">
                        <Icon type="ios-telephone"></Icon>&emsp;电 话：
                        <em v-if="!curStudentDetails.profile.description">未填写</em>
                        {{curStudentDetails.profile.phone_num}}
                      </p>
                      <p class="m-profile info info-sub">
                        <Icon type="ios-lightbulb"></Icon>&emsp;简 介：
                        <em v-if="!curStudentDetails.profile.description">未填写</em>
                        {{curStudentDetails.profile.description}}
                      </p>
                    </span>
                  </div>
                </div>
              </div>
              <div class="m-stu subtitle">
                <p>
                  <Icon type="navicon-round"></Icon>&nbsp;&nbsp;计划 & 课堂记录
                </p>
              </div>
              <div class="m-stu plans">
                <Table :columns="curStudentDetails.plans.cols"
                       :data="curStudentDetails.plans.data"
                       style="min-width: 800px"
                       stripe></Table>
              </div>
              <div class="m-stu meetings">
                <Table :columns="curStudentDetails.meetings.cols"
                       :data="curStudentDetails.meetings.data"
                       style="min-width: 800px"
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
        @on-cancel="editCancel()">
        <i-input v-model="classRecData.content" :placeholder="curClassRecProfile.name + '的新课堂记录...'"></i-input>
      </Modal>
      <Modal
        v-model="finalRate"
        width="750px"
        :closable="false"
        @on-ok="submitFinalRate()"
        @on-cancel="editCancel()">
        <span class="m-rate">
          <strong class="m-rate title">评 级：</strong>&emsp;
          <Rate class="m-rate mark" v-model="finalRateData.rate" show-text></Rate>&emsp;
          <span class="m-rate info">
            <Icon type="information-circled"></Icon>&nbsp;
            5星: 优秀&emsp;4星: 良好&emsp;3星: 中等&emsp;2星: 及格&emsp;1星: 不及格
          </span>
        </span>
        <br><br>
        <i-input v-model="finalRateData.remark"
                 :placeholder="curClassRecProfile.name + '的期末评语...  (若留空则自动补填成绩等级)'"></i-input>
      </Modal>
    </Card>
    <iframe id="fileDownloadTmpFrame" style="display: none"></iframe>
  </div>
</template>

<script>
  export default {
    name: 'teacher-center-plans',
    data () {
      return {
        classArr: [],
        cur_class: {},
        displayMode: 'plans',
        studentCols: [],
        studentCols1: [
          {
            title: '学 号',
            key: 'school_id',
            width: 100,
            sortable: true
          },
          {
            title: '姓 名',
            key: 'name',
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
                    padding: '5px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
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
                    params.row.newest_plan.deadline),
                  // h('br'),
                  h('span', params.row.newest_plan.content)
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
                  h('div', {
                    style: {
                      lineHeight: '24px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
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
                    }, params.row.newest_meeting.date),
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
                  h('span', {
                    style: {
                      lineHeight: '24px'
                    }
                  }, '暂 无'),
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
                      this.revealStudentDetails(params.row.school_id, params.row.cur_class);
                    }
                  }
                }, '查看与管理')
              ]);
            }
          }
        ],
        studentCols2: [
          {
            title: '学 号',
            key: 'school_id',
            width: 100,
            sortable: true
          },
          {
            title: '姓 名',
            key: 'name',
            width: 85,
            sortable: true,
            render: (h, params) => {
              return h('strong', params.row.name);
            }
          },
          {
            title: '期末作业',
            width: 100,
            align: 'center',

            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    disabled: !params.row.cswk_src
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.downloadFile(params.row.cswk_src);
                    }
                  }
                }, params.row.cswk_src ? '下 载' : '未 传')
              ]);
            }
          },
          {
            title: '上传时间',
            sortable: true,
            width: 135,
            align: 'center',

            key: 'upload_time',
            render: (h, params) => {
              return h('div', [
                h('span', params.row.cswk_src ? this.now(new Date(params.row.cswk_time)) : '暂 无')
              ]);
            }
          },
          {
            title: '评分与评语',
            sortable: true,
            key: 'rate',
            render: (h, params) => {
              if (params.row.rate || params.row.remark) {
                return h('div', {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '5px'
                  }
                }, [
                  h('div', {
                    style: {
                      lineHeight: '24px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }
                  }, [
                    h('strong', {
                      style: {
                        padding: '1px 5px',
                        borderRadius: '3px',
                        background: '#19be6b',
                        color: '#FFFFFF',
                        marginRight: '5px'
                      }
                    }, params.row.rate ? params.row.rate : 'N'),
                    h('span', params.row.remark)
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
                          this.addFinalRate(params.row);
                        }
                      }
                    }, [
                      h('Icon', {
                        props: {
                          type: 'edit'
                        }
                      }),
                      h('span', ' 编 辑')
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
                  h('span', {
                    style: {
                      lineHeight: '24px'
                    }
                  }, '暂 无'),
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
                          this.addFinalRate(params.row);
                        }
                      }
                    }, [
                      h('Icon', {
                        props: {
                          type: 'edit'
                        }
                      }),
                      h('span', ' 总 评')
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
                width: 125,
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
                        }),
                        h('span', '通 过')
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
        classRec: false,
        finalRateData: {
          cswk_id: '',
          rate: 0,
          remark: ''
        },
        finalRate: false
      };
    },
    methods: {
      changeDisplayMode (mode) {
        this.studentCols = (mode === 'plans') ? this.studentCols1 : this.studentCols2;
        this.displayMode = mode;
      },
      refreshClassList () {
        let _this = this;
        this.studentCols = this.studentCols1;
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
      refreshStudentFinalList (id) {
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
      revealStudentDetails (stuId, clsId) {
        let _this = this;
        this.studentDetails = true;
        this.$ajax.post('/api/profile/query', {
          request: {
            school_id: stuId,
            cur_class: clsId,
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
      updateProfile (profile) {
        this.curClassRecProfile = profile;
      },
      addClassRec (profile) {
        this.updateProfile(profile);
        this.classRecData = {
          date: this.now(new Date()),
          student_id: profile.school_id,
          class_id: profile.cur_class
        };
        this.classRec = true;
      },
      editCancel () {
        this.classRec = false;
        this.finalRate = false;
      },
      submitClassRec () {
        let _this = this;
        this.$ajax.post('/api/meeting/submit', this.classRecData)
          .then(function (res) {
            _this.$Message.success(res.data.msg);
            _this.refreshStudentList(_this.cur_class.class_id);
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      parseRate (rt) {
        switch (rt) {
          case 'A':
            return 5;
          case 'B':
            return 4;
          case 'C':
            return 3;
          case 'D':
            return 2;
          default:
            return 1;
        }
      },
      addFinalRate (profile) {
        this.updateProfile(profile);
        this.finalRateData.cswk_id = profile.cswk_id;
        this.finalRateData.remark = profile.remark;
        this.finalRateData.rate = profile.rate ? this.parseRate(profile.rate) : 5;
        this.finalRate = true;
      },
      submitFinalRate () {
        let _this = this;
        this.$ajax.post('/api/final/rate', this.finalRateData)
          .then(function (res) {
            _this.$Message.success('总评成功');
            _this.finalRateData = {
              cswk_id: '',
              rate: 0,
              remark: ''
            };
            _this.refreshStudentList(_this.cur_class.class_id);
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      downloadFile (url) {
        let a = document.getElementById('fileDownloadTmpFrame');
        a.src = url;
        this.$Message.success('文件下载成功');
      },
      exportPlan (id) {
        let _this = this;
        this.$ajax.post('/api/plan/export', {
          student_id: id
        })
          .then(function (res) {
            _this.downloadFile(res.data.path);
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      exportFinal (id) {
        let _this = this;
        this.$ajax.post('/api/final/export', {
          class_id: id
        })
          .then(function (res) {
            _this.downloadFile(res.data.path);
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

<style scoped lang="scss">
  @import '../../styles/teacher-center-plans';
</style>
