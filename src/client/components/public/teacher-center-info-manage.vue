<template>
  <div class="info-manage-container">
    <div class="info-manage-header">
      <div class="info-manage-options">
        <Card disHover>
          <span slot="title">
            <strong>筛选条件</strong>
          </span>
          <div class="info-manage-options-body">
            <div class="options-type">
              <Input size="default" placeholder="类 别"/>
            </div>
            <div class="options-range">
              <Input size="default" placeholder="时间范围"/>
            </div>
            <div class="options-sid">
              <Input size="default" placeholder="学 号"/>
            </div>
            <div class="options-query">
              <Button @click="" type="primary" size="default">查 询</Button>
            </div>
          </div>
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
