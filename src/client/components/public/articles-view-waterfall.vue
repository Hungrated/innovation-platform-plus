<template>
  <div>
    <div class="g-empty" v-if="!count">
      <strong>此类别下暂无文章哦，点击右上角发布文章按钮，发布第一篇文章吧</strong>
    </div>
    <waterfall v-else
               :line-gap="315"
               :min-line-gap="150"
               :max-line-gap="370"
               :fixed-height="true"
               :watch="articleList">
      <waterfall-slot v-for="(item, index) in articleList"
                      :width="400"
                      :height="item.cover ? 339 : 154"
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
            <span class="g-labels">
              <span v-for="(label, index) in item.labels" :key="index">
                <Tag size="small" :color="label.category === 'both' ? 'blue' : (label.category === 'blog' ? 'green' :
                'yellow')">
                    {{label.name}}
                </Tag>
              </span>
            </span>
            <span class="g-details info">
              <Icon type="ios-person-outline"></Icon>&nbsp;{{item.profile.name}}&nbsp;
              <Icon type="ios-clock-outline"></Icon>&nbsp;{{item.publishTime}}
            </span>
            <span class="g-details desc">
              <Icon type="ios-star-outline"></Icon>&nbsp;{{item.description}}
            </span>
          </div>
        </Card>
        <Card class="m-unit m-unit-title" v-else>
          <div class="g-container">
            <span class="g-title" @click="revealDetails(item.blog_id)">
              <strong>{{item.title}}</strong>
            </span>
            <span class="g-labels">
              <span v-for="(label, index) in item.labels" :key="index">
                <Tag :color="label.category === 'both' ? 'blue' : (label.category === 'blog' ? 'green' : 'yellow')">
                    {{label.name}}
                </Tag>
              </span>
            </span>
            <span class="g-details info">
              <Icon type="ios-person-outline"></Icon>&nbsp;{{item.profile.name}}&nbsp;
              <Icon type="ios-clock-outline"></Icon>&nbsp;{{item.publishTime}}
            </span>
            <span class="g-details desc">
              <Icon type="ios-star-outline"></Icon>&nbsp;{{item.description}}
            </span>
          </div>
        </Card>
      </waterfall-slot>
    </waterfall>
  </div>
</template>

<script>
  import Waterfall from 'vue-waterfall/lib/waterfall';
  import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot';

  export default {
    name: 'article-view-waterfall',
    props: ['articleList', 'labelList', 'count'],
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

