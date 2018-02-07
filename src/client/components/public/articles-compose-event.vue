<template>
  <Card disHover>
    <div class="g-done">
      <div class="m-upload-list" v-for="item in uploadList">
        <div >
          <img :src="item.url">
          <div class="m-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          </div>
        </div>
      </div>
    </div>
    <Upload ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            action="#">
      <div class="m-upload">
        <Icon type="ios-cloud-upload" size="120" style="color: #3399ff"></Icon>
        <p>单击或拖拽到此处上传活动图集</p>
      </div>
    </Upload>
    <Modal title="View Image" v-model="visible">
      <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
    </Modal>
  </Card>
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
        toUploadList: [],
        uploadList: []
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
      handleBeforeUpload (file) {
        let _this = this;
        console.log(file);
        this.compress(file, 0.5, function (err, data) { // data: Blob
          console.log(data);
          if (err) {
            console.log(err);
          }
          _this.toUploadList.push({
            'name': 'a42bdcc1178e62b4694c830f028db5c0',
            'url': window.URL.createObjectURL(data)
          });
          _this.uploadList = _this.toUploadList;
          console.log(_this.uploadList);
        });
        return false;
      }
    },
    mounted () {
      console.log(this.$refs.upload.fileList);
      this.uploadList = this.$refs.upload.fileList;
    }
  };
</script>

<style scoped lang="scss">
  @import '../../styles/articles-compose-event';
</style>
