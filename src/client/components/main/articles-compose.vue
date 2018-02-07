<template>
  <div id="compose" class="g-compose">
    <div class="g-compose header">
      <Card disHover>
        <span slot="title"><strong>发表文章</strong></span>
        <div class="m-container1">
          <div class="m-container1 label">
            <Select placeholder="文章分类" size="large" v-model="editor.label">
              <Option v-for="type in  articleTypes" :value="type.label" :key="type.index">
                {{ type.label }}
              </Option>
            </Select>
          </div>
          <Input class="m-container1 title" v-model="editor.title" size="large" placeholder="文章标题"/>
          <ButtonGroup class="m-container1 type" shape="circle" size="large">
            <Button :type="(editType === 'markdown') ? ('primary') : ('default')" @click="changeEditType('markdown')">
              <Icon type="document-text" style="font-size: 17px"></Icon>
              Markdown文档
            </Button>
            <Button :type="(editType === 'event') ? ('primary') : ('default')" @click="changeEditType('event')">
              <Icon type="flag" style="font-size: 17px"></Icon>
              活动图集
            </Button>
          </ButtonGroup>
        </div>
        <div class="m-desc">
          <Input v-model="editor.description" size="large" placeholder="文章描述"/>
        </div>
      </Card>
    </div>
    <div class="g-compose body">
      <markdown-editor v-if="editType === 'markdown'"
                       ref="markdownEditor"
                       :title="editor.title"
                       :label="editor.label"
                       :description="editor.description"/>
      <event-editor v-if="editType === 'event'"
                    ref="eventEditor"
                    :title="editor.title"
                    :label="editor.label"
                    :description="editor.description"/>
    </div>
    <div class="g-compose footer">
      <Card disHover>
        <div class="m-container2">
          <Select class="m-container2 label" placeholder="文章分类" size="large" v-model="editor.label">
            <Option v-for="type in  articleTypes" :value="type.label" :key="type.index">
              {{ type.label }}
            </Option>
          </Select>
          <Button class="m-container submit" size="large" type="primary" @click="submit(editType)">
            发&emsp;表
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import markdownEditor from '../public/articles-compose-markdown';
  import eventEditor from '../public/articles-compose-event';

  export default {
    name: 'articles-compose',
    components: {
      markdownEditor, eventEditor
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
        editType: 'markdown',
        editor: {
          title: '',
          label: '',
          description: ''
        }
      };
    },
    methods: {
      changeEditType (name) {
        if ((name === 'event' && this.$refs.markdownEditor.$children[0].d_value) ||
          (name === 'markdown' && this.$refs.eventEditor.toUploadList.length)
        ) {
          let _this = this;
          this.$Modal.confirm({
            title: '切换编辑类型',
            content: '确定切换编辑类型？当前编辑将无法保存。',
            onOk () {
              _this.editType = name;
            }
          });
        } else {
          this.editType = name;
        }
      },
      submit (type) {
        if (type === 'markdown') {
          this.$refs.markdownEditor.submit();
        } else if (type === 'event') {
          this.$refs.eventEditor.submit();
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../styles/articles-compose";
</style>


