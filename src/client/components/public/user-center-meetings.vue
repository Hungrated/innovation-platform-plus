<template>
  <div id="meeting-container" class="meeting-container">
    <div class="meeting-list" v-if="!meetingEmpty">
      <Table :columns="meetingCols" :data="meetingData" style="min-width: 800px" stripe></Table>
    </div>
    <div class="meeting-empty" v-if="meetingEmpty">
      <span><strong>当前暂无课堂记录</strong></span>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        meetingEmpty: false,
        meetingCols: [
          {
            title: '日 期',
            key: 'date',
            width: 120,
            sortable: true
          },
          {
            title: '内 容',
            key: 'content'
          }
        ],
        meetingData: []
      };
    },
    methods: {
      date (time) {
        let curTime = time;
        let convert = function (digit) {
          if (digit < 10) return '0' + digit;
          else return digit.toString();
        };
        let year = curTime.getFullYear();
        let month = convert(curTime.getMonth() + 1);
        let day = convert(curTime.getDate());
        return year + '-' + month + '-' + day;
      },
      refreshMeetingList () {
        let _this = this;
        this.$ajax.post('/api/meeting/query', {
          student_id: JSON.parse(window.localStorage.user).school_id,
          cur_class: JSON.parse(window.localStorage.user).cur_class
        })
          .then(function (res) {
            if (res.data.length) {
              _this.meetingEmpty = false;
            }
            _this.meetingData = res.data;
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    },
    mounted () {
      this.refreshMeetingList();
    }
  };
</script>
