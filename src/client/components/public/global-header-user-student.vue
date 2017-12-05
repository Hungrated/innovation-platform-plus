<template>
  <div class="layout-users">
    <Submenu name="7">
      <template slot="title">
        <Icon type="person"></Icon>&nbsp;{{name}}
      </template>
      <MenuGroup title="管 理">
        <MenuItem name="7-1"><span class="login-btn" @click="changeRoute('/user-center')">个人中心</span></MenuItem>
      </MenuGroup>
      <MenuGroup title="用 户">
        <MenuItem name="7-2"><span class="login-btn" @click="logout()">退出登录</span></MenuItem>
      </MenuGroup>
    </Submenu>
  </div>
</template>

<script>
  export default {
    name: 'global-header-user-student',
    props: ['name'],
    data () {
      return {};
    },
    methods: {
      changeRoute: function (path) {
        this.$router.push({path: path});
      },
      logout () {
        let _this = this;
        this.$ajax.post('/api/user/logout', {})
          .then(function (res) {
            _this.$Message.success(res.data.msg);
            delete window.localStorage.user;
            _this.$emit('updateUserStatus');
            _this.$router.push({path: '/index'});
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    }
  };
</script>

