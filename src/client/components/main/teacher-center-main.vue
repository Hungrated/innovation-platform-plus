<template>
  <div id="teacher-center-container">
    <div class="teacher-center-nav-container">
      <Menu mode="horizontal" theme="light" active-name="1">
        <div class="teacher-center-nav">
          <MenuItem name="1" @click="this.$router.push('/teacher-center')">
            <Icon type="ios-list"></Icon>
            主面板
          </MenuItem>
          <MenuItem name="2">
            <span @click="window.location.href = '/teacher-center/plans'">
              <Icon type="ios-bookmarks"></Icon>
              学生计划
            </span>
          </MenuItem>
          <MenuItem name="3" @click="this.$router.push('/teacher-center')">
            <Icon type="android-chat"></Icon>
            课 堂
          </MenuItem>
          <MenuItem name="4" @click="this.$router.push('/teacher-center')">
            <Icon type="trophy"></Icon>
            总 评
          </MenuItem>
          <MenuItem name="5" @click="this.$router.push('/teacher-center')">
            <Icon type="settings"></Icon>
            全站信息管理
          </MenuItem>
        </div>
      </Menu>
    </div>
    <div class="teacher-center-main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'teacher-center-main'
  };
</script>

<style>
  @import '../../styles/teacher-center.css';
</style>
