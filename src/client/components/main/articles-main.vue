<template>
  <div id="articles" class="g-articles">
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
    <div class="g-articles header">
      <article-view-carousel :articleList="articleList" :count="articleCount"/>

      <!--<Card class="m-card" disHover>-->
        <!--<div class="m-card container">-->
          <!--<strong>文 章</strong>-->
          <!--<Dropdown class="m-card container type">-->
            <!--<Button type="primary" v-model="articleListLabel">-->
              <!--{{articleListLabel}}&nbsp;-->
              <!--<Icon type="arrow-down-b"></Icon>-->
            <!--</Button>-->
            <!--<DropdownMenu slot="list">-->
              <!--<DropdownItem v-for="type in labelList"-->
                            <!--:value="type.label"-->
                            <!--:key="type.index">-->
                <!--<span @click="changeLabel(type)">{{type.label}}</span>-->
              <!--</DropdownItem>-->
            <!--</DropdownMenu>-->
          <!--</Dropdown>-->
        <!--</div>-->
      <!--</Card>-->

    </div>
    <div class="g-articles body">
      <!--<article-view-list :articleList="articleList" :count="articleCount"/>-->
      <article-view-waterfall :articleList="articleList" :count="articleCount"/>
    </div>
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
        articleList: [],
        carouselList: []
      };
    },
    methods: {
      changeRoute (path) {
        this.$router.push(path);
      },
      changeLabel (type) {
        this.changeRoute('/articles?label=' + type.index);
        this.articleListLabel = type.label;
      },
      getArticleList () {
        let _this = this;
        this.$ajax.post('/api/blog/query', {
          request: 'all'
        })
          .then(function (res) {
            _this.articleList = res.data.articleList;
            _this.articleCount = res.data.articleList.length;
            _this.carouselList = res.data.carouselList;
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
