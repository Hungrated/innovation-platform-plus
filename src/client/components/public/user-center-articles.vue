<template>
  <div>
    <p v-if="articleList.length === 0" style="text-align: center">暂无文章哦</p>
    <div v-else class="m-unit" v-for="article in articleList" :key="article.blog_id">
      <span class="m-unit title">
       <Button type="text" size="large" @click="revealDetails(article.blog_id)">
         <strong>{{article.title}}</strong>
       </Button>
      </span>
        <span class="m-unit info">
        <Icon type="ios-clock-outline"></Icon>&nbsp;{{article.publishTime}}&emsp;
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'user-center-articles',
    data () {
      return {
        articleList: []
      };
    },
    methods: {
      getStuArticleList (req) {
        let _this = this;
        this.$ajax.post('/api/blog/query', {
          request: req,
          carousel: false
        })
          .then(function (res) {
            _this.articleList = res.data.articleList;
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      revealDetails (index) {
        this.$router.push('/articles/details?index=' + index);
      }
    },
    mounted () {
      this.getStuArticleList(JSON.parse(window.localStorage.user).school_id);
    }
  };
</script>

<style scoped lang="scss">
  @import "../../styles/user-center-articles";
</style>
