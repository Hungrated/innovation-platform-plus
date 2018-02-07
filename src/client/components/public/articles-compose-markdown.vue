<template>
  <Card disHover>
    <div class="m-import">
      <span>
        &emsp;<Icon type="information-circled"></Icon>&nbsp;
        文章内容可从文件导入，追加到现有编辑中，要导入内容，请点击右边的"导入"按钮
      </span>
      <span class="m-import upload">
        <Upload action="#"
                accept="text/plain"
                :show-upload-list="false"
                :before-upload="importText">
          <Button @click="setUploadTxtType('md')"
                  type="dashed"
                  size="small"
                  icon="social-markdown">
            导入Markdown
          </Button>
        </Upload>
        <!--<Upload action="#"-->
        <!--accept="application/msword"-->
        <!--:show-upload-list="false"-->
        <!--:before-upload="importText">-->
        <!--<Button @click="setUploadTxtType('docx')"-->
        <!--type="dashed"-->
        <!--size="small"-->
        <!--icon="social-markdown">-->
        <!--导入Word-->
        <!--</Button>-->
        <!--</Upload>-->
        <Upload action="#"
                accept="text/plain"
                :show-upload-list="false"
                :before-upload="importText">
          <Button @click="setUploadTxtType('txt')"
                  type="dashed"
                  size="small"
                  icon="android-document">
            导入文本文档
          </Button>
        </Upload>
      </span>
    </div>
    <mavon-editor ref="md"
                  :value="value"
                  @imgAdd="$imgAdd"
                  @imgDel="$imgDel"
                  :ishljs="ishljs"
                  :toolbars="toolbars"
                  style="min-height: 100vh"/>
  </Card>
</template>
<script>
  import 'mavon-editor/dist/css/index.css';

  export default {
    name: 'markdown-editor',
    props: ['title', 'label', 'description'],
    data () {
      return {
        value: '',
        img_file: {},
        uploadTxtType: 'txt',
        uploadConfig: {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        },
        ishljs: true,
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: false, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: false, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true, // 单双栏模式
          preview: true // 预览
        }
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
      $imgAdd (pos, $file) {
        this.img_file[pos] = $file;
      },
      $imgDel (pos) {
        delete this.img_file[pos];
      },
      uploadImg (id) {
        let formData = new FormData();
        formData.append('blog_id', id);
        for (let _img in this.img_file) {
          formData.append(_img, this.img_file[_img]);
        }
        this.$ajax.post('/api/blog/imgupload', formData, this.uploadConfig)
          .catch(function (e) {
            console.log(e);
          });
      },
      setUploadTxtType (type) {
        this.uploadTxtType = type;
      },
      importText (file) {
        let _this = this;
        let formData = new FormData();
        formData.append('type', this.uploadTxtType);
        formData.append('file', file);

        this.$ajax.post('/api/blog/import', formData, this.uploadConfig)
          .then(function (res) {
            _this.$Message.success(res.data.msg);
            _this.value = _this.$refs.md.d_value + res.data.content;
          })
          .catch(function (e) {
            console.log(e);
          });
        return false;
      },
      submit () {
        let submitData = {
          type: 'project',
          title: this.title,
          description: this.description,
          content: this.$refs.md.d_value,
          cover_url: '',
          photo_url: '',
          author_id: JSON.parse(window.localStorage.user).school_id
        };
        if (!submitData.title || !submitData.description || !submitData.content) {
          this.$Message.info('请将空余内容补充完整');
        } else {
          const _this = this;
          // publish the article
          this.$ajax.post('/api/blog/publish', submitData)
            .then(function (res) {
              if (!(JSON.stringify(_this.img_file) === '{}')) {
                _this.uploadImg(res.data.blog_id);
              }
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
  @import "../../styles/articles-compose-markdown";
</style>
