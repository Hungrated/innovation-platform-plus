<template>
  <div class="layout-users">
    <Submenu name="6">
      <template slot="title">
        <Icon type="person"></Icon>&nbsp;
      </template>
      <MenuGroup title="管 理">
        <MenuItem name="8-1"><span class="login-btn" @click="userMng = true">学生管理</span></MenuItem>
      </MenuGroup>
    </Submenu>
  </div>
</template>

<script>
  export default {
    name: 'global-header-user-teacher',
    data () {
      return {
        userMng: false,
        signInData: {
          username: '',
          password: ''
        }
      };
    },
    methods: {
      handleSubmit () {
        let _this = this;
        this.$ajax.post('/user/login', this.signInData)
          .then(function (res) {
            _this.$Message.success(res.data.msg);
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    }
  };
</script>

