<template>
  <div class="resources-main">
    <Card disHover>
      <span slot="title" class="resources-main-header">
        <span><strong>资源共享</strong></span>
        <span><Button type="primary" size="small">上 传</Button></span>
      </span>
      <div class="resource-unit" v-for="resource in resourceList" :key="resource.id">
      <span class="resource-title">
        <Button type="text" size="large" @click="revealDetails(resource.id)">
          <strong>{{resource.title}}</strong>
        </Button>
      </span>
        <span class="resource-details">
        <span class="resource-info">
        <Icon type="ios-person-outline"></Icon>&nbsp;{{resource.profile.name}}&emsp;
        <Icon type="ios-clock-outline"></Icon>&nbsp;{{resource.publishTime}}&emsp;
      </span>
      <span class="resource-desc">
        <Icon type="ios-star-outline"></Icon>&nbsp;
        <p>{{resource.description}}</p>
      </span>
      </span>
      </div>
      <div class="resource-page">
        <Page size="small"></Page>
      </div>

    </Card>
  </div>
</template>

<script>
  export default {
    name: 'resources-main',
    data () {
      return {
        resourceList: []
      };
    }
  };
</script>

<style>
  @import '../../styles/resources.css';
</style>
