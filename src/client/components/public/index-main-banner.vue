<template>
  <div class="m-banner">
    <div class="m-banner container">
      <Carousel autoplay :autoplay-speed="3500" v-model="value" loop>
        <div v-for="img in imgList" :key="img.img_id">
          <CarouselItem>
            <div class="m-banner container unit">
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
        imgList: []
      };
    },
    methods: {
      refreshBannerImgList () {
        let _this = this;
        this.$ajax.get('/api/banner')
          .then(function (res) {
            if (res.data.length) {
              let tempList = res.data;
              for (let i = 0; i < tempList.length; i++) {
                tempList[i].src = tempList[i].src + '&t=' + Math.random(); // needs improving
              }
              _this.imgList = tempList;
            } else {
              _this.imgList = [{img_id: '0', src: require('../../assets/banner.jpg')}];
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

<style scoped lang="scss">
  @import '../../styles/index-banner';
</style>
