<template>
  <div class="article-unit-details">
    <Card disHover style="margin-bottom: 20px">
      <div class="article-container">
        <div class="article-container-left">
          <div class="article-header">
            <div class="article-details-title"><strong>{{details.blog.title}}</strong></div>
            <div style="display: flex; justify-content: space-between">
              <span class="article-details-info">
              <Icon type="ios-person-outline"></Icon>&emsp;{{details.blog.profile.name}}&emsp;&emsp;
              <Icon type="ios-clock-outline"></Icon>&emsp;{{details.blog.publishTime}}&emsp;
            </span>
              <Button type="text" size="small" @click="back()">返回文章列表</Button>
            </div>
          </div>
          <div class="article-details-content" v-html="details.blog.content"></div>
        </div>
        <div class="article-container-right">
          <div class="article-relative-list">
            <span class="list-title"><strong>相关阅读</strong></span>
            <span>
              list1
            </span>
          </div>
          <div class="article-recommend-list">
            <span class="list-title"><strong>推荐阅读</strong></span>
            <span>
              list2
            </span>
          </div>
        </div>
      </div>
    </Card>
    <Card disHover>
      <span slot="title">
        <strong>评 论</strong>
      </span>
      <div class="article-footer">footer</div>
    </Card>
  </div>
</template>

<script>
  export default {
    name: 'article-details',
    data () {
      return {
        details: {}
      };
    },
    mounted () {
      let _this = this;
      const query = window.location.href.split('?')[1];
      console.log(query);
      this.$ajax.get('/api/blog/details?' + query)
        .then(function (res) {
          _this.details = res.data;
          if (!res.data) {
            this.$Message.error('无此文章，请浏览其他内容');
          }
          // _this.refreshArticleList();
        })
        .catch(function (e) {
          console.log(e);
        });
    },
    methods: {
      back () {
        // window.history.back();
        this.$router.push('/articles');
      }
    }
  };
</script>

<style>
  @import '../../styles/articles-article-details.css';
</style>
