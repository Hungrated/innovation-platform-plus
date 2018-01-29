<template>
  <div>
    eventEditor
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
    }
  };
</script>
