<template>
  <div class="g-container">
    <div class="g-container info">
      <span>
        <Icon type="information-circled"></Icon>&nbsp;
        点击图片或右边查看按钮以查看大图
      </span>
      <Button @click="init()" type="success" size="small" icon="ios-search-strong">查 看</Button>
    </div>
    <div class="g-details-event">
      <div v-for="(item, index) in images" :key="item.src" @click="init(index)" class="g-details-event img">
        <transition name="fade">
          <img :src="item.src">
        </transition>
      </div>
    </div>
    <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="pswp__bg"></div>
      <div class="pswp__scroll-wrap">
        <div class="pswp__container">
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
        </div>
        <div class="pswp__ui pswp__ui--hidden">
          <div class="pswp__top-bar">
            <div class="pswp__counter"></div>
            <button class="pswp__button pswp__button--fs" title="全屏"></button>
            <button class="pswp__button pswp__button--zoom" title="缩放"></button>
            <div class="pswp__preloader">
              <div class="pswp__preloader__icn">
                <div class="pswp__preloader__cut">
                  <div class="pswp__preloader__donut"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
            <div class="pswp__share-tooltip"></div>
          </div>
          <button class="pswp__button pswp__button--arrow--left" title="上一张">
          </button>
          <button class="pswp__button pswp__button--arrow--right" title="下一张">
          </button>
          <div class="pswp__caption">
            <div class="pswp__caption__center"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import PhotoSwipe from 'photoswipe';
  import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default';
  import 'photoswipe/dist/photoswipe.css';
  import 'photoswipe/dist/default-skin/default-skin.css';

  export default {
    name: 'event-details',
    props: ['images'],
    methods: {
      formatImgArray () {
        let images = this.images;
        for (let i = 0; i < images.length; i++) {
          images[i].w = 3000;
          images[i].h = 2000;
        }
        return images;
      },
      init (index) {
        let pswpElement = document.querySelectorAll('.pswp')[0];

        let items = this.formatImgArray();
        console.log(this.formatImgArray());

        let options = {
          index: index || 0
        };

        let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUIDefault, items, options);
        gallery.init();
      }
    }
  };
</script>

<style scoped lang="scss">
  @import '../../styles/articles-details-event';
</style>
