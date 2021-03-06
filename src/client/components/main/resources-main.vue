<template>
  <div class="g-resources">
    <div class="g-resources nav">
      <Menu mode="horizontal" theme="dark">
        <div class="m-nav">
          <MenuItem name="1">
            <span @click="editFile()">
              <Icon type="upload"></Icon>&emsp;上传文件
            </span>
          </MenuItem>
        </div>
      </Menu>
    </div>
    <Card disHover class="g-body">
      <div class="g-resources body">
        <transition name="fade">
          <div v-if="uploadPanel" class="m-upload">
            <div class="m-upload header">
              <span>
                <strong>上传文件</strong>&emsp;
                <transition>
                  <span v-if="uploadData.file === null">&emsp;未选择文件</span>
                </transition>
                <transition name="fade">
                  <span v-if="uploadData.file !== null">&emsp;文件名 : {{ uploadData.file.name }}</span>
                </transition>
              </span>
              <span>
                <Button type="text" size="small" @click="editFileCancel()">取 消</Button>
                <Button type="primary" size="small" @click="submitFile()">提 交</Button>
              </span>
            </div>
            <div class="m-upload body">
              <div class="m-upload body op">
                <span class="m-left m-left-category">
                  <Select placeholder="资源文件分类..." size="large" v-model="uploadData.group">
                    <Option v-for="type in uploadGroupList" :value="type.label" :key="type.index">
                      {{ type.label }}
                    </Option>
                  </Select>
                </span>
                <span class="m-left m-left-select">
                  <Upload class="button"
                          action="#"
                          :data="uploadData"
                          :before-upload="handleUpload">
                    <Button type="primary" size="large" icon="ios-cloud-upload-outline">&emsp;选择文件&emsp;</Button>
                  </Upload>
                </span>
                <span class="m-right">
                    <i-input type="text"
                             size="large"
                             v-model="uploadData.desc"
                             placeholder="文件描述..."
                             style="width: 100%">
                    </i-input>
                </span>
              </div>
              <div class="g-label-select">
                <span v-for="(label, index) in labelSelect" :key="label.label_id">
                  <Tag closable
                       type="dot"
                       @on-close="delLabel(label)"
                       :name="index"
                       :color="label.category === 'both' ? 'blue' : (label.category === 'blog' ? 'green' : 'yellow')">
                      {{label.name}}
                  </Tag>
                </span>
              </div>
              <div class="m-upload body labels">
                <label-selector ref="labels"
                                :type="'file'"
                                :labelList="labelList"
                                :selectList="labelSelect"
                                @changeLabels="changeLabels"/>
              </div>
            </div>
          </div>
        </transition>
        <div class="g-labels">
          <span class="m-labels">
            <span class="m-label m-label-fixed">
              <strong>分 组&nbsp;<Icon type="arrow-right-a"></Icon></strong>
            </span>
            <span class="m-label m-label-inline">
              <span class="m-label" v-for="group in groupList" :key="group.index">
                <Button @click="getArticleList({group: group.label})"
                        size="small"
                        type="warning">
                  <strong>{{group.label}}</strong>
                </Button>
              </span>
            </span>
          </span>
          <span class="m-labels m-labels-right">
            <span class="m-label m-label-inline">
              <span class="m-label m-label-right" v-for="label in labelList" :key="label.label_id">
                <Button @click="getArticleList({labels: label.label_id})"
                        size="small"
                        :type="label.category === 'both'
                          ? 'success' : (label.category === 'blog' ? 'primary' : 'warning')">
                  <strong>{{label.name}}</strong>
                </Button>
              </span>
            </span>
            <span class="m-label m-label-fixed">
              <strong><Icon type="arrow-left-a"></Icon>&nbsp;标 签</strong>
            </span>
          </span>
        </div>
        <Table stripe :columns="resourceTableColumns" :data="resourceList"></Table>
      </div>
      <div class="g-page">
        <Page size="small" :total="count"></Page>
      </div>
    </Card>
    <iframe id="fileDownloadTmpFrame" style="display: none"></iframe>
  </div>
</template>

