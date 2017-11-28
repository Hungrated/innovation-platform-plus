<template>
  <header id="global-header">
    <Menu mode="horizontal" class="layout-header" :theme="theme">
      <div class="layout-nav">
        <MenuItem name="1">
          <img class="layout-brand" :src="brand.src">
        </MenuItem>
        <MenuItem name="2">
          <Icon type="ios-people"></Icon>
          主 页
        </MenuItem>
        <Submenu name="3">
          <template slot="title">
            <Icon type="stats-bars"></Icon>
            文 章
          </template>
          <MenuGroup title="类别">
            <MenuItem name="3-1">项目成果展示</MenuItem>
            <MenuItem name="3-2">活动展示</MenuItem>
            <MenuItem name="3-3">文章动态</MenuItem>
          </MenuGroup>
          <MenuGroup title="发布">
            <MenuItem name="3-4">文章发布</MenuItem>
          </MenuGroup>
        </Submenu>
        <MenuItem name="4">
          <Icon type="ios-people"></Icon>
          公告栏
        </MenuItem>
        <MenuItem name="5">
          <Icon type="ios-people"></Icon>
          讨论区
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
    }
  }
</script>

