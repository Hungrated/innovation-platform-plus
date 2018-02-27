<template>
  <header id="global-header">
    <Menu mode="horizontal" class="g-header" theme="dark">
      <div class="g-header brand">
        <router-link tag="span" to="/index"><img :src="brand.src"></router-link>
      </div>
      <ul class="g-header nav">
        <MenuItem name="1">
          <router-link tag="span" to="/index">
            <Icon type="home"></Icon>
            &nbsp;<span>主 页</span>
          </router-link>
        </MenuItem>
        <MenuItem name="2">
          <router-link tag="span" to="/moments">
            <Icon type="compass"></Icon>
            &nbsp;<span>动 态</span>
          </router-link>
        </MenuItem>
        <Submenu name="3">
          <span slot="title">
            <router-link tag="span" to="/articles">
              <Icon type="document-text"></Icon>
              <span>文 章</span>
            </router-link>
          </span>
          <MenuGroup title="类 别">
            <MenuItem name="3-1"><span @click="changeRoute('/articles')">所有文章</span></MenuItem>
            <MenuItem name="3-2"><span @click="changeRoute('/articles')">Markdown文档</span></MenuItem>
            <MenuItem name="3-3"><span @click="changeRoute('/articles')">活动图集</span></MenuItem>
            <MenuItem name="3-4"><span @click="changeRoute('/articles')">我的文章</span></MenuItem>
          </MenuGroup>
          <MenuGroup title="发 布">
            <MenuItem name="3-5"><span @click="changeRoute('/articles/compose')"><Icon
              type="compose"></Icon>&emsp;发 布</span>
            </MenuItem>
          </MenuGroup>
        </Submenu>
        <MenuItem name="4">
          <router-link tag="span" to="/resources">
            <Icon type="folder"></Icon>
            &nbsp;<span>资源共享</span>
          </router-link>
        </MenuItem>
        <!--<MenuItem name="5">-->
        <!--<router-link tag="span" to="/bulletin">-->
        <!--<Icon type="information-circled"></Icon>-->
        <!--&nbsp;<strong>公告栏</strong>-->
        <!--</router-link>-->
        <!--</MenuItem>-->
        <!--<MenuItem name="6">-->
        <!--<router-link tag="span" to="/discussion">-->
        <!--<Icon type="chatboxes"></Icon>-->
        <!--&nbsp;<strong>讨论区</strong>-->
        <!--</router-link>-->
        <!--</MenuItem>-->
      </ul>
      <div v-model="userIdentity">
        <global-header-user v-if="userIdentity === 'none'"
                            @updateUserStatus="changeUserStatus()"/>
        <global-header-user-student :name="name"
                                    :schoolId="schoolId"
                                    v-if="userIdentity === 'student'"
                                    @updateUserStatus="changeUserStatus()"/>
        <global-header-user-teacher :name="name"
                                    :schoolId="schoolId"
                                    v-if="userIdentity === 'teacher'"
                                    @updateUserStatus="changeUserStatus()">/</global-header-user-teacher>
      </div>
    </Menu>
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
        userIdentity: 'none',
        username: '',
        name: '',
        schoolId: 0
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
          this.schoolId = user.school_id;
        }
      },
      changeRoute: function (path) {
        this.$router.push(path);
      }
    },
    mounted () {
      this.changeUserStatus();
    }
  };
</script>

<style scoped lang="scss">
  @import "../../styles/header";
</style>
