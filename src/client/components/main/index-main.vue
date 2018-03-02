<template>
  <div id="index">
    <index-main-banner/>
    <div class="g-extras">
      <div class="g-extras left">
        <moments-main :limit="5" :nav="false"/>
        <Button class="g-button g-button-moments"
                type="ghost"
                @click="changeRoute('/moments')">更多动态
        </Button>
      </div>
      <div class="g-extras right">
        <div>
          <Card disHover>
            <articles-list :articleList="articleList"
                           :count="articlesCount"
                           :disableLabels="true"/>
          </Card>
          <Button class="g-button"
                  type="ghost"
                  @click="changeRoute('/articles')">更多文章
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import indexMainBanner from '../public/index-main-banner';
  import momentsMain from './moments-main';
  import articlesList from './../public/articles-view-list';

  export default {
    name: 'index-main',
    components: {
      indexMainBanner,
      momentsMain,
      articlesList
    },
    data () {
      return {
        articleList: [],
        articlesCount: 0
      };
    },
    methods: {
      changeRoute (path) {
        this.$router.push(path);
        window.scrollTo(0, 0);
      },
      getArticleList (mode) {
        let _this = this;
        let request = mode || 'all';
        this.$ajax.post('/api/blog/query', {
          request: request,
          carousel: false,
          limit: 10
        })
          .then(function (res) {
            _this.articleList = res.data.articleList;
            _this.articleCount = res.data.articleList.length;
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    },
    mounted () {
      this.getArticleList();
    }
  };
</script>

<style scoped lang="scss">
  @import '../../styles/index';
</style>
