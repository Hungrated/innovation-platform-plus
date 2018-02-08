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
      <article-view-carousel :carousel-list="carouselList"/>
    </div>
    <div class="g-articles body">
      <article-view-list :articleList="articleList" :count="articleCount"/>
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
            // let Carousel = Vue.extend({
            //   template: `<carousel-3d class="g-container">
            //               <slide :index="0">
            //                 <span class="g-carousel">
            //                   <span class="g-img">
            //                     <img :src="carouselList[0].cover">
            //                   </span>
            //                   <span class="g-title">
            //                     {{carouselList[0].title}}
            //                   </span>
            //                 </span>
            //               </slide>
            //               <slide :index="1">
            //                 <span class="g-carousel">
            //                   <span class="g-img">
            //                     <img :src="carouselList[1].cover">
            //                   </span>
            //                   <span class="g-title">
            //                     {{carouselList[1].title}}
            //                   </span>
            //                 </span>
            //               </slide>
            //             </carousel-3d>`
            // });
            // let carousel = new Carousel({
            //   data () {
            //     return {
            //       carouselList: res.data.carouselList
            //     };
            //   }
            // });
            // carousel.$mount('#carousel');
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
