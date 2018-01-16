<template>
  <div class="index-banner">
    <div class="index-banner-container">
      <Carousel autoplay :autoplay-speed="3500" v-model="value" loop>
        <div v-for="img in imgList" :key="img.img_id">
          <CarouselItem>
            <div class="index-banner-unit">
              <img :src="img.src">
            </div>
          </CarouselItem>
        </div>
      </Carousel>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index-main-banner',
    data () {
      return {
        value: 0,
        imgList: [
          {img_id: '0', src: require('../../assets/banner_01.jpg')}
        ]
      };
    },
    methods: {
      refreshBannerImgList () {
        let _this = this;
        this.$ajax.get('/api/banner')
          .then(function (res) {
            if (res.data.length) {
              _this.imgList = res.data;
            }
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    },
    mounted () {
      this.refreshBannerImgList();
    }
  };
</script>

