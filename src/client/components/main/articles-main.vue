<template>
  <div id="articles" class="articles-main">
    <div class="articles-main-header">
      <Card class="articles-main-header-card" disHover>
        <div class="articles-main-header-container">
          <strong>文 章</strong>
          <Dropdown style="margin-left: 10px; height: 100%">
            <Button type="primary" v-model="articleListLabel">
              {{articleListLabel}}&nbsp;
              <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem v-for="type in labelList"
                            :value="type.label"
                            :key="type.index">
                <span @click="changeLabel(type)">{{type.label}}</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Card>
    </div>
    <div class="articles-main-body">
      <article-list :articleList="articleList"></article-list>
    </div>
    <div class="articles-main-footer">
      <Card class="articles-main-footer-card" disHover>
        <div class="articles-main-footer-container">

        </div>
      </Card>
    </div>
  </div>

</template>

<script>
  import articleList from '../public/articles-article-list';

  export default {
    name: 'articles-main',
    data () {
      return {
        articleListLabel: '所有文章',
        labelList: [
          {
            index: 0,
            label: '所有文章'
          },
          {
            index: 1,
            label: '项目成果'
          },
          {
            index: 2,
            label: '技术交流'
          },
          {
            index: 3,
            label: '活 动'
          },
          {
            index: 4,
            label: '我的文章'
          }
        ],
        editor: {
          title: '',
          label: '',
          description: ''
        },
        articleList: []
      };
    },
    methods: {
      changeRoute (path) {
        this.$router.push(path);
      },
      changeLabel (type) {
        this.changeRoute('/articles?label=' + type.index);
        this.articleListLabel = type.label;
      }
    },
    components: {
      articleList
    },
    mounted () {
      let _this = this;
      this.$ajax.post('/api/blog/query', {
        request: 'all'
      })
        .then(function (res) {
          _this.articleList = res.data;
          console.log(_this.articleList);
          // _this.refreshArticleList();
        })
        .catch(function (e) {
          console.log(e);
        });
    }
  };
</script>

<style>
  @import '../../styles/articles.css';
</style>
