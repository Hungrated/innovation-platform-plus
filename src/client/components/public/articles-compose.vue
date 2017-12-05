<template>
  <div id="compose" class="articles-compose">
    <div class="articles-compose-header">
      <Card class="articles-compose-header-card" disHover>
        <span slot="title">发表文章</span>
        <div class="articles-compose-header-container">
          <div class="articles-compose-header-label">
            <Select placeholder="文章分类" size="large" v-model="editor.label">
              <Option v-for="type in  articleTypes" :value="type.label" :key="type.index">
                {{ type.label }}
              </Option>
            </Select>
          </div>
          <Input class="articles-compose-header-topic" v-model="editor.title" size="large" placeholder="文章标题"/>
          <ButtonGroup class="articles-compose-header-type" shape="circle" size="large">
            <Button :type="(editType === 'richText') ? ('primary') : ('default')" @click="changeEditType('richText')">
              富文本
            </Button>
            <Button :type="(editType === 'markDown') ? ('primary') : ('default')" @click="changeEditType('markDown')">
              MarkDown
            </Button>
          </ButtonGroup>
        </div>
        <div class="articles-compose-header-description">
          <Input v-model="editor.description" size="large" placeholder="文章描述"/>
        </div>
      </Card>
    </div>
    <div class="articles-compose-body">
      <transition name="fade">
        <md-editor v-if="editType === 'markDown'" ref="editor" :title="editor.title" :label="editor.label"
                   :description="editor.description"></md-editor>
        <rt-editor v-if="editType === 'richText'" ref="editor" :title="editor.title" :label="editor.label"
                   :description="editor.description"></rt-editor>
      </transition>
    </div>
    <div class="articles-compose-footer">
      <Card class="articles-compose-footer-card" disHover>
        <div class="articles-compose-footer-container">
          <Select class="articles-compose-header-label" placeholder="文章分类" size="large" v-model="editor.label">
            <Option v-for="type in  articleTypes" :value="type.label" :key="type.index">
              {{ type.label }}
            </Option>
          </Select>
          <Button class="articles-compose-footer-submit" size="large" type="primary" @click="submit()">发&emsp;
            表
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import mdEditor from './articles-compose-markDownEditor';
  import rtEditor from './articles-compose-richTextEditor';

  export default {
    name: 'articles-compose',
    components: {
      mdEditor, rtEditor
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
        editType: 'markDown',
        editor: {
          title: '',
          label: '',
          description: ''
        }
      };
    },
    methods: {
      changeEditType (name) {
        this.editType = name;
      },
      submit () {
        this.$refs.editor.submit();
      }
    }
  };
</script>

<style>
  @import '../../styles/articles-compose.css';
</style>


