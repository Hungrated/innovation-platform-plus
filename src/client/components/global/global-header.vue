<template>
  <header id="global-header">
    <Menu mode="horizontal" class="layout-header" :theme="theme">
      <div class="layout-brand">
        <router-link tag="span" to="/index"><img :src="brand.src"></router-link>
      </div>
      <div class="layout-nav">
        <MenuItem name="1">
          <router-link tag="span" to="/index">
            <Icon type="ios-people"></Icon>
            主 页
          </router-link>
        </MenuItem>
        <Submenu name="2">
          <template slot="title">
            <router-link tag="span" to="/articles">
            <Icon type="ios-people"></Icon>
            文 章
            </router-link>
          </template>
          <MenuGroup title="类 别">
            <MenuItem name="2-1"><span @click="changeRoute('/articles?label=0')">所有文章</span></MenuItem>
            <MenuItem name="2-2"><span @click="changeRoute('/articles?label=0')">项目成果展示</span></MenuItem>
            <MenuItem name="2-3"><span @click="changeRoute('/articles?label=0')">活动展示</span></MenuItem>
            <MenuItem name="2-4"><span @click="changeRoute('/articles?label=0')">技术交流</span></MenuItem>
          </MenuGroup>
          <MenuGroup title="发 布">
            <MenuItem name="2-4"><span @click="changeRoute('/articles/')">发布</span></MenuItem>
          </MenuGroup>
        </Submenu>
        <MenuItem name="3">
          <router-link tag="span" to="/bulletin">
            <Icon type="ios-people"></Icon>
            公告栏
          </router-link>
        </MenuItem>
        <MenuItem name="4">
          <router-link tag="span" to="/discussion">
            <Icon type="ios-people"></Icon>
            讨论区
          </router-link>
        </MenuItem>
        <MenuItem name="5">
          <router-link tag="span" to="/resources">
            <Icon type="ios-people"></Icon>
            资源共享
          </router-link>
        </MenuItem>
      </div>
      <div class="layout-users">
        <Submenu name="6">
          <template slot="title">
            <Icon type="ios-people"></Icon>
            用 户
          </template>
          <MenuGroup title="用户管理">
            <MenuItem name="6-1">登录</MenuItem>
          </MenuGroup>
        </Submenu>
      </div>

    </Menu>

  </header>
</template>
<script>
  export default {
    name: 'global-header',
    data () {
      return {
        brand: {
          src: require('../../assets/innovation_practice_brand.png')
        },
        theme: 'dark'
      }
    },
    methods: {
      changeRoute: function (path) {
        this.$router.push({path: path});
      }
    }
  }
</script>

