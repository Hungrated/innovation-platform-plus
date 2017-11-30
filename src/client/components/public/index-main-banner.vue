<template>
  <div class="index-banner">
    <div class="index-banner-container">
      <Carousel autoplay :autoplay-speed="3500" v-model="value" loop>
        <div v-for="img in imgList" :key="img.id">
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
          {id: 0, src: require('../../assets/banner_01.jpg')},
          {id: 1, src: require('../../assets/banner_02.jpg')},
          {id: 2, src: require('../../assets/banner_03.jpg')},
          {id: 3, src: require('../../assets/banner_04.jpg')},
          {id: 4, src: require('../../assets/banner_05.jpg')},
          {id: 5, src: require('../../assets/banner_06.jpg')}
        ]
      };
    }
  };
</script>

