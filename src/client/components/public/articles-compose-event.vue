<template>
  <div>
    <Card disHover>
      <div id="uploader" class="m-upload">
        <div class="queueList">
          <div id="dndArea" class="placeholder">
            <div id="filePicker"></div>
            <p>或将照片拖到这里，单次最多可选10张</p>
          </div>
        </div>
        <div class="statusBar" style="display:none">
          <div class="progress">
            <span class="text">0%</span>
            <span class="percentage"></span>
          </div>
          <div class="info"></div>
          <div class="btns">
            <div id="filePicker2"></div>
            <div class="uploadBtn">开始上传</div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
  export default {
    name: 'event-editor',
    props: ['title', 'label', 'description'],
    data () {
      return {};
    },
    methods: {
      submit () {
        let submitData = {
          type: 'project',
          title: this.title,
          description: this.description,
          // content: this.$children[0].d_render,
          content: this.$children[0].d_value,
          cover_url: '',
          photo_url: '',
          author_id: JSON.parse(window.localStorage.user).school_id
        };
        if (!submitData.title || !submitData.content) {
          this.$Message.info('请将空余内容补充完整');
        } else {
          const _this = this;
          this.$ajax.post('/api/blog/publish', submitData)
            .then(function (res) {
              _this.$Message.success(res.data.msg);
              _this.$router.push({path: '/articles'});
            })
            .catch(function (e) {
              console.log(e);
            });
        }
      }
    },
    mounted () {

    }
  };
</script>

<style scoped lang="scss">
  @import '../../styles/articles-compose-event';
</style>
