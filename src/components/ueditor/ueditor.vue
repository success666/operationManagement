<template>
  <div class="ue-vessel">
    <!--<p>富文本编辑器</p>-->
    <script :id=id type="text/plain">文本编辑器初始化内容editor.vue</script>
    <ueUpload @successHKC="imageSuccess" class="upload-img"></ueUpload>
  </div>
</template>

<script>
  // import '../../../static/UE/themes/default/css/ueditor.css'
  import '../../../static/UE/ueditor.config.js'
  import '../../../static/UE/ueditor.all.min.js'
  import '../../../static/UE/lang/zh-cn/zh-cn.js'
  import '../../../static/UE/ueditor.parse.min.js'
  import ueUpload from './ueupload'

  export default {
    data() {
      return {
        editor: null
      }
    },
    props: {
      content: {
        type: String,
        default: ''
      },
      config: {
        type: Object
      },
      id: {
        type: String
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      getContent() { // 获取内容方法
        return this.editor.getContent()
      },
      init() {
        const _this = this;
        _this.config.toolbars = [[
          'fullscreen', 'source', '|', 'undo', 'redo', '|',
          'bold', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'formatmatch',
          '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|',
          'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
          'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
          'indent', '|',
          'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
          'horizontal', 'date', 'time', '|', 'selectall', 'cleardoc', 'removeformat'
        ]]
        _this.config.initialFrameWidth = '100%'
        _this.config.initialFrameHeight = 350
        _this.config.autoHeightEnabled = false
        _this.editor = UE.getEditor(_this.id, _this.config); // 初始化UE
        _this.editor.ready(function(ue) {
          _this.editor.setContent(_this.content);
        })
      },
      imageSuccess(arr) {
        let content = ''
        for (let i = 0, len = arr.length; i < len; i++) {
          content += `<img src='${arr[i].url}' />`
        }
        this.insertHtml(content)
      },
      insertImg(url) {
        this.insertHtml(`<img src='${url}' />`)
      },
      insertHtml(content) {
        if (this.editor) {
          this.editor.execCommand('insertHtml', content)
        }
      },
    },
    destroyed() {
      this.editor.destroy()
    },
    watch: {
      content(val) {
        if (val) {
          const _this = this;
          this.editor.ready(function(abc) {
            _this.editor.setContent(val)
          })
        }
      }
    },
    components: {
      ueUpload
    }
  }
</script>

<style scoped>
  .ue-vessel {
    position: relative;
  }
  .upload-img {
    /*position: absolute;*/
    /*top: 0;*/
    /*right: 0;*/
    /*z-index: 999999999;*/
  }
</style>
