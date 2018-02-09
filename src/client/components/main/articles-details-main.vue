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
            <div style="display: flex; justify-content: space-between">
              <span class="m-header info">
                <Icon type="ios-person-outline"></Icon>&emsp;{{details.blog.profile.name}}&emsp;&emsp;
                <Icon type="ios-clock-outline"></Icon>&emsp;{{details.blog.publishTime}}&emsp;
              </span>
              <span>
                <Button type="success"
                        size="small"
                        icon="social-markdown"
                        @click="exportMd()">
                  导出为Markdown文档
                </Button>
                <Button type="text"
                        size="small"
                        @click="back()">
                  返回文章列表
                </Button>
              </span>
            </div>
          </div>
          <div class="m-content">
            <markdown-details :value="details.blog.content"/>
          </div>
        </div>
        <div class="g-details container right">
          <div class="m-list m-list-rel">
            <span class="m-list title"><strong>类别标签</strong></span>
            <!--列出所有标签-->
            <span>
              list1
            </span>
          </div>
          <div class="m-list m-list-rec">
            <span class="m-list title"><strong>推荐阅读</strong></span>
            <!--同标签下的其他文章-->
            <span>
              list2
            </span>
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
            profile: {}
          },
          images: [],
          comments: []
        },
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
      refreshData () {
        let _this = this;
        const query = window.location.href.split('?')[1];
        this.index = query.split('=')[1];
        this.$ajax.get('/api/blog/details?' + query)
          .then(function (res) {
            _this.details = res.data;
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
            // _this.$Message.success(res.data.msg);
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    },
    mounted () {
      this.refreshData();
    }
  };
</script>

<style scoped lang="scss">
  @import "../../styles/articles-details";
</style>

