<template>
  <div class="resources-main">
    <Card disHover>
      <span slot="title" class="resources-main-header">
        <span><strong>资源共享</strong></span>
        <span><Button type="primary" size="small" @click="editFile()">上 传</Button></span>
      </span>
      <!--<div class="resource-unit" v-for="resource in resourceList" :key="resource.id">-->
      <!--<span class="resource-title">-->
      <!--<Button type="text" size="large" @click="revealDetails(resource.id)">-->
      <!--<strong>{{resource.title}}</strong>-->
      <!--</Button>-->
      <!--</span>-->
      <!--<span class="resource-details">-->
      <!--<span class="resource-info">-->
      <!--<Icon type="ios-person-outline"></Icon>&nbsp;{{resource.profile.name}}&emsp;-->
      <!--<Icon type="ios-clock-outline"></Icon>&nbsp;{{resource.publishTime}}&emsp;-->
      <!--</span>-->
      <!--<span class="resource-desc">-->
      <!--<Icon type="ios-star-outline"></Icon>&nbsp;-->
      <!--<p>{{resource.description}}</p>-->
      <!--</span>-->
      <!--</span>-->
      <!--</div>-->
      <div class="resource-body">
        <transition name="fade">
          <div v-if="uploadPanel" class="resource-upload">
            <div class="file-edit-header">
              <span>
                <strong>上传文件</strong>&emsp;
                <transition name="fade">
                    <span v-if="uploadData.file !== null">&emsp;文件名 : {{ uploadData.file.name }}</span>
                </transition>
              </span>
              <span>
                <Button type="text" size="small" @click="editFileCancel()">取 消</Button>
                <Button type="primary" size="small" @click="submitFile()">提 交</Button>
              </span>
            </div>
            <div class="file-edit-body">
                <span class="file-edit-left">
                  <Upload class="file-edit-button"
                          action="#"
                          :data="uploadData"
                          :before-upload="handleUpload">
                    <Button type="primary" size="large" icon="ios-cloud-upload-outline">&emsp;选择文件&emsp;</Button>
                  </Upload>
                </span>

              <span class="file-edit-right">
                  <i-input type="text" size="large" v-model="uploadData.desc" placeholder="文件描述..."></i-input>
                </span>

            </div>
          </div>
        </transition>
        <Table stripe :columns="resourceTableColumns" :data="resourceList"></Table>
      </div>
      <div class="resource-page">
        <Page size="small"></Page>
      </div>

    </Card>
  </div>
</template>

<script>
  export default {
    name: 'resources-main',
    data () {
      return {
        uploadPanel: false,
        uploadConfig: {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        },
        uploadData: {
          school_id: JSON.parse(window.localStorage.user).school_id,
          desc: '',
          file: null
        },
        resourceTableColumns: [
          {
            title: '文件名',
            key: 'filename',
            width: 150
          },
          {
            title: '上传者',
            key: 'profile',
            sortable: true,
            width: 100,
            render: (h, params) => {
              return h('div', params.row.profile.name);
            }
          },
          {
            title: '文件大小',
            key: 'size',
            sortable: true,
            width: 110,
            render: (h, params) => {
              return h('div', this.fileSizeFormat(params.row.size));
            }
          },
          {
            title: '上传时间',
            key: 'uploadTime',
            sortable: true,
            width: 180
          },
          {
            title: '文件描述',
            key: 'description'
          },
          {
            title: '操 作',
            key: 'ops',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index);
                    }
                  }
                }, '下 载')
              ]);
            }
          }
        ],
        resourceList: []
      };
    },
    methods: {
      editFile () {
        this.uploadPanel = true;
      },
      editFileCancel () {
        this.$Message.info('文件上传取消');
        this.uploadPanel = false;
        this.uploadData.desc = '';
        this.uploadData.file = null;
      },
      handleUpload (file) {
        this.uploadData.file = file;
        return false;
      },
      fileSizeFormat (size) {
        return (size / 1048576).toFixed(1) + ' MB';
      },
      submitFile () {
        if (this.uploadData.file === null || this.uploadData.desc === '') {
          this.$Message.info('请将文件上传信息补充完整');
          return;
        }
        let _this = this;
        let formData = new FormData();
        formData.append('file', this.uploadData.file);
        formData.append('school_id', this.uploadData.school_id);
        formData.append('descriptions', this.uploadData.desc);

        this.$ajax.post('/api/file/upload', formData, this.uploadConfig)
          .then(function (res) {
            _this.$Message.success(res.data.msg);
            _this.uploadData.desc = '';
            _this.uploadData.file = null;
            _this.refreshFileList();
          })
          .catch(function (e) {
            console.log(e);
          });

        console.log(this.uploadData);
      },
      // downloadFile () {
      //
      // },
      refreshFileList () {
        let _this = this;
        this.$ajax.post('/api/file/query', {
          request: 'all'
        })
          .then(function (res) {
            _this.resourceList = res.data;
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    },
    mounted () {
      this.refreshFileList();
    }
  };
</script>

<style>
  @import '../../styles/resources.css';
</style>
