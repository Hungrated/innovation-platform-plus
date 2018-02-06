<template>
  <div>
    <Card disHover>
      <Upload
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        accept="image/*"
        :before-upload="handleBeforeUpload"
        multiple
        type="drag"
        action="#">
        <div class="m-upload">
          <Icon type="ios-cloud-upload" size="120" style="color: #3399ff"></Icon>
          <p>单击或拖拽到此处上传活动图集</p>
        </div>
        <div class="demo-upload-list" v-for="item in uploadList">
          <template v-if="item.status === 'finished'">
            <img :src="item.url">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
          </template>
          <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
          </template>
        </div>
      </Upload>
    </Card>
  </div>
</template>
<script>
  export default {
    name: 'event-editor',
    props: ['title', 'label', 'description'],
    data () {
      return {
        defaultList: [
          {
            'name': 'a42bdcc1178e62b4694c830f028db5c0',
            'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
          },
          {
            'name': 'bc7521e033abdd1e92222d733590f104',
            'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
          }
        ],
        imgName: '',
        visible: false,
        uploadList: [

        ]
      };
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
      },
      handleView (name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove (file) {
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      },
      handleSuccess (res, file) {
        // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
        // file.name = '7eb99afb9d5f317c912f08b5212fd69a';
      },
      handleBeforeUpload () {
        return false;
      }
    },
    mounted () {

    }
  };
</script>

<style scoped lang="scss">
  @import '../../styles/articles-compose-event';
</style>
