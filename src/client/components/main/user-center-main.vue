<template>
  <div id="user-center-container" class="g-user">
    <div class="g-user left">
      <Card class="m-card" disHover>
          <span slot="title">
            <span class="m-card header">
              <strong>我的计划 & 任务</strong>
              <Button @click="editPlans()" type="text" size="small">新 增</Button>
            </span>
          </span>
        <div class="m-card unit">
          <user-center-plans ref="plans"></user-center-plans>
        </div>
      </Card>
      <Card class="m-card" disHover>
          <span slot="title">
            <span class="m-card header">
              <strong>我的课堂记录</strong>
            </span>
          </span>
        <div class="m-card unit">
          <user-center-meetings ref="meetings"></user-center-meetings>
        </div>
      </Card>
      <Card class="m-card" disHover>
          <span slot="title">
            <span class="m-card header">
              <strong>我的动态</strong>
              <Button @click="changeRoute('/moments')" type="text" size="small">所有动态</Button>
            </span>
          </span>
        <div class="m-card unit">
          <user-center-moments ref="moments"></user-center-moments>
        </div>
      </Card>
    </div>
    <div class="g-user right">
      <Card class="m-card" disHover>
          <span slot="title">
            <span class="m-card header">
              <strong>我的资料</strong>
              <Button @click="editProfile()" type="text" size="small">编 辑</Button>
            </span>
          </span>
        <div class="m-card unit">
          <user-center-profile ref="profile"></user-center-profile>
        </div>
      </Card>
      <Card class="m-card" disHover>
          <span slot="title">
            <span class="m-card header">
              <strong>我的期末</strong>
            </span>
          </span>
        <div class="m-card unit">
          <user-center-final ref="final"></user-center-final>
        </div>
      </Card>
      <!--<Card class="m-card" disHover>-->
      <!--<span slot="title">-->
      <!--<span class="m-card header">-->
      <!--<strong>我的文章</strong>-->
      <!--<Button @click="changeRoute('/articles?label=4')" type="text" size="small">>> 详 情</Button>-->
      <!--</span>-->
      <!--</span>-->
      <!--<div class="m-card unit">-->
      <!--<user-center-articles></user-center-articles>-->
      <!--</div>-->
      <!--</Card>-->
    </div>
  </div>
</template>

<script>
  import userCenterProfile from '../public/user-center-profile';
  import userCenterPlans from '../public/user-center-plans';
  import userCenterMeetings from '../public/user-center-meetings';
  import userCenterArticles from '../public/user-center-articles';
  import userCenterMoments from '../public/user-center-moments';
  import userCenterFinal from '../public/user-center-final';

  export default {
    name: 'user-center-main',
    methods: {
      editPlans () {
        this.$refs.plans.editPlan();
      },
      editProfile () {
        this.$refs.profile.edit();
      },
      changeRoute (path) {
        this.$router.push(path);
      }
    },
    components: {
      userCenterProfile,
      userCenterPlans,
      userCenterMeetings,
      userCenterArticles,
      userCenterMoments,
      userCenterFinal
    }
  };
</script>

<style scoped lang="scss">
  @import '../../styles/user-center';
</style>
