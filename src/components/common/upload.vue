<template>
  <el-upload
    :action="ossHost"
    :accept="accept"
    :data="ossParams"
    :on-change="handleChange"
    :before-upload="beforeUpload"
    :file-list="filesList"
    :on-remove="romoveList"
    :before-remove="beforeRemove"
    list-type="picture"
  >
    <el-button size="small" type="primary">{{ buttonText }}</el-button>
    <div slot="tip" class="el-upload__tip">{{ tip }}</div>
  </el-upload>
</template>

<script>
  export default {
    props: ['verifyUrl', 'tip', 'accept', 'VerifyFile', 'buttonText', 'fileList'],
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
        filesList: this.fileList
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
          let url = this.ossUrl + this.verifyUrl;
          const token = localStorage.getItem('access_token');
          xmlhttp.open('GET', url, false);
          xmlhttp.setRequestHeader('authorization', token);
          xmlhttp.send(null)
        }
      },
      handleChange(file, fileList) {
        if (file.status !== 'ready') {
          this.filesList = fileList.slice(-1)
        }
        if (file.status === 'success') {
          this.$emit('coverUrl', `${this.ossHost}/${this.ossParams.key}`)
        }
      },
      romoveList(file, fileList) {
        this.$emit('coverUrl', ``)
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除？`);
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
