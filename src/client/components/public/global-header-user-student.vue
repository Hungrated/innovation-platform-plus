<template>
  <div class="layout-users">
    <Submenu name="6">
      <template slot="title">
        <Icon type="person"></Icon>&nbsp;
      </template>
      <MenuGroup title="用 户">
        <MenuItem name="7-1"><span class="login-btn" @click="userMng = true">个人资料</span></MenuItem>
        <MenuItem name="7-2"><span class="login-btn" @click="userMng = true">退出登录</span></MenuItem>
      </MenuGroup>
      <MenuGroup title="管 理">
        <MenuItem name="7-3"><span class="login-btn" @click="userMng = true">修改密码</span></MenuItem>
      </MenuGroup>
    </Submenu>
  </div>
</template>

<script>
  export default {
    name: 'global-header-user',
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

    }
  };
</script>

