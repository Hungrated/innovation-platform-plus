<template>
  <Card disHover class="g-container">
    <div class="g-done">
      <div class="m-upload-list" v-for="item in toUploadList">
        <img :src="item.url">
        <div class="m-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </div>
    </div>
    <Upload ref="upload"
            :show-upload-list="false"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            action="#">
      <div class="m-upload">
        <Icon type="ios-cloud-upload" size="120" style="color: #3399ff"></Icon>
        <p>单击或拖拽图片到此处以上传到活动图集</p>
      </div>
    </Upload>
    <Modal title="查看大图" v-model="visible" width="50">
      <img :src="viewSrc" style="width: 100%">
    </Modal>
  </Card>
</template>
<script>
  export default {
    name: 'event-editor',
    props: ['title', 'label', 'description'],
    data () {
      return {
        uploadConfig: {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        },
        visible: false,
        viewSrc: '',
        toUploadList: []
      };
    },
    methods: {
      compress (file, quality, callback) {
        if (!window.FileReader || !window.Blob) {
          return errorHandler('您的浏览器不支持图片压缩')();
        }

        let reader = new FileReader();
        let mimeType = file.type || 'image/jpeg';

        reader.onload = createImage;
        reader.onerror = errorHandler('图片读取失败！');
        reader.readAsDataURL(file);

        function createImage () {
          let dataURL = this.result;
          let image = new Image();
          image.onload = compressImage;
          image.onerror = errorHandler('图片加载失败');
          image.src = dataURL;
        }

        function compressImage () {
          let canvas = document.createElement('canvas');
          let ctx;
          let dataURI;
          let result;

          canvas.width = this.naturalWidth;
          canvas.height = this.naturalHeight;
          ctx = canvas.getContext('2d');
          ctx.drawImage(this, 0, 0);
          dataURI = canvas.toDataURL(mimeType, quality);
          result = dataURIToBlob(dataURI);

          callback(null, result);
        }

        function dataURIToBlob (dataURI) {
          let type = dataURI.match(/data:([^;]+)/)[1];
          let base64 = dataURI.replace(/^[^,]+,/, '');
          let byteString = atob(base64);

          let ia = new Uint8Array(byteString.length);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }

          return new Blob([ia], {type: type});
        }

        function errorHandler (message) {
          return function () {
            let error = new Error('Compression Error:', message);
            callback(error, null);
          };
        }
      },
      handleView (src) {
        this.viewSrc = src;
        this.visible = true;
      },
      handleRemove (file) {
        const fileList = this.toUploadList;
        this.toUploadList.splice(fileList.indexOf(file), 1);
      },
      handleBeforeUpload (file) {
        let _this = this;
        this.compress(file, 0.5, function (err, data) { // data: Blob
          if (err) {
            console.log(err);
          }
          _this.toUploadList.push({
            'blob': data,
            'url': window.URL.createObjectURL(data)
          });
          return false;
        });
      },
      uploadImgList (id) {
        const imgList = this.toUploadList;
        let imgData = new FormData();
        imgData.append('blog_id', id);
        for (let i = 0; i < imgList.length; i++) {
          imgData.append(`img_${i}`, imgList[i].blob);
        }
        this.$ajax.post('/api/blog/imgupload', imgData, this.uploadConfig)
          .catch(function (e) {
            console.log(e);
          });
      },
      submit () {
        let submitData = {
          type: 'event',
          title: this.title,
          description: this.description,
          content: '这是一篇活动文章，请用图片查看方式浏览',
          cover_url: '',
          photo_url: '',
          author_id: JSON.parse(window.localStorage.user).school_id
        };
        if (!submitData.title || !submitData.description) {
          this.$Message.info('请将空余内容补充完整');
        } else if (!this.toUploadList.length) {
          this.$Message.info('请上传相关图片');
        } else {
          const _this = this;
          // publish the article
          this.$ajax.post('/api/blog/publish', submitData)
            .then(function (res) {
              _this.uploadImgList(res.data.blog_id);
              _this.$Message.success(res.data.msg);
              _this.$router.push({path: '/articles'});
            })
            .catch(function (e) {
              console.log(e);
            });
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  @import '../../styles/articles-compose-event';
</style>
