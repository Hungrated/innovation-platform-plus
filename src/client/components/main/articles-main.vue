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
            <Button @click="getArticleList({group: group.label})"
                    size="small"
                    type="warning">
              <strong>{{group.label}}</strong>
            </Button>
          </span>
        </span>
        <span>
            <span class="m-label" v-for="label in labelList" :key="label.label_id">
              <Button @click="getArticleList({labels: label.label_id})"
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
        <article-view-list ref="list"
                           v-if="articleListView === 'list'"
                           :articleList="articleList"
                           :labelList="labelList"
                           :count="articleCount"/>
        <article-view-waterfall ref="waterfall"
                                v-if="articleListView === 'waterfall'"
                                :articleList="articleList"
                                :labelList="labelList"
                                :count="articleCount"/>
      </div>
      <div class="g-articles page">
        <Page size="small" :total="articleCount"></Page>
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
        articleListView: 'waterfall',
        articleListLabel: '所有文章',
        groupList: [
          {
            index: 0,
            label: '所有文章',
            value: 'all'
          },
          {
            index: 1,
            label: '项目成果',
            value: 'projects'
          },
          {
            index: 2,
            label: '活 动',
            value: 'events'
          },
          {
            index: 3,
            label: '技术交流',
            value: 'techs'
          },
          {
            index: 4,
            label: '其 他',
            value: 'others'
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
        if (mode === 'markdown') {
          this.getArticleList('project');
          this.articleListView = 'list';
        }
        if (mode === 'event') {
          this.getArticleList('event');
          this.articleListView = 'waterfall';
        }
      },
      changeLabel (type) {
        this.changeRoute('/articles?label=' + type.index);
        this.articleListLabel = type.label;
      },
      getLabel (index) {
        let labelList = this.labelList;
        for (let i = 0; i < labelList.length; i++) {
          if (labelList[i].label_id.toString() === index.toString()) {
            return {
              name: labelList[i].name,
              category: labelList[i].category
            };
          }
        }
        return null;
      },
      parseLabel (labels) {
        let res = [];
        let labelIds = labels.toString().split(',');
        for (let i = 0; i < labelIds.length; i++) {
          let label = this.getLabel(labelIds[i]);
          if (label) {
            res.push(label);
          }
        }
        return res;
      },
      parseLabels () {
        let list = this.articleList;
        for (let i = 0; i < list.length; i++) {
          list[i].labels = this.parseLabel(list[i].labels);
        }
        this.articleList = list;
      },
      getLabelList () {
        let _this = this;
        this.$ajax.post('/api/label/query', {
          type: 'blog'
        })
          .then(function (res) {
            _this.labelList = res.data;
            _this.parseLabels();
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      getArticleList (mode) {
        let _this = this;
        let request = mode || 'all';
        this.$ajax.post('/api/blog/query', {
          request: request,
          carousel: request === 'all'
        })
          .then(function (res) {
            _this.articleList = res.data.articleList;
            _this.articleCount = res.data.articleList.length;
            if (request === 'all') {
              _this.carouselList = res.data.carouselList;
            }
            _this.getLabelList();
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
    }
  };
</script>

<style scoped lang="scss">
  @import '../../styles/articles';
</style>
