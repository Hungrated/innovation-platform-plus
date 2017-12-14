<template>
  <Card disHover>
    <div class="article-unit" v-for="article in articleList" :key="article.id">
      <span class="article-title">
        <Button type="text" size="large">
          <strong>{{article.title}}</strong>
        </Button>
      </span>
      <span class="article-details">
        <span class="article-info">
        <Icon type="ios-person-outline"></Icon>&nbsp;{{article.profile.name}}&emsp;
        <Icon type="ios-clock-outline"></Icon>&nbsp;{{article.publishTime}}&emsp;
      </span>
      <span class="article-desc">
        <Icon type="ios-star-outline"></Icon>&nbsp;
        <p>{{article.description}}</p>
      </span>
      </span>
    </div>
    <div class="article-page">
      <Page :total="40" size="small" show-total></Page>
    </div>

  </Card>
</template>

<script>
  export default {
    name: 'article-list',
    props: ['data'],
    data () {
      return {
        articleList: [{
          id: 1,
          type: 'project',
          title: 'test',
          description: 'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest',
          content: '<h1>test</h1>\n',
          cover_url: '',
          photo_url: '',
          created_at: '2017-12-03T15:26:20.000Z',
          updated_at: '2017-12-03T15:26:20.000Z',
          author_id: 14051531,
          profile: {
            name: '章梓航'
          },
          publishTime: '2017-12-03 23:26:20'
        }, {
          id: 2,
          type: 'project',
          title: 'test',
          description: 'test',
          content: '<h1>test</h1>\n',
          cover_url: '',
          photo_url: '',
          created_at: '2017-12-03T15:26:20.000Z',
          updated_at: '2017-12-03T15:26:20.000Z',
          author_id: 14051531,
          profile: {
            name: '章梓航'
          },
          publishTime: '2017-12-03 23:26:20'
        }, {
          id: 3,
          type: 'project',
          title: 'test',
          description: 'test',
          content: '<h1>test</h1>\n',
          cover_url: '',
          photo_url: '',
          created_at: '2017-12-03T15:26:20.000Z',
          updated_at: '2017-12-03T15:26:20.000Z',
          author_id: 14051531,
          profile: {
            name: '章梓航'
          },
          publishTime: '2017-12-03 23:26:20'
        }, {
          type: 'project',
          title: 'test',
          description: 'test',
          content: '<h1>test</h1>\n',
          cover_url: '',
          photo_url: '',
          created_at: '2017-12-03T15:26:20.000Z',
          updated_at: '2017-12-03T15:26:20.000Z',
          author_id: 14051531,
          profile: {
            name: '章梓航'
          },
          publishTime: '2017-12-03 23:26:20'
        }, {
          id: 4,
          type: 'project',
          title: 'test',
          description: 'test',
          content: '<h1>test</h1>\n',
          cover_url: '',
          photo_url: '',
          created_at: '2017-12-03T15:26:20.000Z',
          updated_at: '2017-12-03T15:26:20.000Z',
          author_id: 14051531,
          profile: {
            name: '章梓航'
          },
          publishTime: '2017-12-03 23:26:20'
        }, {
          id: 5,
          type: 'project',
          title: 'test',
          description: 'test',
          content: '<h1>test</h1>\n',
          cover_url: '',
          photo_url: '',
          created_at: '2017-12-03T15:26:20.000Z',
          updated_at: '2017-12-03T15:26:20.000Z',
          author_id: 14051531,
          profile: {
            name: '章梓航'
          },
          publishTime: '2017-12-03 23:26:20'
        }]
      };
    }
  };
</script>

<style scoped>

</style>

