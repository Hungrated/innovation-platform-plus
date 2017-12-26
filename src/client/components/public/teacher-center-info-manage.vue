<template>
  <div class="info-manage-container">
    <div class="info-manage-header">
      <div class="main-panel-left">
        <Card disHover>
          <span slot="title">
            <strong>筛选条件</strong>
          </span>
        </Card>
      </div>
      <div class="info-manage-body">
        <!--不同的component在这里，展示表格-->
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'teacher-center-info-manage'
  };
</script>

<style>
  @import '../../styles/teacher-center-info-manage.css';
</style>
