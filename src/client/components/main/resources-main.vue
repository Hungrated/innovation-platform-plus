<template>
  <div class="resources-main">
    <Card disHover>
      <span slot="title" class="resources-main-header">
        <span><strong>资源共享</strong></span>
        <span><Button type="primary" size="small" @click="showUploadPanel">上 传</Button></span>
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
            upload
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
        uploadData: {
          file: null,
          desc: ''
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
      showUploadPanel () {
        this.uploadPanel = true;
      },
      fileSizeFormat (size) {
        return (size / 1048576).toFixed(2) + ' MB';
      },
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
