<template>
  <footer id="global-footer">
      <Row>
        <i-col span="6">
          <div class="layout-sites">
            <strong class="layout-sites-title">所有服务</strong>
            <h-sites class="sites-col" v-for="site in sites.siteList0" v-bind:site="site" v-bind:key="site.id"></h-sites>
          </div>
        </i-col>
        <i-col span="6">
        <div class="layout-sites">
          <strong class="layout-sites-title">管 理</strong>
          <h-sites class="sites-col" v-for="site in sites.siteList1" v-bind:site="site" v-bind:key="site.id"></h-sites>
        </div>
        </i-col>
        <i-col span="6">
        <div class="layout-sites">
          <strong class="layout-sites-title">技术支持</strong>
          <h-sites class="sites-col" v-for="site in sites.siteList2" v-bind:site="site" v-bind:key="site.id"></h-sites>
        </div>
        </i-col>
        <i-col span="6">
        <div class="layout-sites">
          <strong class="layout-sites-title">其 他</strong>
          <h-sites class="sites-col" v-for="site in sites.siteList2" v-bind:site="site" v-bind:key="site.id"></h-sites>
        </div>
        </i-col>
      </Row>
  </footer>
</template>

<script>
  export default {
    name: 'global-footer',
    data () {
      return {
        sites: {
          siteList0: [
            {id: 0, text: '主 页', href: '../index.html'},
            {id: 1, text: '文章浏览', href: '../articles.html'},
            {id: 2, text: '活动展示', href: '../articles.html'},
            {id: 3, text: '成果展示', href: '../articles.html'},
            {id: 4, text: '公告栏', href: '../index.html'},
            {id: 5, text: '资源共享', href: '../resources.html'},
            {id: 6, text: '讨论区', href: '../discussion.html'}
          ],
          siteList1: [
            {id: 7, text: '教师注册', href: '../index.html'}
          ],
          siteList2: [
            {id: 8, text: '关于创新实践交流平台', href: '../index.html'},
            {id: 9, text: '联系我们（课程对接）', href: '../index.html'}
          ]

        },
        cprt: {
          msg: 'Copyright © 2017 Hungrated, Hangzhou Dianzi University, All rights reserved.'
        }
      }
    },
    components: {
      'h-sites': {
        props: ['site'],
        template: '<span>{{site.text}}</span>'
      }
    }
  }
</script>

<style scoped>
  footer {
    position: absolute;
    bottom: 0;
    height: 360px;
    width: 100%;
    background: #EEEEEE;
    padding: 20px 80px;
    display: flex;
    flex-direction: column;
    user-select: none;
  }

  .layout-sites {
    display: flex;
    flex-direction: column;
  }

  .layout-sites span {
    font-size: 13px;
    padding-bottom: 10px;
    cursor: pointer;
    transition: all 350ms;
  }

  .layout-sites span:hover {
    color: #222222;
  }

  .layout-sites-title {
    font-size: 16px;
    padding: 20px 0;
  }

</style>
