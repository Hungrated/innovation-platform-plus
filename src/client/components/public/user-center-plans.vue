<template>
  <div id="plan-container" class="plan-container">
    <transition name="fade">
      <div class="plan-edit-container" v-if="planEdit || planModify">
        <div class="plan-edit-header">
          <span><strong>编辑计划</strong></span>
          <span>
            <Button type="text" size="small" @click="editPlanCancel()">取 消</Button>
            <Button v-if="planEdit === true" type="primary" size="small" @click="submitPlan()">保 存</Button>
            <Button v-if="planModify === true" type="primary" size="small" @click="submitPlan('modify')">修 改</Button>
          </span>
        </div>
        <div class="plan-edit-body">
          <div class="plan-edit-left">
            <div class="plan-edit-unit">
              <Select placeholder="学 期" size="large" v-model="planUnit.term">
                <Option v-for="term in terms" :value="term.label" :key="term.index">
                  {{ term.label }}
                </Option>
              </Select>
            </div>
            <div class="plan-edit-unit">
              <DatePicker v-model="planUnit.range"
                          size="large"
                          format="yyyy-MM-dd"
                          type="daterange"
                          placeholder="计划起止日期"
                          style="width: 100%">
              </DatePicker>
            </div>
          </div>
          <div class="plan-edit-right">
            <div class="plan-edit-unit">
              <i-input class="plan-edit-textarea" type="textarea" v-model="planUnit.content"
                       placeholder="计划内容..."></i-input>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="plan-list" v-if="!planEmpty">
      <Table :columns="planCols" :data="planData" style="min-width: 800px" stripe></Table>
    </div>
    <div class="plan-empty" v-if="planEmpty">
      <span><strong>当前暂无计划</strong>&emsp;<Button type="primary" size="large" @click="editPlan()">制定一个新计划</Button></span>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        planEmpty: true,
        planEdit: false,
        planModify: false,
        planUnit: {
          id: '',
          term: '',
          range: ['', ''],
          content: ''
        },
        terms: [
          {
            index: 0,
            label: '2017-2018-1'
          },
          {
            index: 1,
            label: '2017-2018-2'
          },
          {
            index: 2,
            label: '2018-2019-1'
          },
          {
            index: 3,
            label: '2018-2019-2'
          }
        ],
        planCols: [
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
                      this.modifyPlan(params.row);
                    }
                  }
                }, '编 辑')
              ]);
            }
          }
        ],
        planData: []
      };
    },
    methods: {
      date (time) {
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
      editPlan () {
        this.planEdit = true;
        this.planEmpty = false;
      },
      editPlanCancel () {
        // this.$Message.info('编辑计划取消');
        this.planEdit = false;
      },
      modifyPlan (plan) {
        this.planModify = true;
        this.planUnit = {
          plan_id: plan.plan_id,
          term: plan.year + '-' + plan.term,
          range: [plan.start, plan.deadline],
          content: plan.content
        };
        console.log(plan, this.planUnit);
      },
      submitPlan (op) {
        if (!this.planUnit.term || !this.planUnit.range || !this.planUnit.content) {
          this.$Message.info('请将计划内容填写完整');
          return;
        }
        let _this = this;
        let url = '/api/plan/submit';
        let planData = {
          student_id: JSON.parse(window.localStorage.user).school_id,
          year: this.planUnit.term.split('-')[0] + '-' + this.planUnit.term.split('-')[1],
          term: this.planUnit.term.split('-')[2],
          content: this.planUnit.content,
          start: this.date(this.planUnit.range[0]),
          deadline: this.date(this.planUnit.range[1])
        };
        if (op === 'modify') {
          url = '/api/plan/modify';
          planData.plan_id = this.planUnit.plan_id;
        }
        this.$ajax.post(url, planData)
          .then(function (res) {
            _this.$Message.success(res.data.msg);
            _this.planUnit = {
              plan_id: '',
              term: '',
              range: ['', ''],
              content: ''
            };
            if (op === 'modify') {
              _this.planModify = false;
            } else {
              _this.planEdit = false;
            }
            _this.refreshPlanList();
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      refreshPlanList () {
        let _this = this;
        this.$ajax.post('/api/plan/query', {
          request: JSON.parse(window.localStorage.user).school_id
        })
          .then(function (res) {
            if (res.data.length) {
              _this.planEmpty = false;
            }
            _this.planData = res.data;
          })
          .catch(function (e) {
            console.log(e);
          });
      }

      // show (index) {
      //   this.$Modal.info({
      //     title: 'User Info',
      //     content: `Name：${this.planData[index].name}<br>Age：${this.planData[index].age}<br>Address：${this.planData[index].address}`
      //   });
      // }
    },
    mounted () {
      this.refreshPlanList();
    }
  };
</script>
