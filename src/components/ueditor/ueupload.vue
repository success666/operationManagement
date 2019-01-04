<template>
    <div>
      <el-button icon="el-icon-upload" size="mini" @click="dialogVisible = true" type="primary">插入图片</el-button>
      <el-dialog append-to-body :visible.sync="dialogVisible">
        <el-upload
          class="editor-slide-upload"
          :action="ossHost"
          :file-list="fileList"
          :show-file-list="true"
          list-type="picture-card"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          :data="ossParams"
          accept="image/*"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </el-dialog>
    </div>
</template>

<script>
  // import Upload from './upload'
  export default {
    created() {
      this.ossHost = process.env.ossHost;
      this.ossUrl = process.env.ossUrl;
    },
    data() {
      return {
        dialogVisible: false,
        listObj: {},
        fileList: [],
        ossParams: {
          success_action_status: 200
        },
        ossHost: 'http://xiaotitong-dev.oss-cn-shenzhen.aliyuncs.com',
        ossUrl: ''
      }
    },
    components: {
      // Upload
    },
    methods: {
      checkAllSuccess() {
        return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
      },
      handleSubmit() {
        const arr = Object.keys(this.listObj).map(v => this.listObj[v])
        if (!this.checkAllSuccess()) {
          this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
          return
        }
        this.$emit('successHKC', arr)
        this.listObj = {}
        this.fileList = []
        this.dialogVisible = false
      },
      handleSuccess(response, file) {
        const uid = file.uid
        const objKeyArr = Object.keys(this.listObj)
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            // this.listObj[objKeyArr[i]].url = response.files.file
            this.listObj[objKeyArr[i]].hasSuccess = true
            return
          }
        }
      },
      handleRemove(file) {
        const uid = file.uid
        const objKeyArr = Object.keys(this.listObj)
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            delete this.listObj[objKeyArr[i]]
            return
          }
        }
      },
      beforeUpload(file) {
        this.getOssUrl();
        let name = file.name;
        const lastIndex = name.lastIndexOf('\\');
        if (lastIndex !== -1) {
          name = name.substr(lastIndex + 1);
        }
        this.ossParams.key += `/${new Date().getTime()}.${name.split('.').pop()}`

        const _self = this
        const _URL = window.URL || window.webkitURL
        const fileName = file.uid
        this.listObj[fileName] = {}
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.src = _URL.createObjectURL(file)
          img.onload = function() {
            _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height, url: _self.ossHost + '/' + _self.ossParams.key }
          }
          resolve(true)
        })
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
          const url = this.ossUrl + '/api/auth/v1/oss/policy?dir=guidancePoints';
          const token = localStorage.getItem('access_token');
          xmlhttp.open('GET', url, false);
          xmlhttp.setRequestHeader('authorization', token);
          xmlhttp.send(null);
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .editor-slide-upload {
    margin-bottom: 20px;
    /deep/ .el-upload--picture-card {
      width: 100%;
    }
  }
</style>
