<template>
  <div id="profile-container" class="profile-container">
    <div class="profile-avatar">
      <img style="width: 100%; border-radius: 5px;" :src="profile.avatar">
    </div>
    <div class="profile-info">
      <p class="profile-info-unit profile-info-name">
        <strong>{{profile.name}}</strong>
        <Icon v-if="profile.sex && profile.sex === '男'" style="font-size: 20px;color: #999999" type="male"></Icon>
        <Icon v-if="profile.sex && profile.sex === '女'" style="font-size: 20px;color: #999999" type="female"></Icon>
      </p>
      <p class="profile-info-unit">
        <Icon type="university"></Icon>&emsp;{{profile.academy}} {{profile.grade}}级 {{profile.class_id}}班
      </p>
      <p class="profile-info-unit profile-info-sub">
        <Icon type="card"></Icon>&emsp;
        {{profile.school_id}}
      </p>
      <p class="profile-info-unit profile-info-sub">
        <Icon type="person-stalker"></Icon>&emsp;
        导 师：{{profile.supervisor}}
      </p>
      <hr>
      <br>
      <p class="profile-info-unit profile-info-sub">
        <Icon type="ios-body"></Icon>&emsp;
        <em v-if="!profile.birth_date">待完善信息</em>
        {{profile.birth_date}}
      </p>
      <p class="profile-info-unit profile-info-sub">
        <Icon type="ios-telephone"></Icon>&emsp;
        <em v-if="!profile.phone_num">待完善信息</em>
        {{profile.phone_num}}
      </p>
      <p class="profile-info-unit profile-info-sub">
        <Icon type="ios-lightbulb"></Icon>&emsp;
        <em v-if="!profile.description">待完善信息</em>
        {{profile.description}}
      </p>
    </div>
    <Modal v-model="profileMng" title="编辑资料" @on-ok="profileSubmit()" @on-cancel="refreshData()">
      <div class="profile-edit">
        <div class="profile-edit-left">
          <img style="width: 100%; border-radius: 5px;" :src="profile.avatar">
        </div>
        <div class="profile-edit-right">
          <p class="profile-info-unit profile-info-name">
            <strong>{{profile.name}}</strong>
          </p>
          <div style="margin-bottom: 10px">
            <RadioGroup v-model="profile.sex">
              <Radio label="男">
                <Icon type="male"></Icon>
                <span>男</span>
              </Radio>
              <Radio label="女">
                <Icon type="female"></Icon>
                <span>女</span>
              </Radio>
            </RadioGroup>
          </div>
          <p class="profile-info-unit">
            <Icon type="university"></Icon>&emsp;{{profile.academy}} {{profile.grade}}级 {{profile.class_id}}班
          </p>
          <p class="profile-info-unit profile-info-sub">
            <Icon type="card"></Icon>&emsp;
            {{profile.school_id}}
          </p>
          <p class="profile-info-unit profile-info-sub">
            <Icon type="person-stalker"></Icon>&emsp;
            导 师：{{profile.supervisor}}
          </p>
          <i-input class="profile-edit-input" type="text" v-model="profile.birth_date" placeholder="出生日期">
            <Icon type="ios-body-outline" slot="prepend"></Icon>
          </i-input>
          <i-input class="profile-edit-input" type="text" v-model="profile.phone_num" placeholder="电话号码">
            <Icon type="ios-telephone-outline" slot="prepend"></Icon>
          </i-input>
          <i-input class="profile-edit-input" type="text" v-model="profile.description" placeholder="自 述">
            <Icon type="ios-lightbulb-outline" slot="prepend"></Icon>
          </i-input>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'user-center-profile',
    data () {
      return {
        profileMng: false,
        profile: {
//          school_id: null,
//          avatar: null,
//          name: null,
//          sex: null,
//          academy: null,
//          class_id: null,
//          grade: null,
//          supervisor: null,
//          birth_date: null,
//          phone_num: null,
//          description: null,
//          created_at: null,
//          updated_at: null,
//          user_id: null
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
            if (!res.data[0].avatar) {
              _this.profile.avatar = require('../../assets/avatar.jpg');
              _this.profile.sex = '男';
            }
          })
          .catch(function (e) {
            console.log(e);
          });
      },
      edit () {
        this.profileMng = true;
      },
      profileSubmit () {
        let _this = this;
        let profileData = {
          school_id: this.profile.school_id,
          sex: this.profile.sex,
          birth_date: this.profile.birth_date,
          phone_num: this.profile.phone_num,
          description: this.profile.description
        };
        this.$ajax.post('/api/profile/modify', profileData)
          .then(function (res) {
            _this.$Message.success(res.data.msg);
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
