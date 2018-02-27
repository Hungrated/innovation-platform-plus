<template>
  <div class="m-users">
    <Submenu name="8">
      <template slot="title">
        <router-link tag="span" to="/user-center">
          <Icon type="person"></Icon>{{name}}
        </router-link>
      </template>
      <MenuItem name="8-0" @click="changeRoute('/user-center')">
          <span>
            <strong><Icon type="person"></Icon>&emsp;{{name}}</strong>
          </span>
        <br>
        <span>
            <Icon type="card"></Icon>&emsp;{{schoolId}}
          </span>
      </MenuItem>
      <MenuGroup title="管 理">
        <MenuItem name="8-1"><span @click="changeRoute('/user-center')">个人中心</span></MenuItem>
        <MenuItem name="8-2"><span @click="pwdMod = true">修改密码</span></MenuItem>
      </MenuGroup>
      <MenuGroup title="用 户">
        <MenuItem name="8-3"><span @click="logout()">退出登录</span></MenuItem>
      </MenuGroup>
    </Submenu>
    <Modal
      v-model="pwdMod"
      title="修改密码"
      @on-ok="userPwdMod()">
      <div class="m-login">
        <i-input class="m-login input" type="password" v-model="password.currentPwd" placeholder="当前密码">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </i-input>
        <i-input class="m-login input" type="password" v-model="password.newPwd" placeholder="新密码">
          <Icon type="ios-locked" slot="prepend"></Icon>
        </i-input>
        <i-input class="m-login input" type="password" v-model="password.newPwdChk" placeholder="重复新密码">
          <Icon type="ios-locked" slot="prepend"></Icon>
        </i-input>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'global-header-user-student',
    props: ['name', 'schoolId'],
    data () {
      return {
        pwdMod: false,
        password: {
          currentPwd: '',
          newPwd: '',
          newPwdChk: ''
        }
      };
    },
    methods: {
      changeRoute: function (path) {
        this.$router.push(path);
      },
      userPwdMod () {
        if (this.password.currentPwd === '' || this.password.newPwd === '' || this.password.newPwdChk === '') {
          this.$Message.info('请完善相关信息再试');
          return;
        } else if (this.password.newPwd !== this.password.newPwdChk) {
          this.$Message.error('密码修改失败：新密码两次输入不一致');
          return;
        }
        let _this = this;
        this.$ajax.post('/api/user/pwdmod', {
          username: JSON.parse(window.localStorage.user).school_id,
          password: _this.password.currentPwd,
          new_password: _this.password.newPwd
        })
          .then(function (res) {
            _this.$Message.success(res.data.msg);
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      logout () {
        let _this = this;
        this.$ajax.post('/api/user/logout', {})
          .then(function (res) {
            _this.$Message.success(res.data.msg);
            delete window.localStorage.user;
            _this.$emit('updateUserStatus');
            _this.$router.push('/index');
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../styles/header-user";
</style>

