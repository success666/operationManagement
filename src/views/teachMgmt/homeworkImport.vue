<template>
    <div class="contain-vessel">
      <div class="upload-tip">
        <div class="tip">提示：</div>
        <div class="text">
          <div>第一步，下载指导点导入数据基本信息模板，用下载的模板填写信息；下载模板</div>
          <div>第二步，点击按钮浏览找到填写完毕的信息模板，上传完毕即可;</div>
        </div>
      </div>
      <el-upload
        action="http://s.operation.dev.xiaotitong.com/api/auth/v1/guidancePoint/batchImport"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        :headers="header"
        name="files"
        :data="uploadParams"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :show-file-list="false"
      >
        <el-button size="small" type="primary">上传</el-button>
      </el-upload>
      <div class="upload-file" v-if="uploadFile">导入文件：{{ uploadFile }}</div>
      <div class="upload-status" v-html="uploadStatus"></div>
    </div>
</template>

<script>
  export default {
    mounted() {
      const token = window.localStorage.getItem('access_token');
      this.header.authorization = token;
      
    },
    data() {
      return {
        uploadParams: {},
        header: {},
        response: {},
        uploadFile: ''
      }
    },
    methods: {
      beforeUpload(file) {
        console.log(file)
        this.uploadParams.files = file.type;
        this.uploadFile = file.name;
      },
      uploadSuccess(response, file, fileList) {
        this.response = response.status
      }
    },
    computed: {
      uploadStatus() {
        if (this.response.code === 0) {
          return '导入成功。'
        } else if (this.response.code === 500) {
          return `<p>导入失败</p><p>错误信息：${this.response.msg}</p>`
        } else {
          return ''
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .upload-file {
    border: 1px solid #ccc;
    display: inline-block;
    padding: 10px 20px;
    border-radius: 6px;
    margin-top: 30px;
  }
  .upload-status {
    margin-top: 20px;
  }
  .upload-tip {
    margin-bottom: 20px;
    .tip {
      display: inline-block;
      width: 50px;
      vertical-align: top;
    }
    .text {
      display: inline-block;
      vertical-align: top;
      > div {
        margin-bottom: 5px;
      }
    }
  }
</style>
