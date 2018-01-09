<template>
  <div id="moments">
    <Card>
      <Timeline>
        <TimelineItem color="green">
          <Icon type="trophy" slot="dot"></Icon>
          <span>发布里程碑版本</span>
        </TimelineItem>
        <TimelineItem>发布1.0版本</TimelineItem>
        <TimelineItem>发布2.0版本</TimelineItem>
        <TimelineItem>发布3.0版本</TimelineItem>
      </Timeline>
    </Card>
  </div>

</template>

<script>
  export default {
    name: 'moments-main',
    data () {
      return {};
    }
  };
</script>

<style>
  @import '../../styles/moments.css';
</style>
