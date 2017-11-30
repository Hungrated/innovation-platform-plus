<template>
  <div class="layout-users">
    <Submenu name="6">
      <template slot="title">
        <Icon type="person"></Icon>&nbsp;
      </template>
      <MenuGroup title="用户">
        <MenuItem name="6-1"><span class="login-btn" @click="userMng = true">登 录</span></MenuItem>
      </MenuGroup>
    </Submenu>
    <Modal
      v-model="userMng"
      title="用户登录"
      @on-ok="handleSubmit('signInData')">
      <!--用户输入框-->
      <i-input type="text" v-model="signInData.username" placeholder="用户名">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
      </i-input>
      <i-input type="password" v-model="signInData.password" placeholder="密码">
        <Icon type="ios-locked-outline" slot="prepend"></Icon>
      </i-input>
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
        resData: {}
      }
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
  }
</script>

<style scoped>
  .layout-header-user * {
    border: 1px solid red;
  }
</style>
