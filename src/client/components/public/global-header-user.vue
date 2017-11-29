<template>
  <div class="layout-users">
    <Submenu name="6">
      <template slot="title">
        <Icon type="person"></Icon>&nbsp;
      </template>
      <MenuGroup title="用户">
        <MenuItem name="6-1"><span class="login-btn" @click="userMng = true">登 录</span></MenuItem>
      </MenuGroup>
    </Submenu>
    <Modal
      v-model="userMng"
      title="用户登录"
      @on-ok="ok"
      @on-cancel="cancel">
      <!--用户输入框-->
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'global-header-user',
    data () {
      return {
        userMng: false
      }
    },
    methods: {
      ok () {
        this.$Message.info('Clicked ok');
      },
      cancel () {
        this.$Message.info('Clicked cancel');
      },
      submit () {
        this.$ajax({
          method: 'post',
          url: '/user',
          data: {
            name: '14051531',
            password: '14051531'
          }
        });
      }
    }
  }
</script>

<style scoped>
  .layout-header-user * {
    border: 1px solid red;
  }
</style>
