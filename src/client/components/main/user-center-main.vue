<template>
  <div id="user-center-container">
    <div class="user-center-main">
      <div class="user-center-left">
        <Card class="user-center-card" disHover>
          <span slot="title">我的计划 & 任务</span>
          <div class="user-center-unit-container">
            <user-center-plans></user-center-plans>
          </div>
        </Card>
        <Card class="user-center-card" disHover>
          <span slot="title">我的动态</span>
          <div class="user-center-unit-container">
            <div>我的动态</div>
          </div>
        </Card>
      </div>
      <div class="user-center-right">
        <Card class="user-center-card" disHover>
          <span slot="title">我的资料</span>
          <div class="user-center-unit-container">
            <user-center-profile></user-center-profile>
          </div>
        </Card>
        <Card class="user-center-card" disHover>
          <span slot="title">我的文章</span>
          <div class="user-center-unit-container">
            <user-center-articles></user-center-articles>
          </div>
        </Card>
      </div>

    </div>
  </div>

</template>

<script>
  import userCenterProfile from '../public/user-center-profile';
  import userCenterPlans from '../public/user-center-plans';
  import userCenterArticles from '../public/user-center-articles';

  export default {
    name: 'user-center-main',
    data () {
      return {
        msg: '个人中心'
      };
    },
    components: {
      userCenterProfile, userCenterPlans, userCenterArticles
    }
  };
</script>

<style>
  @import '../../styles/user-center.css';
</style>
