<template>
  <mavon-editor :ishljs="ishljs" :toolbars="toolbars"></mavon-editor>
</template>
<script>
  import 'mavon-editor/dist/css/index.css';

  export default {
    name: 'md-editor',
    props: ['title', 'label', 'description'],
    data () {
      return {
        img_file: {},
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
      $imgAdd (pos, $file) {
        this.img_file[pos] = $file;
      },
      $imgDel (pos) {
        delete this.img_file[pos];
      },
      uploadimg ($e) {
        // upload files in one request.
        console.log(this.img_file);
        let formdata = new FormData();
        for (let _img in this.img_file) {
          formdata.append(_img, this.img_file[_img]);
        }
//        this.$ajax({
//          url: 'http://127.0.0.1/index.php',
//          method: 'post',
//          data: formdata,
//          headers: {'Content-Type': 'multipart/form-data'}
//        }).then((res) => {
//          console.log(res);
//        });
      },
      submit () {
        let submitData = {
          type: 'project',
          title: this.title,
          description: this.description,
          content: this.$children[0].d_render,
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
    }
  };
</script>

<style>
  .v-note-wrapper {
    min-height: 100vh;
    z-index: 1;
  }
</style>
