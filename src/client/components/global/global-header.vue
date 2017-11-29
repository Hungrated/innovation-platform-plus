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
            <MenuItem name="2-5"><span @click="changeRoute('/articles')"><Icon type="compose"></Icon>&emsp;发 布</span></MenuItem>
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
      <global-header-user></global-header-user>
    </Menu>
    <BackTop></BackTop>
  </header>

</template>
<script>
  import globalHeaderUser from '../public/global-header-user';
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
    components: {
      globalHeaderUser
    },
    methods: {
      changeRoute: function (path) {
        this.$router.push({path: path});
      }
    }
  }
</script>

