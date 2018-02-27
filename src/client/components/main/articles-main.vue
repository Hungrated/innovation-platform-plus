<template>
  <div class="g-articles">
    <div class="g-articles nav">
      <Menu mode="horizontal" theme="dark">
        <div class="m-nav">
          <MenuItem name="1">
            <span @click="changeRoute('/articles/compose')">
              <Icon type="compose"></Icon>&emsp;发布文章
            </span>
          </MenuItem>
        </div>
      </Menu>
    </div>
    <Card disHover>
      <div class="g-labels">
        <span>
          <span><strong>分 组&nbsp;<Icon type="arrow-right-a"></Icon>&emsp;</strong></span>
          <span class="m-label" v-for="group in groupList" :key="group.index">
            <Button @click="getArticleList()"
                    size="small"
                    type="warning">
              <strong>{{group.label}}</strong>
            </Button>
          </span>
        </span>
        <span>
            <span class="m-label" v-for="label in labelList" :key="label.label_id">
              <Button @click="getArticleList()"
                      size="small"
                      :type="label.category === 'both'
                      ? 'success' : (label.category === 'blog' ? 'primary' : 'warning')">
                <strong>{{label.name}}</strong>
              </Button>
            </span>
            <span><strong>&emsp;<Icon type="arrow-left-a"></Icon>&nbsp;标 签</strong></span>
          </span>
      </div>
      <div class="g-articles header">
        <div class="g-button">
          <Button class="g-button button" type="text" size="large" @click="changeMode('markdown')">
            <div class="g-button button inner">
              <Icon type="social-markdown"></Icon>
              <span>Markdown 文档</span>
            </div>
          </Button>
        </div>
        <div class="g-carousel-container">
          <article-view-carousel :carousel-list="carouselList"/>
        </div>
        <div class="g-button">
          <Button class="g-button button" type="text" size="large" @click="changeMode('event')">
            <div class="g-button button inner">
              <Icon type="flag"></Icon>
              <span>活动图集</span>
            </div>
          </Button>
        </div>
      </div>
      <div class="g-articles body">
        <!--<article-view-list :articleList="articleList" :count="articleCount"/>-->
        <article-view-waterfall :articleList="articleList" :count="articleCount"/>
      </div>
    </Card>
  </div>
</template>

<script>
  import articleViewCarousel from '../public/articles-view-carousel';
  import articleViewList from '../public/articles-view-list';
  import articleViewWaterfall from '../public/articles-view-waterfall';

  export default {
    name: 'articles-main',
    data () {
      return {
        articleCount: 0,
        articleListLabel: '所有文章',
        groupList: [
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
        labelList: [],
        articleList: [],
        carouselList: [
          {
            index: 0,
            blog_id: '',
            labels: null,
            title: '',
            description: '',
            content: '',
            cover: null,
            publishTime: ''
          },
          {
            index: 1,
            blog_id: '',
            labels: null,
            title: '',
            description: '',
            content: '',
            cover: null,
            publishTime: ''
          },
          {
            index: 2,
            blog_id: '',
            labels: null,
            title: '',
            description: '',
            content: '',
            cover: null,
            publishTime: ''
          },
          {
            index: 3,
            blog_id: '',
            labels: null,
            title: '',
            description: '',
            content: '',
            cover: null,
            publishTime: ''
          },
          {
            index: 4,
            blog_id: '',
            labels: null,
            title: '',
            description: '',
            content: '',
            cover: null,
            publishTime: ''
          }
        ]
      };
    },
    methods: {
      changeRoute (path) {
        this.$router.push(path);
      },
      changeMode (mode) {
        if (mode === 'all') {
          this.getArticleList();
        }
        if (mode === 'markdown') {
          this.getArticleList('project');
        }
        if (mode === 'event') {
          this.getArticleList('event');
        }
      },
      changeLabel (type) {
        this.changeRoute('/articles?label=' + type.index);
        this.articleListLabel = type.label;
      },
      getArticleList (mode) {
        let _this = this;
        let request = mode || 'all';
        this.$ajax.post('/api/blog/query', {
          request: request
        })
          .then(function (res) {
            _this.articleList = res.data.articleList;
            _this.articleCount = res.data.articleList.length;
            if (request === 'all') {
              _this.carouselList = res.data.carouselList;
            }
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      getLabelList () {
        let _this = this;
        this.$ajax.post('/api/label/query', {
          type: 'blog'
        })
          .then(function (res) {
            _this.labelList = res.data;
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    },
    components: {
      articleViewCarousel,
      articleViewList,
      articleViewWaterfall
    },
    mounted () {
      this.getArticleList();
      this.getLabelList();
    }
  };
</script>

<style scoped lang="scss">
  @import '../../styles/articles';
</style>
