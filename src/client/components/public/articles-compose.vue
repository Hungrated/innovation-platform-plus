<template>
  <div id="compose" class="articles-compose">
    <div class="articles-compose-header">
      <Card disHover>
        <span slot="title">发表文章</span>
        <div style="display: flex">
          <Select size="large" style="width:150px; margin-right: 10px" v-model="label">
            <Option v-for="type in  articleTypes" :value="type.label" :key="type.index">
              {{ type.label }}
            </Option>
          </Select>
          <Input v-model="editor.title" size="large" placeholder="文章标题"/>
          <ButtonGroup shape="circle" size="large" style="margin-left: 10px; display: flex">
            <Button :type="editType.richText" @click="changeEditType('richText')">富文本</Button>
            <Button :type="editType.markDown" @click="changeEditType('markDown')">MarkDown</Button>
          </ButtonGroup>
        </div>
      </Card>
    </div>
    <div class="articles-compose-body">
      <rt-editor></rt-editor>
    </div>
    <div class="articles-compose-footer">
    </div>
  </div>
</template>

<script>
  import rtEditor from './articles-compose-richTextEditor';

  export default {
    name: 'articles-compose',
    components: {
      rtEditor
    },
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
          content: '',
          // set image upload api url
          path: '/api/v1/help/upload/wangEditorH5File'
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


