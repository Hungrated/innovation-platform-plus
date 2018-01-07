<template>
  <div id="teacher-center-container">
    <div class="teacher-center-nav-container">
      <Menu mode="horizontal" theme="light" active-name="1">
        <div class="teacher-center-nav">
          <MenuItem name="1">
            <span @click="changePanel('main-panel')">
              <Icon type="ios-list"></Icon>&emsp;主览面板
            </span>
          </MenuItem>
          <MenuItem name="2">
            <span @click="changePanel('plans')">
              <Icon type="university"></Icon>&emsp;班级与学生
            </span>
          </MenuItem>
          <!--<MenuItem name="3">-->
          <!--<span @click="changePanel('classes')">-->
          <!--<Icon type="android-chat"></Icon>&emsp;课 堂-->
          <!--</span>-->
          <!--</MenuItem>-->
          <MenuItem name="4">
          <span @click="changePanel('rates')">
          <Icon type="trophy"></Icon>&emsp;总 评
          </span>
          </MenuItem>
          <MenuItem name="5">
            <span @click="changePanel('info-manage')">
              <Icon type="settings"></Icon>&emsp;全站信息管理
            </span>
          </MenuItem>
        </div>
      </Menu>
    </div>
    <div class="teacher-center-main">
      <teacher-center-main-panel v-if="panel === 'main-panel'"></teacher-center-main-panel>
      <teacher-center-plans v-if="panel === 'plans'"></teacher-center-plans>
      <!--<teacher-center-classes v-if="panel === 'classes'"></teacher-center-classes>-->
      <teacher-center-rates v-if="panel === 'rates'"></teacher-center-rates>
      <teacher-center-info-manage v-if="panel === 'info-manage'"></teacher-center-info-manage>
    </div>
  </div>
</template>

<script>
  import teacherCenterMainPanel from '../../components/public/teacher-center-main-panel.vue';
  import teacherCenterPlans from '../../components/public/teacher-center-plans.vue';
  // import teacherCenterClasses from '../../components/public/teacher-center-classes.vue';
  import teacherCenterRates from '../../components/public/teacher-center-rates.vue';
  import teacherCenterInfoManage from '../../components/public/teacher-center-info-manage.vue';

  export default {
    name: 'teacher-center-main',
    data () {
      return {
        panel: 'main-panel'
      };
    },
    methods: {
      changePanel (name) {
        this.panel = name;
      }
    },
    components: {
      teacherCenterMainPanel,
      teacherCenterPlans,
      // teacherCenterClasses,
      teacherCenterRates,
      teacherCenterInfoManage
    }
  };
</script>

<style>
  @import '../../styles/teacher-center.css';
</style>
