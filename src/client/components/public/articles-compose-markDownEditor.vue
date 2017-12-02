<template>
  <div id="editor">
    <textarea></textarea>
  </div>
</template>
<script>
  import scriptjs from 'scriptjs';

  export default {
    props: {
      id: String
    },
    mounted () {
      // 获取依赖的资源 - 如果需要异步加载的话
      Promise.all([
        scriptjs('jquery.min.js'),
        scriptjs('editormd.min.js')
      ])
        .then(() => {
          // do your logic.
          // 实例化，绑定事件等操作
        });
    },
    destoryed () {
      // 解绑全局事件
      // 销毁实例
    },
    methods: {
      // 返回一些有用的函数
    }
  };
</script>

<style scoped>

</style>
