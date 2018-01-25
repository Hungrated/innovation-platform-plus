<template>
  <footer id="global-footer" class="g-footer">
    <Row>
      <i-col span="6">
        <div class="g-footer sites">
          <strong class="g-footer sites title">所有服务</strong>
          <router-link class="sites-col" tag="span" v-for="site in sites.siteList0" :key="site.id" :to="site.route">
            {{site.text}}
          </router-link>
        </div>
      </i-col>
      <i-col span="6">
        <div class="g-footer sites">
          <strong class="g-footer sites title">管 理</strong>
          <router-link class="sites-col" tag="span" v-for="site in sites.siteList1" :key="site.id" :to="site.route">
            {{site.text}}
          </router-link>
        </div>
      </i-col>
      <i-col span="6">
        <div class="g-footer sites">
          <strong class="g-footer sites title">支 持</strong>
          <router-link class="sites-col" tag="span" v-for="site in sites.siteList2" :key="site.id" :to="site.route">
            {{site.text}}
          </router-link>
        </div>
      </i-col>
      <i-col span="6">
        <div class="g-footer sites">
          <strong class="g-footer sites title">其 他</strong>
          <router-link class="sites-col" tag="span" v-for="site in sites.siteList3" :key="site.id" :to="site.route">
            {{site.text}}
          </router-link>
        </div>
      </i-col>
    </Row>
    <hr>
    <span class="g-footer cprt">Copyright © 2018 Hungrated, Hangzhou Dianzi University, All rights reserved.</span>
  </footer>
</template>

<script>
  export default {
    name: 'global-footer',
    data () {
      return {
        sites: {
          siteList0: [
            {id: 0, text: '主 页', route: '/index'},
            {id: 1, text: '所有文章', route: '/articles?label=0'},
            {id: 2, text: '项目成果展示', route: '/articles?label=1'},
            {id: 3, text: '活动展示', route: '/articles?label=2'},
            {id: 4, text: '技术交流', route: '/articles?label=3'},
            {id: 5, text: '资源共享', route: '/resources'},
            // {id: 6, text: '公告栏', route: '/bulletin'},
            {id: 7, text: '讨论区', route: '/discussion'}
          ],
          siteList1: [
            {id: 8, text: '教师注册', route: '/index'}
          ],
          siteList2: [
            {id: 9, text: '使用说明', route: '/index'},
            {id: 10, text: '联系我们（课程对接）', route: '/index'}
          ],
          siteList3: [
            {id: 9, text: '关于创新实践课程交流平台', route: '/index'}
          ]

        }
      };
    },
    components: {}
  };
</script>

<style scoped lang="scss">
  @import "../../styles/footer";
</style>
