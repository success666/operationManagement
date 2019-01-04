<template>
  <div>
    <el-upload
      :action="ossHost"
      :accept="accept"
      :data="ossParams"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :before-upload="beforeUpload"
      :on-progress="uploadProcess"
    >
      <el-button size="small" type="primary">{{ buttonText }}</el-button>
      <div slot="tip" class="el-upload__tip">{{ tip }}</div>
    </el-upload>
    <el-progress
      v-if="videoProgress === true"
      type="line"
      :percentage="videoPercent"
    ></el-progress>
    <audio v-if="videoSrc" :src="videoSrc" controls="controls"></audio>
  </div>
</template>

<script>
  export default {
    props: ['verifyUrl', 'tip', 'accept', 'VerifyFile', 'buttonText', 'dataSrc'],
    created() {
      this.ossHost = process.env.ossHost;
      this.ossUrl = process.env.ossUrl;
    },
    data() {
      return {
        ossParams: {
          success_action_status: 200
        },
        ossHost: '',
        ossUrl: '',
        videoProgress: false,
        videoPercent: 0,
        videoSrc: this.dataSrc,
        videoShow: false
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
          // console.log(url);
          xmlhttp.open('GET', url, false);
          xmlhttp.setRequestHeader('authorization', token);
          xmlhttp.send(null)
        }
      },
      uploadProcess(event, file, fileList) {
        this.videoProgress = true;
        this.videoPercent = parseInt(file.percentage.toFixed(0));
      },
      uploadSuccess(response, file, fileList) {
        this.videoPercent = 100;
        this.videoShow = true;
        this.videoProgress = false;
        // console.log("123");
        this.videoSrc = `${this.ossHost}/${this.ossParams.key}`;
        this.$emit('uploadUrl', `${this.ossHost}/${this.ossParams.key}`)
      }
    },
    watch: {
      dataSrc() {
        this.videoSrc = this.dataSrc;
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
</style>
