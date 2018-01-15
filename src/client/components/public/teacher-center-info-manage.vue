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
                <Select placeholder="类 别" size="large" v-model="infoType">
                  <Option v-for="type in infoTypeList" :value="type.value" :key="type.index">
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
        infoType: '文 章',
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
          }
        ],
        infoRange: ['', ''],
        infoSid: '',
        queryCols: {
          blog: [
            {
              title: '标 识',
              key: 'blog_id',
              width: 150
            },
            {
              title: '发表时间',
              width: 200,
              key: 'created_at',
              sortable: true,
              render: (h, params) => {
                return h('span', this.getTime(params.row.created_at));
              }
            },
            {
              title: '作者标识',
              key: 'author_id'
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
              width: 200,
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
                      }
                    }
                  }, '删 除')
                ]);
              }
            }
          ],
          plan: [
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
          meeting: []
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
      infoQuery (type, start, end, sid) {
        let _this = this;
        let queryString = '/api/teacher/query?type=' + type;
        if (sid) {
          queryString = queryString + '&sid=' + sid;
        } else if (start !== '' && end !== '') {
          queryString = queryString + '&start=' + start + '&end=' + end;
        }
        this.$ajax.get(queryString)
          .then(function (res) {
            _this.infoData = res.data;
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      refreshData () {
        this.infoQuery('blog', '', '', this.infoSid);
      }
    },
    mounted () {
      this.infoCols = this.queryCols.blog;
      this.refreshData();
    }
  };
</script>

<style>
  @import '../../styles/teacher-center-info-manage.css';
</style>
