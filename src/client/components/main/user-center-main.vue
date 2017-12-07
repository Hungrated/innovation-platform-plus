<template>
    <div id="user-center-container" class="user-center-main">
      <div class="user-center-left">
        <Card class="user-center-card" disHover>
          <span slot="title">
            <span class="user-center-card-header">
              <strong>我的计划 & 任务</strong>
              <Button @click="editPlans()" type="text" size="small">管 理</Button>
            </span>
          </span>
          <div class="user-center-unit-container">
            <user-center-plans ref="plans"></user-center-plans>
          </div>
        </Card>
        <Card class="user-center-card" disHover>
          <span slot="title">
            <span class="user-center-card-header">
              <strong>我的动态</strong>
              <Button @click="" type="text" size="small">>> 所有动态</Button>
            </span>
          </span>
          <div class="user-center-unit-container">
            <div>我的动态</div>
          </div>
        </Card>
      </div>
      <div class="user-center-right">
        <Card class="user-center-card" disHover>
          <span slot="title">
            <span class="user-center-card-header">
              <strong>我的资料</strong>
              <Button @click="editProfile()" type="text" size="small">编 辑</Button>
            </span>
          </span>
          <div class="user-center-unit-container">
            <user-center-profile ref="profile"></user-center-profile>
          </div>
        </Card>
        <Card class="user-center-card" disHover>
          <span slot="title">
            <span class="user-center-card-header">
              <strong>我的文章</strong>
              <Button @click="" type="text" size="small">>> 详 情</Button>
            </span>
          </span>
          <div class="user-center-unit-container">
            <user-center-articles></user-center-articles>
          </div>
        </Card>
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
    methods: {
      editPlans () {
        this.$refs.plans.editPlan();
      },
      editProfile () {
        this.$refs.profile.edit();
      }
    },
    components: {
      userCenterProfile, userCenterPlans, userCenterArticles
    }
  };
</script>

<style>
  @import '../../styles/user-center.css';
</style>
