<template>
  <div id="moments" class="g-moments">
    <Timeline>
      <Card disHover>
        <span slot="title">
          <span class="g-moments header">
            <strong>动 态</strong>
          </span>
        </span>
        <p v-if="moments.length === 0" style="text-align: center">暂无动态哦</p>
        <div class="g-moments container" v-else>
          <TimelineItem v-for="moment in moments" :key="moment.moment_id">
            <div v-if="moment.type === 'planmod'" class="m-moment">
              <span class="m-moment time">{{ getTime(moment.created_at) }}</span>
              <div>
                <Icon type="ios-lightbulb"></Icon>&nbsp;&nbsp;
                <strong>{{moment.profile.name}}</strong>&nbsp;更新了计划：
                <span>{{moment.desc}}</span>
              </div>
            </div>
            <div v-if="moment.type === 'article'" class="m-moment">
              <span class="m-moment time">{{ getTime(moment.created_at) }}</span>
              <div>
                <Icon type="document-text"></Icon>&nbsp;&nbsp;
                <strong>{{moment.profile.name}}</strong>&nbsp;发布了文章：
                <span>{{moment.desc}}</span>
                <a :href="'/#' + moment.href">查 看</a>
              </div>
            </div>
            <div v-if="moment.type === 'resource'" class="m-moment">
              <span class="m-moment time">{{ getTime(moment.created_at) }}</span>
              <div>
                <Icon type="android-folder-open"></Icon>&nbsp;
                <strong>{{moment.profile.name}}</strong>&nbsp;上传了资源：
                <span>{{moment.desc}}</span>
                <a :href="moment.href">下 载</a>
              </div>
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
    props: {
      limit: {
        default: 40
      }
    },
    data () {
      return {
        moments: []
      };
    },
    methods: {
      fetchMoments () {
        let _this = this;
        this.$ajax.get('/api/moment/fetch?type=all&limit=' + this.limit)
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

<style scoped lang="scss">
  @import '../../styles/moments';
</style>
