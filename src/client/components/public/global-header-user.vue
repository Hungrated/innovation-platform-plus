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
      title="Common Modal dialog box title"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>Content of dialog</p>
      <p>Content of dialog</p>
      <p>Content of dialog</p>
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
      }
    }
  }
</script>

<style scoped>
  .layout-header-user * {
    border: 1px solid red;
  }
</style>
