<template>
  <div>
    <span class="color-red" v-if="fileList.length > 0">{{fileList}}</span>
    <el-upload
      :action="ossHost"
      :accept="accept"
      :data="ossParams"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :before-upload="beforeUpload"
      :on-progress="uploadProcess"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">{{ buttonText }}</el-button>
      <div slot="tip" class="el-upload__tip">{{ tip }}</div>
    </el-upload>

    <el-progress
      v-if="filesProgress === true"
      type="line"
      :percentage="filesPercent"
    ></el-progress>

  </div>
</template>

<script>
  export default {
    props: ['verifyUrl', 'tip', 'accept', 'VerifyFile', 'buttonText', 'dataSrc'],
    created() {
      this.ossHost = process.env.ossHost;
      this.ossUrl = process.env.ossUrl
    },
    data() {
      return {
        ossParams: {
          success_action_status: 200
        },
        ossHost: 'http://xiaotitong-dev.oss-cn-shenzhen.aliyuncs.com',
        ossUrl: '',
        fileList: [],
        filesProgress: false,
        filesPercent: 0,
        filesSrc: this.dataSrc,
        filesShow: false
      }
    },
    methods: {
      beforeUpload(file) {
        this.getOssUrl();
        let name = file.name;
        const lastIndex = name.lastIndexOf('\\');
        if (lastIndex !== -1) {
          name = name.substr(lastIndex + 1);
        }
        this.ossParams.key += `/${new Date().getTime()}.${name.split('.').pop()}`
        return this.VerifyFile(file)
      },
      getOssUrl() {
        let xmlhttp;
        if (window.XMLHttpRequest) {
          xmlhttp = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
          xmlhttp = new window.ActiveXObject('Microsoft.XMLHTTP');
        }
        if (xmlhttp !== null) {
          xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState === 4) {
              if (xmlhttp.status === 200) {
                const response = xmlhttp.responseText;
                const data = JSON.parse(response).data;
                if (JSON.parse(response).status.code === 2010001) {
                  this.$store.dispatch('FedLogOut').then(() => {
                    location.reload()
                  })
                }
                this.ossParams.key = data.dir;
                this.ossParams.policy = data.policy;
                this.ossParams.signature = data.signature;
                this.ossParams.OSSAccessKeyId = data.accessId;
                this.ossHost = data.host;
              } else {
                this.$message.error('获取验证失败');
              }
            }
          };
          const token = localStorage.getItem('access_token');
          const url = this.ossUrl + this.verifyUrl;
          xmlhttp.open('GET', url, false);
          xmlhttp.setRequestHeader('authorization', token);
          xmlhttp.send(null)
        }
      },
      uploadProcess(event, file, fileList) {
        this.filesProgress = true;
        this.filesPercent = parseInt(file.percentage.toFixed(0))
      },
      uploadSuccess(response, file, fileList) {
        this.filesPercent = 100;
        this.filesShow = true;
        this.filesProgress = false;
        this.filesSrc = `${this.ossHost}/${this.ossParams.key}`;
        this.fileList = fileList;
        this.$emit('uploadUrl', `${this.ossHost}/${this.ossParams.key}`);
        this.$message({
          type: 'success',
          message: '上传成功!'
        })
      }
    },
    watch: {
      dataSrc() {
        this.filesSrc = this.dataSrc;
        this.fileList = [{ 'url': this.filesSrc }]
      }
    }
  }
</script>

<style scoped>
  .el-upload__tip {
    color: red;
    line-height: 20px;
    margin-top: 0;
  }
  .color-red{
    color: #ff5500;
  }
</style>
