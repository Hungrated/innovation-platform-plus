<template>
  <div class="g-details">
    <div class="g-details nav">
      <Menu mode="horizontal" theme="dark">
        <div class="m-nav">
          <MenuItem name="1">
            <span @click="changeRoute('/articles/compose')">
              <Icon type="compose"></Icon>&emsp;发布文章
            </span>
          </MenuItem>
        </div>
      </Menu>
    </div>
    <Card disHover>
      <div class="g-details container">
        <div class="g-details container left">
          <div class="m-header">
            <div class="m-header title"><strong>{{details.blog.title}}</strong></div>
            <div class="m-header labels">
              <span v-for="(label, index) in details.blog.labels" :key="index">
                <Tag size="small" :color="label.category === 'both' ?
                     'blue' : (label.category === 'blog' ? 'green' : 'yellow')">
                  {{label.name}}
                </Tag>
              </span>
            </div>
            <div style="display: flex; justify-content: space-between">
              <span class="m-header info">
                <Icon type="ios-person-outline"></Icon>&emsp;{{details.blog.profile.name}}&emsp;&emsp;
                <Icon type="ios-clock-outline"></Icon>&emsp;{{details.blog.publishTime}}&emsp;
              </span>
              <span>
                <Button v-if="details.blog.type === 'project'"
                        type="success"
                        size="small"
                        icon="social-markdown"
                        @click="exportMd()">
                  导出为Markdown文档
                </Button>
                <Button type="text"
                        size="small"
                        @click="back()">
                  返回所有文章
                </Button>
              </span>
            </div>
          </div>
          <div class="m-content">
            <markdown-details v-if="details.blog.type === 'project'" :value="details.blog.content"/>
            <event-details v-if="details.blog.type === 'event'" :images="details.images"/>
          </div>
        </div>
        <div class="g-details container right">
          <div class="m-list m-list-rel">
            <span class="m-list title"><strong>类别标签</strong></span>
            <span class="m-label">
              <div>
                <Button @click="getArticleList()"
                        size="small"
                        type="warning">
                  <strong>所有文章</strong>
                </Button>
              </div>
              <span v-for="label in labelList" :key="label.label_id">
                <Button @click="getArticleList({labels: label.label_id})"
                        size="small"
                        :type="label.category === 'both'
                          ? 'success' : (label.category === 'blog' ? 'primary' : 'warning')">
                  <strong>{{label.name}}</strong>
                </Button>
              </span>
            </span>
          </div>
          <div class="m-list m-list-rec">
            <span class="m-list title"><strong>阅读列表</strong></span>
            <div v-if="!articleList.length" class="m-list empty">暂无内容哦</div>
            <div v-else class="m-unit" v-for="article in articleList" :key="article.blog_id">
              <span class="m-unit utitle">
                <Button size="small" type="text" @click="revealDetails(article.blog_id)">
                  <strong>{{article.title}}</strong>
                </Button>
              </span>
              <span class="m-unit details">
                <Icon type="ios-person-outline"></Icon>&nbsp;{{article.profile.name}}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="m-comment" v-for="commentUnit in details.comments" :key="commentUnit.id">
        <span class="m-comment header">
          <span class="m-comment header user">
            <strong>{{commentUnit.profile.name}}</strong>&emsp;&emsp;
            <em><Icon type="card"></Icon>&emsp;{{commentUnit.student_id}}</em>&emsp;
          </span>
          <span class="m-comment header time">
            <span>
              <Icon type="ios-clock-outline"></Icon>&emsp;
              {{commentUnit.submitTime}}</span>
          </span>
        </span><span class="m-comment body"><span>{{commentUnit.content}}</span></span>
      </div>
    </Card>
    <br>
    <Card disHover>
      <div class="m-edit">
        <i-input class="m-edit text" type="textarea" v-model="comment" placeholder="说点什么吧..."></i-input>
        <span>
          <Button type="ghost" size="large" @click="commentSubmit()">提 交</Button>
        </span>
      </div>
    </Card>
    <iframe id="fileDownloadTmpFrame" style="display: none"></iframe>
  </div>
</template>

<script>
  import markdownDetails from '../public/articles-details-markdown';
  import eventDetails from '../public/articles-details-event';

  export default {
    name: 'article-details',
    data () {
      return {
        index: null,
        details: {
          blog: {
            content: '',
            labels: '',
            profile: {}
          },
          images: [],
          comments: []
        },
        labelList: [],
        articleList: [],
        comment: ''
      };
    },
    components: {
      markdownDetails,
      eventDetails
    },
    methods: {
      changeRoute (path) {
        this.$router.push(path);
      },
      back () {
        this.changeRoute('/articles');
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
          if (label) {
            res.push(label);
          }
        }
        return res;
      },
      getLabelList () {
        let _this = this;
        this.$ajax.post('/api/label/query', {
          type: 'blog'
        })
          .then(function (res) {
            _this.labelList = res.data;
            _this.details.blog.labels = _this.parseLabel(_this.details.blog.labels);
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      refreshData () {
        let _this = this;
        const query = window.location.href.split('?')[1];
        this.index = query.split('=')[1];
        this.$ajax.get('/api/blog/details?' + query)
          .then(function (res) {
            _this.details = res.data;
            _this.getLabelList();
            if (!res.data) {
              this.$Message.error('无此文章，请浏览其他内容');
            }
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      commentSubmit () {
        let _this = this;
        if (this.comment === '') {
          this.$Message.info('请输入评论内容');
          return;
        }
        let commentData = {
          student_id: JSON.parse(window.localStorage.user).school_id,
          blog_id: this.index,
          content: this.comment
        };
        this.comment = '';
        this.$ajax.post('/api/comment/submit', commentData)
          .then(function (res) {
            _this.$Message.success(res.data.msg);
            _this.refreshData();
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      downloadFile (url) {
        let a = document.getElementById('fileDownloadTmpFrame');
        a.src = url;
        this.$Message.success('文件下载成功');
      },
      exportMd () {
        let _this = this;
        this.$ajax.post('/api/blog/export', {
          blog_id: this.index
        })
          .then(function (res) {
            console.log(res.data.url);
            _this.downloadFile(res.data.url);
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      getArticleList (mode) {
        let _this = this;
        let request = mode || 'all';
        this.$ajax.post('/api/blog/query', {
          request: request,
          carousel: false,
          limit: 8
        })
          .then(function (res) {
            _this.articleList = res.data.articleList;
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      revealDetails (index) {
        this.$router.push('/articles/details?index=' + index);
        this.refreshData();
      }
    },
    mounted () {
      this.refreshData();
      this.getArticleList();
    }
  };
</script>

<style scoped lang="scss">
  @import "../../styles/articles-details";
</style>

