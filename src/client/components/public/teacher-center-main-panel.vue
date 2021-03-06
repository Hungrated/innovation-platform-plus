<template>
  <div class="g-panel">
    <div class="g-panel header">
      <div class="g-panel left">
        <Card disHover>
          <span slot="title">
            <span class="g-panel header-card">
              <strong>我的班级</strong>
              <Button @click="parseClass()" type="dashed" size="small">
                <Icon type="plus"></Icon>&emsp;导 入
              </Button>
            </span>
          </span>
          <transition name="fade">
            <div class="m-import" v-if="classParse">
              <div class="m-import header">
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
              <div class="m-import body">
                <div class="m-import body left">
                  <Upload action="#"
                          :accept="'application/vnd.ms-excel'"
                          :data="uploadData"
                          :before-upload="handleUpload">
                    <Button type="primary" size="large" icon="ios-cloud-upload-outline">&emsp;选择文件&emsp;</Button>
                  </Upload>
                </div>
                <div class="m-import body right">
                  <p>
                    <Icon type="information-circled"></Icon>&emsp;
                    上传教务系统里下载的教学班点名册以导入班级与学生信息
                  </p>
                </div>
              </div>
            </div>
          </transition>
          <div class="m-classes">
            <Table :columns="classCols" :data="classData" style="min-width: 766px" stripe></Table>
          </div>
          <Modal
            v-model="classImport"
            title="确认班级信息"
            width="80"
            @on-ok="importClassData()"
            @on-cancel="importClassCancel()">
            <div class="m-validate" v-model="classParseData">
              <div class="m-validate info">
                <p>
                  <Icon type="information-circled"></Icon>&emsp;
                  请确认班级与学生信息，确认无误后点击确定按钮来导入或更新信息 (若学生用户已存在，则将会更新当前选课课号)
                </p>
              </div>
              <div class="m-validate data">
                <Table :columns="classParseData.classData.cols" :data="classParseData.classData.data"
                       style="min-width: 800px" stripe></Table>
              </div>
              <div class="m-validate stu">
                <Table :columns="classParseData.students.cols" :data="classParseData.students.data" style="min-width:
                 800px" stripe></Table>
              </div>
            </div>
          </Modal>
        </Card>
      </div>
    </div>
    <div class="g-panel body">
      <Timeline>
        <Card disHover>
        <span slot="title">
          <span class="g-panel header-card">
            <strong>学生计划动态</strong>
          </span>
        </span>
          <p v-if="moments.length === 0" style="text-align: center">暂无动态哦</p>
          <div class="m-moment" v-else>
            <TimelineItem v-for="moment in moments" :key="moment.moment_id">
              <div v-if="moment.type === 'planmod'" class="m-moment item">
                <div class="m-moment item time">{{ getTime(moment.created_at) }}</div>
                <div>
                  <Icon type="ios-lightbulb"></Icon>&nbsp;
                  <strong>{{moment.profile.name}}</strong>&nbsp;：
                  <span>{{moment.desc}}</span>
                </div>
                <div v-if="moment.extras.status !== ''">
                  <strong v-if="moment.extras.status !== '未审核'"
                          class="m-moment item status">{{moment.extras.status}}</strong>
                  <span v-else class="m-moment item">
                    <strong class="m-moment item status">未审核</strong>
                    <span>
                      <Button @click="verifyPlan(moment.uid, 1)" type="success" size="small">
                      <Icon type="checkmark"></Icon> 通 过
                    </Button>
                    <Button @click="verifyPlan(moment.uid, 0)" type="error" size="small">
                      <Icon type="close"></Icon>
                    </Button>
                    </span>
                  </span>
                </div>
              </div>
            </TimelineItem>
          </div>
        </Card>
      </Timeline>
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
        ],
        classData: [],
        moments: []
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
      },
      fetchMoments () {
        let _this = this;
        this.$ajax.get('/api/moment/fetch?type=planmod&limit=40')
          .then(function (res) {
            _this.moments = res.data;
            for (let i = 0; i < res.data.length; i++) {
              _this.moments[i].extras = JSON.parse(res.data[i].extras);
            }
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      getTime (createdAt) {
        let curTime = new Date(createdAt);
        let convert = function (digit) {
          if (digit < 10) return '0' + digit;
          else return digit.toString();
        };
        let year = curTime.getFullYear();
        let month = convert(curTime.getMonth() + 1);
        let day = convert(curTime.getDate());
        return year + '-' + month + '-' + day;
      },
      verifyPlan (id, op) {
        let _this = this;
        this.$ajax.post('/api/plan/op', {
          plan_id: id,
          op: op
        })
          .then(function (res) {
            _this.fetchMoments();
            _this.$Message.success(res.data.msg);
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    },
    mounted () {
      this.refreshData();
      this.fetchMoments();
    }
  };
</script>

<style scoped lang="scss">
  @import '../../styles/teacher-center-main-panel';
</style>
