<template>
  <div>
    <div class="m-unit" v-for="article in articleList" :key="article.blog_id">
      <span class="m-unit title">
        <Button type="text" size="large" @click="revealDetails(article.blog_id)">
          <strong>{{article.title}}</strong>
        </Button>
        <span class="g-labels">
          <span v-for="(label, index) in article.labels" :key="index">
            <Tag size="small" :color="label.category === 'both' ?
                 'blue' : (label.category === 'blog' ? 'green' : 'yellow')">
              {{label.name}}
            </Tag>
          </span>
        </span>
      </span>
      <span class="m-unit details">
        <Icon type="ios-person-outline"></Icon>&nbsp;{{article.profile.name}}&emsp;
        <Icon type="ios-clock-outline"></Icon>&nbsp;{{article.publishTime}}&emsp;
        <Icon type="ios-star-outline"></Icon>&nbsp;{{article.description}}
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'article-view-list',
    props: ['articleList', 'count'],
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

