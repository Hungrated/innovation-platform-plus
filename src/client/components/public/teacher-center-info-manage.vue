<template>
  <div class="info-manage-container">
    <div class="info-manage-header">
      <div class="info-manage-options">
        <Card disHover>
          <span slot="title">
            <strong>筛选条件</strong>
          </span>
          <div class="info-manage-options-body">
            <div class="options-list">
              <div class="options-type">
                <Select placeholder="类 别" size="large" v-model="infoType">
                  <Option v-for="type in infoTypeList" :value="type.value" :key="type.index">
                    {{ type.value }}
                  </Option>
                </Select>
              </div>
              <div class="options-range">
                <DatePicker v-model="infoRange"
                            size="large"
                            format="yyyy-MM-dd"
                            type="daterange"
                            placeholder="时间范围（选填）"
                            style="width: 100%">
                </DatePicker>
              </div>
              <div class="options-sid">
                <Input size="large" placeholder="学 号（选填）"/>
              </div>
            </div>
            <div class="options-query">
              <Button @click="" type="primary" size="large">查 询</Button>
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
    name: 'teacher-center-info-manage',
    data () {
      return {
        infoType: '文 章',
        infoTypeList: [
          {
            index: 0,
            value: '文 章'
          },
          {
            index: 1,
            value: '计 划'
          },
          {
            index: 2,
            value: '课堂记录'
          }
        ],
        infoRange: ['', ''],
        dataList: []
      };
    }
  };
</script>

<style>
  @import '../../styles/teacher-center-info-manage.css';
</style>
