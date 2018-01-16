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
                <Input size="large" v-model="infoSid" placeholder="学 号（选填）"/>
              </div>
            </div>
            <div class="options-query">
              <Button @click="refreshData()" type="primary" size="large">查 询</Button>
            </div>
          </div>
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
        infoType: '文 章',
        infoLabel: 'blog',
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
                          content: '确定删除此内容？',
                          onOk () {
                            _this.infoDelete('blog', params.row.blog_id);
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
              width: 200,
              align: 'center',
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
                          content: '确定删除此内容？',
                          onOk () {
                            _this.infoDelete('meeting', params.row.rec_id);
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
                          content: '确定删除此内容？',
                          onOk () {
                            // _this.infoDelete('blog', params.row.blog_id);
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
        }
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
      infoQuery (type, start, end, sid/* , limit, page */) {
        let _this = this;
        let queryString = '/api/teacher/query?type=' + type/* + '&limit=' + limit + '&page=' + page */;
        if (sid) {
          queryString = queryString + '&sid=' + sid;
        } else if (start !== '' && end !== '') {
          queryString = queryString + '&start=' + start + '&end=' + end;
        }
        this.$ajax.get(queryString)
          .then(function (res) {
            switch (type) {
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
            _this.$Message.success(res.data.msg);
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      refreshData () {
        this.infoQuery(this.infoLabel, '', '', this.infoSid/* , this.pageLimit, this.curPage */);
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
