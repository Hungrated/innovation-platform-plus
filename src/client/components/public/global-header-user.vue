<template>
  <div class="layout-users">
    <Submenu name="7">
      <template slot="title">
        <Icon type="person"></Icon>&nbsp;
      </template>
      <MenuGroup title="用 户">
        <MenuItem name="7-1"><span class="login-btn" @click="userMng = true">登 录</span></MenuItem>
      </MenuGroup>
    </Submenu>
    <Modal
      v-model="userMng"
      title="用户登录"
      @on-ok="handleSubmit()">
      <!--用户输入框-->
      <div class="layout-login">
        <i-input class="layout-login-input" type="text" v-model="signInData.username" placeholder="用户名">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </i-input>
        <i-input class="layout-login-input" type="password" v-model="signInData.password" placeholder="密码">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </i-input>
      </div>
    </Modal>
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
        },
        userIdentity: 'none'
      };
    },
    methods: {
      // checkLogin () {
      //   const cookie = this.getCookie();
      //   if (!cookie.isLogin) {
      //     this.userMng = true;
      //   }
      // },
      handleSubmit () {
        let _this = this;
        this.$ajax.post('/api/user/login', this.signInData)
          .then(function (res) {
            _this.$Message.success(res.data.msg);
            console.log(res.data);
            let user = {};
            user.id = res.data.id;
            user.school_id = res.data.school_id;
            user.name = res.data.name;
            user.cur_class = res.data.cur_class;
            window.localStorage.user = JSON.stringify(user);
            _this.$emit('updateUserStatus');
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    }
  };
</script>
