<template>
<div id="index">
  <Carousel autoplay :autoplay-speed="3500" :height="500" v-model="value" loop>
    <CarouselItem>
      <div>
        <img :src="imgSrc">
      </div>
    </CarouselItem>
    <CarouselItem>
      2
    </CarouselItem>
    <CarouselItem>
      3
    </CarouselItem>
    <CarouselItem>
      4
    </CarouselItem>
  </Carousel>
</div>
</template>

<script>
  export default {
    name: 'index-main',
    data () {
      return {
        msg: '主页',
        value: 0,
        imgSrc: require('../../assets/bg.png')
      }
    }
  }
</script>

