<template>
  <div class="layout-users">
    <Submenu name="8">
      <template slot="title">
        <Icon type="person"></Icon>&nbsp;{{name}}
      </template>
      <MenuGroup title="管 理">
        <MenuItem name="8-1"><span class="login-btn" @click="userMng = true">学生管理</span></MenuItem>
      </MenuGroup>
      <MenuGroup title="用 户">
        <MenuItem name="8-2"><span class="login-btn" @click="logout()">退出登录</span></MenuItem>
      </MenuGroup>
    </Submenu>
  </div>
</template>

<script>
  export default {
    name: 'global-header-user-teacher',
    props: ['name'],
    data () {
      return {
        userMng: false
      };
    },
    methods: {
      logout () {
        let _this = this;
        this.$ajax.post('/api/user/logout', {})
          .then(function (res) {
            _this.$Message.success(res.data.msg);
            delete window.localStorage.user;
            _this.$emit('updateUserStatus');
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    }
  };
</script>

