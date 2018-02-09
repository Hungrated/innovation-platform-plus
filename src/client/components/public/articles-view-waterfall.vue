<template>

  <waterfall :line-gap="315"
             :min-line-gap="150"
             :max-line-gap="370"
             :fixed-height="true"
             :watch="articleList">
    <waterfall-slot
      v-for="(item, index) in articleList"
      :width="400"
      :height="item.cover ? 302 : 116"
      :order="index"
      :key="item.blog_id">
      <Card class="m-unit m-unit-cover" v-if="item.cover">
        <div class="g-container">
          <span class="g-img" @click="revealDetails(item.blog_id)">
            <img :src="item.cover">
          </span>
          <span class="g-title g-title-cover" @click="revealDetails(item.blog_id)">
            <strong>{{item.title}}</strong>
          </span>
          <span class="g-details info">
            <Icon type="ios-person-outline"></Icon>&nbsp;{{item.profile.name}}&emsp;
            <Icon type="ios-clock-outline"></Icon>&nbsp;{{item.publishTime}}
          </span>
          <span class="g-details desc">
            <Icon type="ios-star-outline"></Icon>&nbsp;{{item.description}}
          </span>
        </div>
      </Card>
      <Card class="m-unit m-unit-title" v-else>
        <div class="g-container">
          <span class="g-title">
            <strong>{{item.title}}</strong>
          </span>
          <span class="g-details info">
            <Icon type="ios-person-outline"></Icon>&nbsp;{{item.profile.name}}&emsp;
            <Icon type="ios-clock-outline"></Icon>&nbsp;{{item.publishTime}}
          </span>
          <span class="g-details desc">
            <Icon type="ios-star-outline"></Icon>&nbsp;{{item.description}}
          </span>
        </div>
      </Card>
    </waterfall-slot>
  </waterfall>
</template>

<script>
  import Waterfall from 'vue-waterfall/lib/waterfall';
  import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot';

  export default {
    name: 'article-view-waterfall',
    props: ['articleList', 'count'],
    components: {
      Waterfall,
      WaterfallSlot
    },
    methods: {
      revealDetails (index) {
        this.$router.push('/articles/details?index=' + index);
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../styles/article-waterfall";
</style>

