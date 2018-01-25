<template>
  <div id="final-container" class="m-final">
    <div class="m-final none" v-if="!fileExists">
      <em>期末作业未上传</em>&emsp;
      <span>
        <Upload class="button"
                action="#"
                :data="uploadData"
                :before-upload="handleUpload">
          <Button type="dashed" icon="ios-cloud-upload-outline">选择并上传</Button>
        </Upload>
      </span>
    </div>
    <div class="m-final exist" v-else>
      <em>期末作业已上传</em>&emsp;
      <span>
        <Button type="success" size="small">下 载</Button>
        <Button type="ghost" size="small" :disabled="cswkData.rate">更 改</Button>
        <Button type="error" size="small" :disabled="cswkData.rate">删 除</Button>
      </span>
      <span class="m-final rate" v-model="cswkData">
        <strong>
          评 级：&nbsp;
          <span v-if="cswkData.rate">{{cswkData.rate}}</span>
          <em v-else>未确定</em>
        </strong>
        <strong>
          评 语：&nbsp;
          <span v-if="cswkData.remark">{{cswkData.remark}}</span>
          <em v-else>未确定</em>
        </strong>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'user-center-final',
    data () {
      return {
        cur_class: '',
        school_id: '',
        fileExists: false,
        uploadData: {
          file: null
        },
        cswkData: {},
        uploadConfig: {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      };
    },
    methods: {
      refreshData () {
        let _this = this;
        const user = JSON.parse(window.localStorage.user);
        this.cur_class = user.cur_class;
        this.school_id = user.school_id;
        this.$ajax.post('/api/final/query', {
          class_id: this.cur_class,
          student_id: this.school_id
        })
          .then(function (res) {
            _this.cswkData = res.data[0];
            if (res.data[0].cswk_src) {
              _this.fileExists = true;
            }
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      handleUpload (file) {
        this.uploadData.file = file;
        this.submitFile();
        return false;
      },
      submitFile () {
        let _this = this;
        let formData = new FormData();
        formData.append('class_id', this.cur_class);
        formData.append('student_id', this.school_id);
        formData.append('file', this.uploadData.file);

        this.$ajax.post('/api/final/upload', formData, this.uploadConfig)
          .then(function () {
            _this.refreshData();
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
  @import "../../styles/user-center-final";
</style>
