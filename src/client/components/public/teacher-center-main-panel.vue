<template>
  <div class="teacher-center-main-panel">
    <div class="main-panel-header">
      <div class="main-panel-left">
        <Card disHover>
          <span slot="title">
            <span class="main-panel-card-header">
              <strong>我的班级</strong>
              <Button @click="parseClass()" type="text" size="small">导 入</Button>
            </span>
          </span>
          <transition name="fade">
            <div class="class-import-container" v-if="classParse">
              <div class="class-import-header">
                <span>
                  <strong>导入班级</strong>
                  <transition>
                    <span v-if="uploadData.file === null">&emsp;未选择文件</span>
                  </transition>
                  <transition name="fade">
                    <span v-if="uploadData.file !== null">&emsp;文件名 : {{ uploadData.file.name }}</span>
                  </transition>
                </span>
                <span>
                  <Button type="text" size="small" @click="parseClassCancel()">取 消</Button>
                  <Button type="primary" size="small" @click="parseClassData()">提 交</Button>
                </span>
              </div>
              <div class="class-import-body">
                <div class="class-import-left">
                  <Upload action="#"
                          :accept="'application/vnd.ms-excel'"
                          :data="uploadData"
                          :before-upload="handleUpload">
                    <Button type="primary" size="large" icon="ios-cloud-upload-outline">&emsp;选择文件&emsp;</Button>
                  </Upload>
                </div>
                <div class="class-import-right">
                  <p>
                    <Icon type="information-circled"></Icon>&emsp;
                    上传教务系统里下载的教学班点名册以导入班级与学生信息
                  </p>
                </div>
              </div>
            </div>
          </transition>
          <div class="class-list">
            <Table :columns="classCols" :data="classData" style="min-width: 850px" stripe></Table>
          </div>
          <Modal
            v-model="classImport"
            title="确认班级信息"
            width="80"
            @on-ok="importClassData()"
            @on-cancel="importClassCancel()">
            <div class="class-import-validate-container" v-model="classParseData">
              <div class="class-import-validate-info">
                <p>
                  <Icon type="information-circled"></Icon>&emsp;
                  请确认班级与学生信息，确认无误后点击确定按钮来导入或更新信息 (若学生用户已存在，则将会更新当前选课课号)
                </p>
              </div>
              <div class="validate-class-data">
                <Table :columns="classParseData.classData.cols" :data="classParseData.classData.data" stripe></Table>
              </div>
              <div class="validate-students">
                <Table :columns="classParseData.students.cols" :data="classParseData.students.data" stripe></Table>
              </div>
            </div>
          </Modal>
        </Card>
      </div>
      <div class="main-panel-right">
        <Card disHover>
          <span slot="title">
            <span class="main-panel-card-header">
              <strong>我的资料</strong>
              <Button @click="" type="text" size="small">管 理</Button>
            </span>
          </span>
          <div class="teacher-profile" v-model="teacherProfile">
            <span><strong><Icon type="person"></Icon>&nbsp;{{teacherProfile.name}}</strong>&emsp;<em>导 师</em>&emsp;&emsp;</span>
            <span>
              <Icon type="card"></Icon>&emsp;{{teacherProfile.school_id}}
            </span>
          </div>
        </Card>
      </div>
    </div>
    <div class="main-panel-body">
      学生动态（计划）
    </div>
  </div>
</template>