<script>
  import labelSelector from '../public/label-select';

  export default {
    name: 'resources-main',
    components: {
      labelSelector
    },
    data () {
      return {
        count: 0,
        uploadPanel: false,
        uploadConfig: {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        },
        uploadData: {
          group: '',
          desc: '',
          labels: '',
          file: null
        },
        uploadGroupList: [
          {
            index: 0,
            label: '学习资料',
            value: 'studies'
          },
          {
            index: 1,
            label: '专业论文',
            value: 'theses'
          },
          {
            index: 2,
            label: '通 知',
            value: 'notices'
          },
          {
            index: 3,
            label: '其 他',
            value: 'others'
          }
        ],
        groupList: [
          {
            index: 0,
            label: '所有资源',
            value: 'all'
          },
          {
            index: 1,
            label: '学习资料',
            value: 'studies'
          },
          {
            index: 2,
            label: '专业论文',
            value: 'theses'
          },
          {
            index: 3,
            label: '通 知',
            value: 'notices'
          },
          {
            index: 4,
            label: '其 他',
            value: 'others'
          }
        ],
        resourceTableColumns: [
          {
            title: '文件名',
            key: 'filename'
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
            sortable: true
          },
          {
            title: '分 组',
            key: 'group',
            sortable: true,
            width: 120
          },
          {
            title: '文件描述',
            key: 'description',
            render: (h, params) => {
              let labels = params.row.labels;
              let labelViews = [];
              for (let i = 0; i < labels.length; i++) {
                labelViews.push(
                  h('Tag', {
                    props: {
                      type: 'border',
                      size: 'small',
                      color: labels[i].category === 'both'
                        ? 'blue'
                        : (labels[i].category === 'blog' ? 'green' : 'yellow')
                    }
                  }, labels[i].name)
                );
              }
              return h('div', [
                h('span', labelViews),
                h('span', ' ' + params.row.description)
              ]);
            }
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
                  on: {
                    click: () => {
                      this.downloadFile(params.row.url);
                    }
                  }
                }, '下 载')
              ]);
            }
          }
        ],
        resourceList: [],
        labelSelect: [],
        labelList: []
      };
    },
    methods: {
      editFile () {
        this.uploadPanel = true;
      },
      editFileCancel () {
        this.uploadPanel = false;
        this.labelSelect = [];
        this.uploadData = {
          group: '',
          desc: '',
          labels: '',
          file: null
        };
      },
      handleUpload (file) {
        this.uploadData.file = file;
        return false;
      },
      fileSizeFormat (size) {
        return size >= 1048576
          ? (size / 1048576).toFixed(1) + ' MB'
          : (size / 1024).toFixed(1) + ' KB';
      },
      stringifyLabels () {
        let labels = [];
        for (let i = 0; i < this.labelSelect.length; i++) {
          labels.push(this.labelSelect[i].label_id);
        }
        return labels.toString();
      },
      changeLabels (labelSelect) {
        this.labelSelect = labelSelect;
        this.uploadData.labels = this.stringifyLabels();
      },
      delLabel (label) {
        const index = this.labelSelect.indexOf(label);
        this.labelSelect.splice(index, 1);
        this.uploadData.labels = this.stringifyLabels();
      },
      submitFile () {
        if (this.uploadData.file === null ||
          !this.uploadData.desc ||
          !this.uploadData.group ||
          !this.uploadData.labels
        ) {
          this.$Message.info('请将文件上传信息补充完整');
          return;
        }
        let _this = this;
        let formData = new FormData();
        formData.append('file', this.uploadData.file);
        formData.append('group', this.uploadData.group);
        formData.append('labels', this.uploadData.labels);
        formData.append('school_id', JSON.parse(window.localStorage.user).school_id);
        formData.append('descriptions', this.uploadData.desc);

        this.$ajax.post('/api/file/upload', formData, this.uploadConfig)
          .then(function (res) {
            _this.$Message.success(res.data.msg);
            _this.uploadPanel = false;
            _this.labelSelect = [];
            _this.uploadData = {
              group: '',
              desc: '',
              labels: '',
              file: null
            };
            _this.refreshFileList();
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      downloadFile (url) {
        let a = document.getElementById('fileDownloadTmpFrame');
        a.src = url;
        this.$Message.success('文件下载成功');
      },
      getLabel (index) {
        let labelList = this.labelList;
        for (let i = 0; i < labelList.length; i++) {
          if (labelList[i].label_id.toString() === index.toString()) {
            return {
              name: labelList[i].name,
              category: labelList[i].category
            };
          }
        }
        return null;
      },
      parseLabel (labels) {
        let res = [];
        let labelIds = labels.toString().split(',');
        for (let i = 0; i < labelIds.length; i++) {
          let label = this.getLabel(labelIds[i]);
          if (label !== null) {
            res.push(label);
          }
        }
        return res;
      },
      parseLabels () {
        let list = this.resourceList;
        for (let i = 0; i < list.length; i++) {
          list[i].labels = this.parseLabel(list[i].labels);
        }
        this.resourceList = list;
      },
      getLabelList () {
        let _this = this;
        this.$ajax.post('/api/label/query', {
          type: 'file'
        })
          .then(function (res) {
            _this.labelList = res.data;
            _this.parseLabels();
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      refreshFileList (mode) {
        let _this = this;
        let request = mode || 'all';
        this.$ajax.post('/api/file/query', {
          request: request
        })
          .then(function (res) {
            _this.resourceList = res.data;
            _this.count = res.data.length;
            _this.getLabelList();
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

<style scoped lang="scss">
  @import '../../styles/resources';
</style>
