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
                <Input size="large" placeholder="学 号（选填）"/>
              </div>
            </div>
            <div class="options-query">
              <Button @click="" type="primary" size="large">查 询</Button>
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
        infoCols: this.queryCols.blog,
        infoData: [],
        infoTypeList: [
          {
            index: 0,
            value: '文 章'
          },
          {
            index: 1,
            value: '计 划'
          },
          {
            index: 2,
            value: '课堂记录'
          }
        ],
        infoRange: ['', ''],
        queryCols: {
          blog: [
            {
              title: '标 识',
              key: 'blog_id',
              width: 120
            },
            {
              title: '发表时间',
              key: 'pubTime',
              width: 70,
              sortable: true
            },
            {
              title: '描 述',
              key: 'desc',
              width: 120
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
                  }, '查 看'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      disabled: params.row.status === '已通过'
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
                      size: 'small',
                      disabled: params.row.status === '已通过'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.modifyPlan(params.row);
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
    }
  };
</script>

<style>
  @import '../../styles/teacher-center-info-manage.css';
</style>
