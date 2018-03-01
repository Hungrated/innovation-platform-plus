<template>
  <div id="moments" class="g-moments">
    <div class="g-moments nav">
      <Menu mode="horizontal" theme="dark">
        <div class="m-nav">
          <MenuItem name="1">
            <span @click="changeMode('article')">
              <Icon type="document-text"></Icon>&nbsp;文章
            </span>
          </MenuItem>
          <MenuItem name="2">
            <span @click="changeMode('resource')">
              <Icon type="android-folder-open"></Icon>&nbsp;资源
            </span>
          </MenuItem>
          <MenuItem name="3">
            <span @click="changeMode('planmod')">
              <Icon type="ios-lightbulb"></Icon>&nbsp;计划
            </span>
          </MenuItem>
        </div>
      </Menu>
    </div>
    <Timeline>
      <p v-if="moments.length === 0" style="text-align: center">暂无动态哦</p>
      <div class="m-container" v-else>
        <TimelineItem v-for="moment in moments" :key="moment.moment_id">
          <!--article-->
          <div v-if="moment.type === 'article'" class="m-moment g-unit">
            <div class="g-unit left">
              <span class="m-moment time">{{ getTime(moment.created_at) }}</span>
            </div>
            <Card disHover class="g-unit right">
              <span slot="title">
                <Icon type="document-text"></Icon>&nbsp;&nbsp;
                <strong>{{moment.profile.name}}</strong>&nbsp;发布了文章：
                <strong>{{moment.desc}}</strong>
                <span class="m-details">
                  <a :href="'/#/articles'">查看所有文章</a>&nbsp;&nbsp;|&nbsp;
                  <a class="m-details" :href="'/#' + moment.extras.href">查 看</a>
                </span>
              </span>
              <div class="m-unit">
                <img v-if="!!moment.extras.cover" :src="moment.extras.cover">
                <div class="m-unit details">
                  <span>
                    <span v-for="(label, index) in moment.extras.labels" :key="index">
                      <Tag size="small" :color="label.category === 'both' ?
                             'blue' : (label.category === 'blog' ? 'green' : 'yellow')">
                        {{label.name}}
                      </Tag>
                    </span>
                   </span>
                  <p><strong>描 述： </strong>{{moment.extras.desc}}</p>
                </div>
              </div>
            </Card>
          </div>
          <!--resource-->
          <div v-if="moment.type === 'resource'" class="m-moment g-unit">
            <div class="g-unit left">
              <span class="m-moment time">{{ getTime(moment.created_at) }}</span>
            </div>
            <Card disHover class="g-unit right">
              <span slot="title">
                <Icon type="document-text"></Icon>&nbsp;&nbsp;
                <strong>{{moment.profile.name}}</strong>&nbsp;上传了资源：
                <strong>{{moment.desc}}</strong>
                <span class="m-details">
                  <a :href="'/#/resources'">查看所有资源</a>&nbsp;&nbsp;|&nbsp;
                  <a :href="moment.extras.url">下 载</a>
                </span>
              </span>
              <div class="m-unit">
                <img v-if="!!moment.extras.cover" :src="moment.extras.cover">
                <div class="m-unit details">
                  <span>
                    <span v-for="(label, index) in moment.extras.labels" :key="index">
                      <Tag size="small" :color="label.category === 'both' ?
                             'blue' : (label.category === 'blog' ? 'green' : 'yellow')">
                        {{label.name}}
                      </Tag>
                    </span>
                    <span>&emsp;<strong>描 述： </strong>{{moment.extras.desc}}</span>
                   </span>
                </div>
              </div>
            </Card>
          </div>
          <!--planmod-->
          <div v-if="moment.type === 'planmod'" class="m-moment g-unit">
            <div class="g-unit left">
              <span class="m-moment time">{{ getTime(moment.created_at) }}</span>
            </div>
            <Card disHover class="g-unit right">
              <span slot="title">
                <Icon type="ios-lightbulb"></Icon>&nbsp;&nbsp;
                <strong>{{moment.profile.name}}</strong>&nbsp;更新了计划：
                <strong>{{moment.desc}}</strong>
                <!--<span class="m-details">-->
                <!--<a :href="'/#/resources'">查看所有资源</a>&nbsp;&nbsp;|&nbsp;-->
                <!--<a :href="moment.extras.url">下 载</a>-->
                <!--</span>-->
              </span>
              <div class="m-unit">
                <img v-if="!!moment.extras.cover" :src="moment.extras.cover">
                <div class="m-unit details">
                  <span>
                    <span v-for="(label, index) in moment.extras.labels" :key="index">
                      <Tag size="small" :color="label.category === 'both' ?
                             'blue' : (label.category === 'blog' ? 'green' : 'yellow')">
                        {{label.name}}
                      </Tag>
                    </span>
                    <span>&emsp;<strong>描 述： </strong>{{moment.extras.desc}}</span>
                   </span>
                </div>
              </div>
            </Card>
          </div>
        </TimelineItem>
      </div>
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
        moments: [],
        labelList: []
      };
    },
    methods: {
      changeMode (mode) {
        this.fetchMoments(mode);
      },
      fetchMoments (mode) {
        let _this = this;
        let type = mode || 'all';
        this.$ajax.get('/api/moment/fetch?type=' + type + '&limit=' + this.limit)
          .then(function (res) {
            _this.moments = res.data;
            for (let i = 0; i < res.data.length; i++) {
              _this.moments[i].extras = JSON.parse(res.data[i].extras);
            }
            _this.refreshLabelList();
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
      },
      refreshLabelList () {
        let _this = this;
        this.$ajax.post('/api/label/query', {})
          .then(function (res) {
            _this.labelList = res.data;
            for (let i = 0; i < _this.moments.length; i++) {
              if (_this.moments[i].extras.labels) {
                let labels = _this.moments[i].extras.labels;
                _this.moments[i].extras.labels = _this.parseLabel(labels);
              }
            }
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      getLabel (index) {
        let labelList = this.labelList;
        for (let i = 0; i < labelList.length; i++) {
          if (labelList[i].label_id.toString() === index.toString()) {
            return {
              name: labelList[i].name,
              category: labelList[i].category
            };
          }
        }
        return null;
      },
      parseLabel (labels) {
        let res = [];
        let labelIds = labels.toString().split(',');
        for (let i = 0; i < labelIds.length; i++) {
          let label = this.getLabel(labelIds[i]);
          if (label !== null) {
            res.push(label);
          }
        }
        return res;
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
