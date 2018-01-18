<template>
  <div id="moments-container" class="moments-container">
    <Timeline>
      <p v-if="momentsList.length === 0" style="text-align: center">暂无动态哦</p>
      <div class="s-moment-item-container" v-else>
        <TimelineItem v-for="moment in momentsList" key="moment.moment_id">
          <div v-if="moment.type === 'planmod'" class="s-moment-item">
            <div class="s-moment-item-time">{{ getTime(moment.created_at) }}</div>
            <div>
              <Icon type="ios-lightbulb"></Icon>&nbsp;
              <strong>更新计划：</strong>
              <span>{{moment.desc}}</span>
            </div>
            <div v-if="moment.href !== ''">
              <strong class="s-moment-item-status">{{ moment.href }}</strong>
            </div>
          </div>
          <div v-if="moment.type === 'article'" class="s-moment-item">
            <div class="s-moment-item-time">{{ getTime(moment.created_at) }}</div>
            <div>
              <Icon type="document-text"></Icon>&nbsp;&nbsp;
              <strong>发布文章：</strong>
              <span>{{moment.desc}}</span>
              <a :href="'/#' + moment.href">查 看</a>
            </div>
          </div>
          <div v-if="moment.type === 'resource'" class="s-moment-item">
            <div class="s-moment-item-time">{{ getTime(moment.created_at) }}</div>
            <div>
              <Icon type="android-folder-open"></Icon>&nbsp;
              <strong>上传资源：</strong>
              <span>{{moment.desc}}</span>
              <a :href="moment.href">下 载</a>
            </div>
          </div>
        </TimelineItem>
      </div>
    </Timeline>
  </div>
</template>

<script>
  export default {
    name: 'user-center-moments',
    data () {
      return {
        momentsList: []
      };
    },
    methods: {
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
      },
      fetchMoments (sid) {
        let _this = this;
        this.$ajax.get('/api/moment/fetch?sid=' + sid + '&limit=40')
          .then(function (res) {
            _this.momentsList = res.data;
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    },
    mounted () {
      this.fetchMoments(JSON.parse(window.localStorage.user).school_id);
    }
  };
</script>
