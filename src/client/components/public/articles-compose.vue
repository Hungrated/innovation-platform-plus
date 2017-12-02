<template>
  <div id="compose" class="articles-compose">
    <div class="articles-compose-header">
      <Card disHover>
        <span slot="title">发表文章</span>
        <div style="display: flex">
          <Select class="articles-compose-header-label" size="large" v-model="label">
            <Option v-for="type in  articleTypes" :value="type.label" :key="type.index">
              {{ type.label }}
            </Option>
          </Select>
          <Input v-model="editor.title" size="large" placeholder="文章标题"/>
          <ButtonGroup class="articles-compose-header-type" shape="circle" size="large">
            <Button :type="editType.richText" @click="changeEditType('richText')">富文本</Button>
            <Button :type="editType.markDown" @click="changeEditType('markDown')">MarkDown</Button>
          </ButtonGroup>
        </div>
      </Card>
    </div>
    <div class="articles-compose-body">
    </div>
    <div class="articles-compose-footer">
    </div>
  </div>

</template>

<script>
  export default {
    name: 'articles-compose',
    components: {},
    data () {
      return {
        articleTypes: [
          {
            index: 0,
            label: '项目成果'
          },
          {
            index: 1,
            label: '活 动'
          },
          {
            index: 2,
            label: '技术交流'
          },
          {
            index: 3,
            label: '其 他'
          }
        ],
        label: '',
        editType: {
          richText: 'primary',
          markDown: 'default'
        },
        editor: {
          title: '',
          content: ''
        }
      };
    },
    methods: {
      changeEditType (name) {
        if (name === 'richText') {
          this.editType.richText = 'primary';
          this.editType.markDown = 'default';
        } else {
          this.editType.richText = 'default';
          this.editType.markDown = 'primary';
        }
      },
      submit () {
        console.log(this.content);
      }
    }
  };
</script>

<style>
  @import '../../styles/articles-compose.css';
</style>


