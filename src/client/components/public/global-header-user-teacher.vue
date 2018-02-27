<template>
  <div class="m-users">
    <Submenu name="9">
      <template slot="title">
        <router-link tag="span" to="/teacher-center">
          <Icon type="person"></Icon>{{name}}
        </router-link>
      </template>
      <MenuGroup title="档 案">
        <MenuItem name="9-0" @click="changeRoute('/teacher-center')">
          <span>
            <strong><Icon type="person"></Icon>&emsp;{{name}}</strong>
          </span>
          <br>
          <span>
            <Icon type="card"></Icon>&emsp;{{schoolId}}
          </span>
        </MenuItem>
      </MenuGroup>
      <MenuGroup title="管 理">
        <MenuItem name="9-1"><span @click="changeRoute('/teacher-center')">管理中心</span></MenuItem>
        <MenuItem name="9-2"><span @click="pwdMod = true">修改密码</span></MenuItem>
      </MenuGroup>
      <MenuGroup title="API">
        <MenuItem name="9-3"><span @click="revealAPI()">查看API</span></MenuItem>
      </MenuGroup>
      <MenuGroup title="用 户">
        <MenuItem name="9-3"><span @click="logout()">退出登录</span></MenuItem>
      </MenuGroup>
    </Submenu>
    <Modal
      v-model="pwdMod"
      title="修改密码"
      @on-ok="userPwdMod()">
      <!--用户输入框-->
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
    name: 'global-header-user-teacher',
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
      revealAPI () {
        let location = window.location;
        let url = `${location.protocol}//${location.host}/api`;
        console.log(url);
        window.open(url);
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
