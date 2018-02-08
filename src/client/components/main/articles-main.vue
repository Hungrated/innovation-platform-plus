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
      <carousel-3d class="g-container">
        <slide :index="0">
          <span class="g-carousel" v-if="!!carouselList[0]">
            <span class="g-img">
              <img :src="carouselList[0].cover">
            </span>
            <span class="g-title">
              {{carouselList[0].title}}
            </span>
          </span>
        </slide>
        <slide :index="1">
          <span class="g-carousel" v-if="!!carouselList[1]">
            <span class="g-img">
              <img :src="carouselList[1].cover">
            </span>
            <span class="g-title">
              {{carouselList[1].title}}
            </span>
          </span>
        </slide>
        <slide :index="2">
          <span class="g-carousel" v-if="!!carouselList[2]">
            <span class="g-img">
              <img :src="carouselList[2].cover">
            </span>
            <span class="g-title">
              {{carouselList[2].title}}
            </span>
          </span>
        </slide>
        <slide :index="3">
          <span class="g-carousel" v-if="!!carouselList[3]">
            <span class="g-img">
              <img :src="carouselList[3].cover || ''">
            </span>
            <span class="g-title">
              {{carouselList[3].title || ''}}
            </span>
          </span>
        </slide>
        <slide :index="4">
          <span class="g-carousel" v-if="!!carouselList[4]">
            <span class="g-img">
              <img :src="carouselList[4].cover|| ''">
            </span>
            <span class="g-title">
              {{carouselList[4].title || ''}}
            </span>
          </span>
        </slide>

        <!--<slide v-for="item in carouselList" :key="item.blog_id" :index="item.index" v-model="carouselList">-->
        <!--<span class="g-carousel">-->
        <!--<span class="g-img">-->
        <!--<img :src="carouselList[item.index].cover">-->
        <!--</span>-->
        <!--<span class="g-title">-->
        <!--{{carouselList[item.index].title}}-->
        <!--</span>-->
        <!--</span>-->
        <!--</slide>-->
      </carousel-3d>
      <!--<carousel-3d class="g-container" v-model="carouselList">-->
      <!--<slide :index="0">-->
      <!--<span class="g-carousel">-->
      <!--<span class="g-img">-->
      <!--<img :src="carouselList[0].cover">-->
      <!--</span>-->
      <!--<span class="g-title">-->
      <!--{{carouselList[0].title}}-->
      <!--</span>-->
      <!--</span>-->
      <!--</slide>-->
      <!--<slide :index="1">-->
      <!--<span class="g-carousel">-->
      <!--<span class="g-img">-->
      <!--&lt;!&ndash;<img :src="carouselList[1].cover">&ndash;&gt;-->
      <!--</span>-->
      <!--<span class="g-title">-->
      <!--{{carouselList[1].title}}-->
      <!--</span>-->
      <!--</span>-->
      <!--</slide>-->
      <!--<slide :index="2">-->
      <!--<span class="g-carousel">-->
      <!--<span class="g-img">-->
      <!--&lt;!&ndash;<img :src="carouselList[2].cover">&ndash;&gt;-->
      <!--</span>-->
      <!--<span class="g-title">-->
      <!--{{carouselList[2].title}}-->
      <!--</span>-->
      <!--</span>-->
      <!--</slide>-->
      <!--<slide :index="3" :v-if="!!carouselList[3]">-->
      <!--<span class="g-carousel">-->
      <!--<span class="g-img">-->
      <!--<img :src="carouselList[3].cover">-->
      <!--</span>-->
      <!--<span class="g-title">-->
      <!--{{carouselList[3].title}}-->
      <!--</span>-->
      <!--</span>-->
      <!--</slide>-->
      <!--<slide :index="4" :v-if="!!carouselList[4]">-->
      <!--<span class="g-carousel">-->
      <!--<span class="g-img">-->
      <!--<img :src="carouselList[4].cover">-->
      <!--</span>-->
      <!--<span class="g-title">-->
      <!--{{carouselList[4].title}}-->
      <!--</span>-->
      <!--</span>-->
      <!--</slide>-->
      <!--</carousel-3d>-->
      <!--<carousel-3d v-model="carouselList">-->
      <!--<slide v-for="item in carouselList"-->
      <!--:key="item.blog_id"-->
      <!--:index="item.index">-->
      <!--<div class="g-carousel">-->
      <!--<div class="g-img">-->
      <!--<img :src="item.cover">-->
      <!--</div>-->
      <!--<div class="g-title">-->
      <!--{{item.title}}-->
      <!--</div>-->
      <!--</div>-->
      <!--</slide>-->
      <!--</carousel-3d>-->
      <!--<article-view-carousel ref="carousel" :articleList="articleList"/>-->

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
      <article-view-list :articleList="articleList" :count="articleCount"/>
      <article-view-waterfall :articleList="articleList" :count="articleCount"/>
    </div>
  </div>
</template>

<script>
  import { Carousel3d, Slide } from 'vue-carousel-3d';
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
      },
      getCarouselList (list) {
        let count = 0;
        let carouselList = [];
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          if (count >= 5) {
            break;
          }
          if (item.cover) {
            item.index = count++;
            carouselList.push(item);
          }
        }
        console.log(carouselList);
        return carouselList;
      }
    },
    components: {
      Carousel3d,
      Slide,
      articleViewCarousel,
      articleViewList,
      articleViewWaterfall
    },
    mounted () {
      this.getArticleList();
      console.log(this.carouselList);
    }
  };
</script>

<style scoped lang="scss">
  @import '../../styles/articles';
</style>
