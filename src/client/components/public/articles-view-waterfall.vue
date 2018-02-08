<template>

  <waterfall :line-gap="350" :watch="articleList">
    <!-- each component is wrapped by a waterfall slot -->
    <waterfall-slot
      v-for="(item, index) in articleList"
      :width="400"
      :height="500"
      :order="index"
      :key="item.blog_id">
      <Card style="margin: 5px;">
        <span class="g-img" v-if="item.cover">
          <img :src="item.cover" style="width: 100%">
        </span>
        <span class="g-title">
          {{item.title}}
        </span>
      </Card>
    </waterfall-slot>
  </waterfall>
  <!--<Card disHover>-->
  <!--<div class="m-unit" v-for="article in articleList" :key="article.id">-->
  <!--<span class="m-unit title">-->
  <!--<Button type="text" size="large" @click="revealDetails(article.blog_id)">-->
  <!--<strong>{{article.title}}</strong>-->
  <!--</Button>-->
  <!--</span>-->
  <!--<span class="m-unit details">-->
  <!--<span class="m-unit details info">-->
  <!--<Icon type="ios-person-outline"></Icon>&nbsp;{{article.profile.name}}&emsp;-->
  <!--<Icon type="ios-clock-outline"></Icon>&nbsp;{{article.publishTime}}&emsp;-->
  <!--</span>-->
  <!--<span class="m-unit details desc">-->
  <!--<Icon type="ios-star-outline"></Icon>&nbsp;-->
  <!--<p>{{article.description}}</p>-->
  <!--</span>-->
  <!--</span>-->
  <!--</div>-->
  <!--<div class="m-page">-->
  <!--<Page size="small" :total="count"></Page>-->
  <!--</div>-->

  <!--</Card>-->
</template>

<script>
  import Waterfall from 'vue-waterfall/lib/waterfall'
  import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'

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
  @import "../../styles/article-list";
</style>

