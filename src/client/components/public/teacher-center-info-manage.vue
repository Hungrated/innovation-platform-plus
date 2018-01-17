<template>
  <div class="info-manage-container">
    <div class="info-manage-header">
      <div class="info-manage-options">
        <Card disHover>
          <span slot="title">
            <strong>筛选条件</strong>
          </span>
          <div class="info-manage-options-body">
            <div class="options-list">
              <div class="options-type">
                <Select placeholder="类 别" size="large" v-model="infoLabel">
                  <Option v-for="type in infoTypeList" :value="type.label" :key="type.index">
                    {{ type.value }}
                  </Option>
                </Select>
              </div>
              <div class="options-range">
                <DatePicker v-model="infoRange"
                            size="large"
                            format="yyyy-MM-dd"
                            type="daterange"
                            placeholder="时间范围（选填）"
                            style="width: 100%">
                </DatePicker>
              </div>
              <div class="options-sid">
                <Input size="large" v-model="infoSid" placeholder="学生学号（选填）" :disabled="infoLabel === 'banner' ||
                infoLabel === 'class'"/>
              </div>
            </div>
            <div class="options-query">
              <Button @click="refreshData()" type="primary" size="large">查 询</Button>
            </div>
          </div>
          <transition name="fade">
            <div v-if="infoLabel === 'banner'" class="options-banner">
              <span>
                &emsp;<Icon type="information-circled"></Icon>&nbsp;
                轮播图用于首页展示，要上传新的轮播图，请点击右边的"新增"按钮
              </span>
              <Button @click="bannerEdit()" type="dashed" size="small">新 增</Button>
              <Modal v-model="bannerMng" title="编辑首页轮播图" width="712" @on-ok="bannerSubmit()"
                     @on-cancel="bannerEditCancel()">
                <div class="banner-edit">
                  <croppa v-model="myCroppa"
                          accept="image/*"
                          placeholder="单击以选择图片"
                          :placeholder-font-size="16"
                          :width="640"
                          :height="300"
                          :quality="2">
                  </croppa>
                  <span>
                    &emsp;<Icon type="information-circled"></Icon>&nbsp;
                    点击并拖动鼠标以定位，滚动鼠标滚轮以缩放
                  </span>
                </div>
              </Modal>
            </div>
          </transition>
        </Card>
      </div>
      <div class="info-manage-body">
        <Card disHover>
          <div class="query-table">
            <Table stripe :columns="infoCols" :data="infoData"></Table>
          </div>
          <div class="query-pages">
            <Page size="small"></Page>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'teacher-center-info-manage',
    data () {
      return {
        // pageLimit: 15,
        // curPage: 1,
        dataCount: 0,
        infoLabel: 'banner',
        infoCols: [],
        infoData: [],
        infoTypeList: [
          {
            index: 0,
            value: '文 章',
            label: 'blog'
          },
          {
            index: 1,
            value: '计 划',
            label: 'plan'
          },
          {
            index: 2,
            value: '课堂记录',
            label: 'meeting'
          },
          {
            index: 3,
            value: '资源文件',
            label: 'resource'
          },
          {
            index: 4,
            value: '评 论',
            label: 'comment'
          },
          {
            index: 5,
            value: '班 级',
            label: 'class'
          },
          {
            index: 6,
            value: '首页轮播图',
            label: 'banner'
          }
        ],
        infoRange: ['', ''],
        infoSid: '',
        queryCols: {
          blog: [
            {
              title: '文章ID',
              key: 'blog_id'
            },
            {
              title: '发表时间',
              key: 'created_at',
              sortable: true,
              render: (h, params) => {
                return h('span', this.getTime(params.row.created_at));
              }
            },
            {
              title: '作者ID',
              key: 'author_id',
              sortable: true
            },
            {
              title: '标 题',
              key: 'title'
            },
            {
              title: '描 述',
              key: 'description'
            },
            {
              title: '操 作',
              key: 'action',
              width: 135,
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'ghost',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.showDetails(params.row.content);
                      }
                    }
                  }, '查 看'),
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
                        let _this = this;
                        this.$Modal.confirm({
                          title: '确认删除',
                          content: '确定删除此文章？（此文章下的评论信息也将被删除）',
                          onOk () {
                            _this.infoDelete('blog', params.row.blog_id);
                          }
                        });
                      }
                    }
                  }, '删 除')
                ]);
              }
            }
          ],
          plan: [
            {
              title: '计划ID',
              key: 'plan_id',
              width: 120
            },
            {
              title: '学生ID',
              key: 'student_id',
              width: 120
            },
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
              title: '对应课程编号',
              key: 'class_id'
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
              title: '审核变更',
              width: 125,
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      disabled: params.row.status === '已通过'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        let _this = this;
                        this.$Modal.confirm({
                          title: '确认计划审核变更',
                          content: '确定变更这个计划的审核结果？',
                          onOk () {
                            _this.verifyPlan(params.row.plan_id, 1);
                            params.row.status = '已通过';
                          }
                        });
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
                      size: 'small',
                      disabled: params.row.status === '未通过'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        let _this = this;
                        this.$Modal.confirm({
                          title: '确认计划审核变更',
                          content: '确定变更这个计划的审核结果？',
                          onOk () {
                            _this.verifyPlan(params.row.plan_id, 0);
                            params.row.status = '未通过';
                          }
                        });
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
                // if (params.row.status === '未审核') {
                //
                // } else {
                //   return h('div', [
                //     h('em', {
                //       style: {
                //         color: '#999999'
                //       }
                //     }, '已审核')
                //   ]);
                // }
              }
            }
          ],
          meeting: [
            {
              title: '记录日期',
              key: 'date',
              sortable: true,
              width: 120
            },
            {
              title: '学生ID',
              key: 'student_id',
              sortable: true,
              width: 120
            },
            {
              title: '选课课号',
              key: 'class_id',
              sortable: true
            },
            {
              title: '内 容',
              key: 'content'
            },
            {
              title: '操 作',
              key: 'action',
              width: 135,
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'ghost',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.showDetails(params.row.content);
                      }
                    }
                  }, '查 看'),
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
                        let _this = this;
                        this.$Modal.confirm({
                          title: '确认删除',
                          content: '确定删除此条课堂记录？',
                          onOk () {
                            _this.infoDelete('meeting', params.row.rec_id);
                          }
                        });
                      }
                    }
                  }, '删 除')
                ]);
              }
            }
          ],
          resource: [
            {
              title: '文件ID',
              key: 'file_id'
            },
            {
              title: '上传者ID',
              key: 'uploader_id',
              sortable: true
            },
            {
              title: '上传时间',
              key: 'created_at',
              sortable: true,
              render: (h, params) => {
                return h('span', this.getTime(params.row.created_at));
              }
            },
            {
              title: '文件名',
              key: 'filename'
            },
            {
              title: '文件大小',
              key: 'size',
              sortable: true,
              render: (h, params) => {
                return h('div', params.row.size + ' Bytes');
              }
            },
            {
              title: '文件描述',
              key: 'description'
            },
            {
              title: '操 作',
              key: 'ops',
              width: 80,
              render: (h, params) => {
                return h('div', [
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
                        let _this = this;
                        this.$Modal.confirm({
                          title: '确认删除',
                          content: '确定删除此文件？',
                          onOk () {
                            _this.infoDelete('resource', params.row.file_id);
                            _this.refreshData();
                          }
                        });
                      }
                    }
                  }, '删 除')
                ]);
              }
            }
          ],
          comment: [
            {
              title: '评论ID',
              key: 'comment_id',
              width: 100,
              sortable: true
            },
            {
              title: '评论者ID',
              key: 'student_id',
              sortable: true
            },
            {
              title: '评论时间',
              key: 'created_at',
              sortable: true,
              render: (h, params) => {
                return h('span', this.getTime(params.row.created_at));
              }
            },
            {
              title: '评论内容',
              key: 'content'
            },
            {
              title: '文章ID',
              key: 'blog_id'
            },
            {
              title: '操 作',
              key: 'ops',
              width: 80,
              render: (h, params) => {
                return h('div', [
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
                        let _this = this;
                        this.$Modal.confirm({
                          title: '确认删除',
                          content: '确定删除此条评论？',
                          onOk () {
                            _this.infoDelete('comment', params.row.comment_id);
                            _this.refreshData();
                          }
                        });
                      }
                    }
                  }, '删 除')
                ]);
              }
            }
          ],
          classes: [
            {
              title: '课程ID',
              key: 'class_id'
            },
            {
              title: '课程名称',
              key: 'cname',
              width: 120,
              sortable: true
            },
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
              title: '上课时间',
              key: 'time'
            },
            {
              title: '上课地点',
              key: 'loc'
            },
            {
              title: '状 态',
              key: 'status',
              width: 100
            },
            {
              title: '操 作',
              width: 100,
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: params.row.status === 'active' ? 'error' : 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        let _this = this;
                        this.$Modal.confirm({
                          title: '确认切换课程状态',
                          content: '确定切换此课程的状态？',
                          onOk () {
                            let curStatus = params.row.status;
                            _this.changeClassStatus(params.row.class_id, curStatus);
                            params.row.status = (curStatus === 'archived') ? 'active' : 'archived';
                          }
                        });
                      }
                    }
                  }, '切换状态')
                ]);
              }
            }
          ],
          banner: [
            {
              title: '轮播图ID',
              key: 'img_id',
              width: 120
            },
            {
              title: '图片预览',
              key: 'src',
              align: 'center',
              render: (h, params) => {
                return h('div', {
                  style: {
                    display: 'flex',
                    justifyContent: 'center'
                  }
                }, [
                  h('img', {
                    style: {
                      height: '50px',
                      margin: '5px'
                    },
                    attrs: {
                      src: params.row.src
                    }
                  }),
                  h('Button', {
                    props: {
                      type: 'dashed',
                      size: 'small'
                    },
                    style: {
                      margin: '18px 10px'
                    },
                    on: {
                      click: () => {
                        this.$Modal.info({
                          width: 75,
                          render: (h) => {
                            return h('img', {
                              style: {
                                width: '100%',
                                margin: '5px',
                                borderRadius: '5px'
                              },
                              attrs: {
                                src: params.row.src
                              }
                            });
                          }
                        });
                      }
                    }
                  }, [h('Icon', {
                    props: {
                      type: 'ios-search-strong'
                    }
                  })])
                ]);
              }
            },
            {
              title: '上传者ID',
              key: 'uploader_id'
            },
            {
              title: '上传时间',
              key: 'created_at',
              sortable: true,
              render: (h, params) => {
                return h('span', this.getTime(params.row.created_at));
              }
            },
            {
              title: '状 态',
              key: 'status',
              width: 100
            },
            {
              title: '操 作',
              width: 225,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'dashed',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        // mycroppa
                      }
                    }
                  }, '变更图片'),
                  h('Button', {
                    props: {
                      type: params.row.status === 'active' ? 'error' : 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        let _this = this;
                        this.$Modal.confirm({
                          title: '确认切换状态',
                          content: '确定切换这张首页轮播图的展示状态？',
                          onOk () {
                            let curStatus = params.row.status;
                            _this.changeBannerImgStatus(params.row.img_id, curStatus);
                            params.row.status = (curStatus === 'archived') ? 'active' : 'archived';
                          }
                        });
                      }
                    }
                  }, '切换状态'),
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
                        let _this = this;
                        this.$Modal.confirm({
                          title: '确认删除',
                          content: '确定删除这张首页轮播图？',
                          onOk () {
                            // delete banner img
                            _this.refreshData();
                          }
                        });
                      }
                    }
                  }, '删 除')
                ]);
              }
            }
          ]
        },
        bannerMng: false,
        myCroppa: {}
      };
    },
    methods: {
      getTime (createdAt) {
        let curTime = new Date(createdAt);
        let convert = function (digit) {
          if (digit < 10) return '0' + digit;
          else return digit.toString();
        };
        let year = curTime.getFullYear();
        let month = convert(curTime.getMonth() + 1);
        let day = convert(curTime.getDate());
        return year + '-' + month + '-' + day;
      },
      showDetails (content) {
        this.$Modal.info({
          width: 80,
          render: (h) => {
            return h('div', {
              style: {
                wordWrap: 'break-word'
              }
            }, [
              h('div', '内 容：'),
              h('div', content)
            ]);
          }
        });
      },
      infoQuery (params) {
        let _this = this;
        let queryString = '/api/teacher/query?type=' + params.type/* + '&limit=' + limit + '&page=' + page */;
        if (params.sid) {
          queryString = queryString + '&sid=' + params.sid;
        } else if (params.start !== '' && params.end !== '') {
          queryString = queryString + '&start=' + params.start + '&end=' + params.end;
        }
        this.$ajax.get(queryString)
          .then(function (res) {
            switch (params.type) {
              case 'blog':
                _this.infoCols = _this.queryCols.blog;
                break;
              case 'plan':
                _this.infoCols = _this.queryCols.plan;
                break;
              case 'meeting':
                _this.infoCols = _this.queryCols.meeting;
                break;
              case 'resource':
                _this.infoCols = _this.queryCols.resource;
                break;
              case 'comment':
                _this.infoCols = _this.queryCols.comment;
                break;
              case 'class':
                _this.infoCols = _this.queryCols.classes;
                break;
              case 'banner':
                _this.infoCols = _this.queryCols.banner;
                break;
            }
            _this.infoData = res.data;
            _this.dataCount = res.data.length;
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      infoDelete (type, id) {
        let _this = this;
        this.$ajax.post('/api/teacher/delete', {
          type: type,
          id: id
        })
          .then(function (res) {
            _this.refreshData();
            _this.$Message.success(res.data.msg);
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      refreshData () {
        this.infoQuery({
          type: this.infoLabel,
          start: '',
          end: '',
          sid: this.infoSid
        });
      },
      verifyPlan (id, op) {
        let _this = this;
        this.$ajax.post('/api/plan/op', {
          plan_id: id,
          op: op
        })
          .then(function (res) {
            _this.refreshData();
            _this.$Message.success(res.data.msg);
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      changeClassStatus (id, curStatus) {
        let _this = this;
        this.$ajax.post('/api/class/switch', {
          class_id: id,
          op: curStatus === 'archived' ? 1 : 0
        })
          .then(function (res) {
            _this.$Message.success(res.data.msg);
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      bannerEdit () {
        this.bannerMng = true;
      },
      bannerModify () {
        this.bannerMng = true;
      },
      bannerEditCancel () {
        this.bannerMng = false;
      },
      bannerSubmit () {
        this.myCroppa.generateBlob((blob) => {
          if (blob === null) {
            this.$Message.info('请选择需要上传的头像图片');
            return;
          }
          let _this = this;
          let formData = new FormData();
          formData.append('uploader_id', JSON.parse(window.localStorage.user).school_id);
          formData.append('banner', blob);
          this.$ajax.post('/api/banner/upload', formData)
            .then(function (res) {
              _this.$Message.success(res.data.msg);
              // _this.profile.avatar = '/api/download?avatar=' + _this.profile.school_id + '.jpg&t=' + Math.random();
              _this.myCroppa.remove();
              _this.refreshData();
            })
            .catch(function (e) {
              console.log(e);
            });
        }, 'image/jpeg', 0.8);
      },
      changeBannerImgStatus (id, curStatus) {
        let _this = this;
        this.$ajax.post('/api/banner/switch', {
          img_id: id,
          op: curStatus === 'archived' ? 1 : 0
        })
          .then(function (res) {
            _this.$Message.success(res.data.msg);
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
  @import '../../styles/teacher-center-info-manage.css';
</style>