<script>
  export default {
    name: 'teacher-center-main-panel',
    data () {
      return {
        classParse: false,
        classImport: false,
        classParseData: {
          classData: {
            cols: [
              {
                title: '选课课号',
                key: 'class_id'
              },
              {
                title: '课程名称',
                key: 'cname',
                width: 120
              },
              {
                title: '学 年',
                key: 'year',
                width: 120
              },
              {
                title: '学 期',
                key: 'term',
                width: 70
              },
              {
                title: '上课时间',
                key: 'time'
              },
              {
                title: '上课地点',
                key: 'loc'
              }
            ],
            data: []
          },
          students: {
            cols: [
              {
                title: '学 号',
                key: 'school_id',
                width: 150,
                sortable: true
              },
              {
                title: '姓 名',
                key: 'name',
                width: 120
              },
              {
                title: '选课课号',
                key: 'cur_class'
              },
              {
                title: '班级号',
                key: 'class_id',
                width: 150
              },
              {
                title: '年 级',
                key: 'grade',
                width: 120
              },
              {
                title: '导 师',
                key: 'supervisor',
                width: 120
              }
            ],
            data: []
          }
        },
        uploadData: {
          file: null
        },
        uploadConfig: {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        },
        teacherProfile: {
          name: '',
          school_id: ''
        },
        classCols: [
          {
            title: '选课课号',
            key: 'class_id'
          },
          {
            title: '课程名称',
            key: 'cname',
            width: 120
          },
          {
            title: '学 年',
            key: 'year',
            width: 120,
            sortable: true
          },
          {
            title: '学 期',
            key: 'term',
            width: 70
          },
          {
            title: '上课时间',
            key: 'time'
          },
          {
            title: '上课地点',
            key: 'loc'
          },
          {
            title: '状 态',
            key: 'status',
            width: 75,
            render: (h, params) => {
              return h('div', [
                h('strong', {
                  style: {
                    color: '#999999'
                  }
                }, params.row.status)
              ]);
            }
          }
          // {
          //   title: '操 作',
          //   key: 'action',
          //   width: 150,
          //   align: 'center',
          //   render: (h, params) => {
          //     return h('div', [
          //       h('Button', {
          //         props: {
          //           type: 'primary',
          //           size: 'small'
          //         },
          //         style: {
          //           marginRight: '5px'
          //         },
          //         on: {
          //           click: () => {
          //             // this.modifyPlan(params.row);
          //           }
          //         }
          //       }, '编 辑')
          //     ]);
          //   }
          // }
        ],
        classData: []
      };
    },
    methods: {
      parseClass () {
        this.classParse = true;
      },
      parseClassCancel () {
        this.$Message.info('导入班级取消');
        this.classParse = false;
      },
      importClassCancel () {
        this.$Message.info('导入班级取消');
        this.classImport = false;
      },
      handleUpload (file) {
        this.uploadData.file = file;
        return false;
      },
      parseClassData () {
        if (this.uploadData.file === null) {
          this.$Message.info('请将文件上传信息补充完整');
          return;
        }
        let _this = this;
        let formData = new FormData();
        formData.append('file', this.uploadData.file);
        console.log(this.uploadData.file);

        this.$ajax.post('/api/user/parse', formData, this.uploadConfig)
          .then(function (res) {
            if (res.data.status === 1300) {
              _this.$Message.success(res.data.msg);
              _this.uploadData.file = null;
              _this.classParseData.classData.data.push(res.data.classData);
              _this.classParseData.students.data = res.data.userArr;
              _this.classImport = true;
            } else {
              _this.$Message.error(res.data.msg);
            }
            _this.classParse = false;
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      importClassData () {
        let _this = this;
        this.$ajax.post('/api/user/import', {
          teacher_id: JSON.parse(window.localStorage.user).school_id,
          classData: this.classParseData.classData.data[0],
          userArr: this.classParseData.students.data
        })
          .then(function (res) {
            _this.$Message.success(res.data.msg);
            _this.classParseData.classData.data = [];
            _this.classParseData.students.data = [];
            _this.classImport = false;
            _this.refreshData();
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      refreshData () {
        this.teacherProfile = JSON.parse(window.localStorage.user);
        let _this = this;
        this.$ajax.post('/api/class/query', {
          request: this.teacherProfile.school_id
        })
          .then(function (res) {
            if (res.data.status === 6000) {
              _this.classData = res.data.classArr;
            }
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

<style>
  @import '../../styles/teacher-center-main-panel.css';
</style>
