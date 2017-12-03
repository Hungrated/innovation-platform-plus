<template>
  <header id="global-header">
    <Menu mode="horizontal" class="layout-header" :theme="theme">
      <div class="layout-brand">
        <router-link tag="span" to="/index"><img :src="brand.src"></router-link>
      </div>
      <ul class="layout-nav">
        <MenuItem name="1">
          <router-link tag="span" to="/index">
            <Icon type="home"></Icon>
            &nbsp;<strong>主 页</strong>
          </router-link>
        </MenuItem>
        <Submenu name="2">
          <template slot="title">
            <router-link tag="span" to="/articles">
              <Icon type="document-text"></Icon>
              <strong>文 章</strong>
            </router-link>
          </template>
          <MenuGroup title="类 别">
            <MenuItem name="2-1"><span @click="changeRoute('/articles?label=0')">所有文章</span></MenuItem>
            <MenuItem name="2-2"><span @click="changeRoute('/articles?label=1')">项目成果展示</span></MenuItem>
            <MenuItem name="2-3"><span @click="changeRoute('/articles?label=2')">活动展示</span></MenuItem>
            <MenuItem name="2-4"><span @click="changeRoute('/articles?label=3')">技术交流</span></MenuItem>
          </MenuGroup>
          <MenuGroup title="发 布">
            <MenuItem name="2-5"><span @click="changeRoute('/articles/compose')"><Icon
              type="compose"></Icon>&emsp;发 布</span>
            </MenuItem>
          </MenuGroup>
        </Submenu>
        <MenuItem name="3">
          <router-link tag="span" to="/resources">
            <Icon type="folder"></Icon>
            &nbsp;<strong>资源共享</strong>
          </router-link>
        </MenuItem>
        <MenuItem name="4">
          <router-link tag="span" to="/bulletin">
            <Icon type="information-circled"></Icon>
            &nbsp;<strong>公告栏</strong>
          </router-link>
        </MenuItem>
        <MenuItem name="5">
          <router-link tag="span" to="/discussion">
            <Icon type="chatboxes"></Icon>
            &nbsp;<strong>讨论区</strong>
          </router-link>
        </MenuItem>
      </ul>
      <div v-model="userIdentity">
        <global-header-user v-if="userIdentity === 'none'" @updateUserStatus="changeUserStatus()"></global-header-user>
        <global-header-user-student :name="name" v-if="userIdentity === 'student'" @updateUserStatus="changeUserStatus()"></global-header-user-student>
        <global-header-user-teacher v-if="userIdentity === 'teacher'" :name="name" @updateUserStatus="changeUserStatus()"></global-header-user-teacher>
      </div>
    </Menu>
    <BackTop></BackTop>
  </header>

</template>
<script>
  import globalHeaderUser from '../public/global-header-user';
  import globalHeaderUserStudent from '../public/global-header-user-student';
  import globalHeaderUserTeacher from '../public/global-header-user-teacher';

  export default {
    name: 'global-header',
    data () {
      return {
        brand: {
          src: require('../../assets/innovation_practice_brand.png')
        },
        theme: 'dark',
        userIdentity: 'none',
        username: '',
        name: ''
      };
    },
    components: {
      globalHeaderUser, globalHeaderUserStudent, globalHeaderUserTeacher
    },
    methods: {
      getCookie () {
        let cookie = {};
        let cookieArr = document.cookie.split(' ');
        for (let i = 0; i < cookieArr.length; i++) {
          let unit = cookieArr[i].split(';')[0];
          cookie[unit.split('=')[0]] = unit.split('=')[1];
        }
        return cookie;
      },
      changeUserStatus () {
        const cookie = this.getCookie();
        let user = {};
        if (window.localStorage.user) {
          user = JSON.parse(window.localStorage.user);
        }
        if (!cookie.isLogin) {
          this.userIdentity = 'none';
        } else {
          this.userIdentity = cookie.identity;
          this.username = cookie.username;
          this.name = user.name;
        }
      },
      changeRoute: function (path) {
        this.$router.push({path: path});
      }
    },
    mounted () {
      this.changeUserStatus();
    }
  };
</script>
