<template>
  <div id="moments" class="moments-main">
    <Timeline>
      <Card disHover>
        <span slot="title">
          <span class="main-panel-card-header">
            <strong>动 态</strong>
          </span>
        </span>
        <p v-if="moments.length === 0" style="text-align: center">暂无动态哦</p>
        <div class="moment-item-container" v-else>
          <TimelineItem v-for="moment in moments" key="moment.moment_id">
            <div v-if="moment.type === 'planmod'" class="moment-item">
              <span class="moment-item-time">{{ getTime(moment.created_at) }}</span>
              &emsp;&emsp;<Icon type="ios-lightbulb"></Icon>&nbsp;&nbsp;
              <strong>{{moment.profile.name}}</strong>&nbsp;更新了计划：
              <span>{{moment.desc}}</span>
            </div>
            <div v-if="moment.type === 'article'" class="moment-item">
              <span class="moment-item-time">{{ getTime(moment.created_at) }}</span>
              &emsp;&emsp;<Icon type="document-text"></Icon>&nbsp;&nbsp;
              <strong>{{moment.profile.name}}</strong>&nbsp;发布了文章：
              <span>{{moment.desc}}</span>
              <a :href="'/#' + moment.href">查 看</a>
            </div>
            <div v-if="moment.type === 'resource'" class="moment-item">
              <span class="moment-item-time">{{ getTime(moment.created_at) }}</span>
              &emsp;&emsp;<Icon type="android-folder-open"></Icon>&nbsp;
              <strong>{{moment.profile.name}}</strong>&nbsp;上传了资源：
              <span>{{moment.desc}}</span>
              <a :href="moment.href">下 载</a>
            </div>
          </TimelineItem>
        </div>
      </Card>
    </Timeline>
  </div>

</template>

<script>
  export default {
    name: 'moments-main',
    data () {
      return {
        moments: []
      };
    },
    methods: {
      fetchMoments () {
        let _this = this;
        this.$ajax.get('/api/moment/fetch?type=all')
          .then(function (res) {
            _this.moments = res.data;
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      getTime (createdAt) {
        let curTime = new Date(createdAt);
        let convert = function (digit) {
          if (digit < 10) return '0' + digit;
          else return digit.toString();
        };
        let year = curTime.getFullYear();
        let month = convert(curTime.getMonth() + 1);
        let day = convert(curTime.getDate());
        return year + '-' + month + '-' + day;
      }
    },
    mounted () {
      this.fetchMoments();
    }
  };
</script>

<style scoped>
  @import '../../styles/moments.css';
</style>
