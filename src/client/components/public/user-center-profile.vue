<template>
  <div id="profile-container" class="profile-container">
    <div class="profile-avatar">
      <img :src="profile.avatar">
    </div>
    <div class="profile-info">
      <p class="profile-info-unit profile-info-name"><strong>{{profile.name}}</strong></p>
      <p class="profile-info-unit">{{profile.academy}}&emsp;{{profile.grade}}级&emsp;{{profile.class_id}}班</p>
      <p class="profile-info-unit profile-info-sub">导 师：{{profile.supervisor}}</p>
      <hr><br>
      <p class="profile-info-unit profile-info-sub">{{profile.school_id}}</p>
      <p class="profile-info-unit profile-info-sub">{{profile.phone_num}}</p>
      <p class="profile-info-unit profile-info-sub">{{profile.description}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'user-center-profile',
    data () {
      return {
        profile: {
          school_id: 14051531,
          avatar: require('../../assets/avatar.jpg'),
          name: '章梓航',
          sex: '男',
          academy: '计算机学院',
          class_id: '14052313',
          grade: '2014',
          supervisor: '邬惠峰',
          birth_date: '1996-4-29',
          phone_num: '13588096570',
          description: 'A Dream Pursuer'
        }
      };
    },
    methods: {
      refreshData () {
        let _this = this;
        const schoolId = JSON.parse(window.localStorage.user).school_id;
        this.$ajax.post('/api/profile/getinfo', {
          request: schoolId
        })
          .then(function (res) {
            _this.profile = res.data[0];
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      edit () {
        console.log('editprofile');
      }
    },
    mounted () {
      this.refreshData();
    }
  };
</script>
