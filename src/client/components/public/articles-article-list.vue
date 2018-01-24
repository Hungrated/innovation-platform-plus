<template>
  <Card disHover>
    <div class="m-unit" v-for="article in articleList" :key="article.id">
      <span class="m-unit title">
        <Button type="text" size="large" @click="revealDetails(article.blog_id)">
          <strong>{{article.title}}</strong>
        </Button>
      </span>
      <span class="m-unit details">
        <span class="m-unit details info">
        <Icon type="ios-person-outline"></Icon>&nbsp;{{article.profile.name}}&emsp;
        <Icon type="ios-clock-outline"></Icon>&nbsp;{{article.publishTime}}&emsp;
      </span>
      <span class="m-unit details desc">
        <Icon type="ios-star-outline"></Icon>&nbsp;
        <p>{{article.description}}</p>
      </span>
      </span>
    </div>
    <div class="m-page">
      <Page size="small" :total="count"></Page>
    </div>

  </Card>
</template>

<script>
  export default {
    name: 'article-list',
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

