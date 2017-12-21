<template>
  <div class="article-unit-details">
    <Card disHover style="margin-bottom: 20px">
      <div class="article-container">
        <div class="article-container-left">
          <div class="article-header">
            <div class="article-details-title"><strong>{{details.blog.title}}</strong></div>
            <div style="display: flex; justify-content: space-between">
              <span class="article-details-info">
              <Icon type="ios-person-outline"></Icon>&emsp;{{details.blog.profile.name}}&emsp;&emsp;
              <Icon type="ios-clock-outline"></Icon>&emsp;{{details.blog.publishTime}}&emsp;
            </span>
              <Button type="text" size="small" @click="back()">返回文章列表</Button>
            </div>
          </div>
          <div class="article-details-content" v-html="details.blog.content"></div>
        </div>
        <div class="article-container-right">
          <div class="article-relative-list">
            <span class="list-title"><strong>相关阅读</strong></span>
            <span>
              list1
            </span>
          </div>
          <div class="article-recommend-list">
            <span class="list-title"><strong>推荐阅读</strong></span>
            <span>
              list2
            </span>
          </div>
        </div>
      </div>
    </Card>
    <Card disHover v-if="details.comments.length > 0">
      <span slot="title">
        <strong>评 论</strong>
      </span>
      <div class="article-footer">
        <div class="comment-container">
          <div class="comment-unit" v-for="commentUnit in details.comments" :key="commentUnit.id">
            <span class="comment-unit-header">
              <span>
                <strong>{{commentUnit.profile.name}}</strong>&emsp;&emsp;
                <em><Icon type="card"></Icon>&emsp;{{commentUnit.student_id}}</em>&emsp;
              </span>
              <span style="color: #999999"><Icon type="ios-clock-outline"></Icon>&emsp;{{commentUnit.submitTime}}</span>
            </span>
            <span class="comment-unit-body">
              <span>{{commentUnit.content}}</span>
            </span>
          </div>
        </div>
      </div>
    </Card>
    <br>
    <Card disHover>
      <div class="comment-edit">
        <i-input class="comment-edit-textarea" type="textarea" v-model="comment" placeholder="说点什么吧..."></i-input>
        <span>
            <Button type="ghost" size="large" @click="commentSubmit()">提 交</Button>
          </span>
      </div>
    </Card>
  </div>
</template>

<script>
  export default {
    name: 'article-details',
    data () {
      return {
        index: null,
        details: {
          blog: {
            profile: {}
          },
          comments: []
        },
        comment: ''
      };
    },
    mounted () {
      this.refreshData();
    },
    methods: {
      back () {
        // window.history.back();
        this.$router.push('/articles');
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
            // _this.refreshArticleList();
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
      }
    }
  };
</script>

<style>
  @import '../../styles/articles-article-details.css';
</style>
