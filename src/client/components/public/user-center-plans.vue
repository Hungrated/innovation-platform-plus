<template>
  <div id="plan-container" class="plan-container">
    <div class="plan-list">
      <!--<Table :columns="planCols" :data="planData" stripe></Table>-->
    </div>
    <div class="plan-empty" v-if="planEmpty">
      <span><strong>当前暂无计划</strong>&emsp;<Button type="primary" size="large" @click="editPlan()">制定一个新计划</Button></span>
    </div>
    <transition name="fade">
      <div class="plan-edit-container" v-if="planEdit">
        <div class="plan-edit-header">
          <span><strong>编辑计划</strong></span>
          <span>
            <Button type="text" size="small" @click="editPlanCancel()">取 消</Button>
            <Button type="primary" size="small" @click="submitPlan()">保 存</Button>
          </span>
        </div>
        <div class="plan-edit-body">
          <div class="plan-edit-left">
            左栏
            <p class="plan-edit-unit">
              <Icon type="card"></Icon>&emsp;
              {{planUnit}}
            </p>
            <i-input class="plan-edit-input" type="text" placeholder="电话号码">
              <Icon type="ios-telephone-outline" slot="prepend"></Icon>
            </i-input>
          </div>
          <div class="plan-edit-right">
            右栏
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        planEmpty: true,
        planEdit: false,
        planUnit: {},
        planCols: [
          {
            title: 'Name',
            key: 'name',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'person'
                  }
                }),
                h('strong', params.row.name)
              ]);
            }
          },
          {
            title: 'Age',
            key: 'age'
          },
          {
            title: 'Address',
            key: 'address'
          },
          {
            title: 'Action',
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
                      this.show(params.index);
                    }
                  }
                }, 'View')
              ]);
            }
          }
        ],
        planData: [
          {
            name: 'John Brown',
            age: 18,
            address: 'New York No. 1 Lake Park'
          },
          {
            name: 'Jim Green',
            age: 24,
            address: 'London No. 1 Lake Park'
          },
          {
            name: 'Joe Black',
            age: 30,
            address: 'Sydney No. 1 Lake Park'
          },
          {
            name: 'Jon Snow',
            age: 26,
            address: 'Ottawa No. 2 Lake Park'
          }
        ]
      };
    },
    methods: {
      editPlan () {
        this.planEdit = true;
        this.planEmpty = false;
        console.log('editplan');
      },
      editPlanCancel () {
        this.$Message.info('编辑计划取消');
        this.planEdit = false;
        console.log('editplancancel');
      },
      submitPlan () {
        this.planEdit = false;
        console.log('submitplan');
      },
      show (index) {
        this.$Modal.info({
          title: 'User Info',
          content: `Name：${this.planData[index].name}<br>Age：${this.planData[index].age}<br>Address：${this.planData[index].address}`
        });
      }
    }
  };
</script>
