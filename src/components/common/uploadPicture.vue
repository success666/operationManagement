<template>
  <span>
    <el-upload
      accept="image/*"
      class="upload-demo"
      :action="uploadPictureUrl"
      :data="ossParams"
      :on-change="handleChange"
      :before-upload="beforeAvatarUpload"
      :file-list="fileList"
      list-type="picture"
      :before-remove="beforeRemove">
      <el-button size="small" type="primary">点击上传</el-button>
      <span style="color:red;font-size:12px;">{{condition.title}}</span>
    </el-upload>
  </span>
</template>
<style>

</style>
<script>
import superagent from 'superagent'
export default {
  data(){
    Array.prototype.remove = function(val) { 
      var index = this.indexOf(val); 
      if (index > -1) { 
          this.splice(index, 1); 
      } 
    };
    return{
      status:false,
      uploadPictureUrl:'',
      ossUrl:'',
      fileList:[],
      idx:'',
      fileName:[],
      removeTarget:'',
      ossParams:{
        success_action_status: 200
      }
    }
  },
  created() {
      this.uploadPictureUrl = process.env.ossHost;
      this.ossUrl = process.env.ossUrl;
  },
  props:["condition","api"],
  methods:{
    empty(data){
      this.fileList = [];
      this.fileName = [];
    },
    beforeRemove(file, fileList) {
      if(this.fileName.length>0 || this.fileList.length>0){
        for(let key of this.fileName){
          if(key.id == file.raw.index){
            this.removeTarget = key;
            this.fileName.remove(key);
          }
        }
        if(this.status){
          this.$emit('remove', {name:file.name});
        }
      }
    },
   
     handleChange(file, fileList) {
        if (file.status === 'success') {
          this.$message.success(`上传成功`);
          this.$emit('upload', {url:process.env.ossHost +'/'+ this.ossParams.key,name:file.name})
          return;
        }
      },
      beforeAvatarUpload(file) {
        if(this.fileName.length + 1 > this.condition.num){
          this.$message.warning(`当前限制选择${this.condition.num}个文件`);
          return false;
        }

        if(this.condition.type.indexOf('gif')<0){
          let arrayImg = file.name.split('.');
          let len = arrayImg.length-1;
          if(arrayImg[len] == 'gif'){
            this.$message.warning(`不可以上传gif图片`);
            return false;
          }
        }

        if(JSON.stringify(this.fileName).indexOf(file.name)>=0){
          this.$message.warning(`图片已存在`);
          this.status = false;
          return false;
        }else{
          this.status = true;
          var myData = new Date(); 
          this.idx = myData.getTime()
          this.fileName.push({name:file.name,id:this.idx});
          file.index = this.idx;
        }
          
        this.request();
        let name = file.name;
        const lastIndex = name.lastIndexOf('\\');
        if (lastIndex !== -1) {
          name = name.substr(lastIndex + 1);
        }
        this.ossParams.key += `/${new Date().getTime()}.${name.split('.').pop()}`
      },
      request(content){
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
          let url = this.ossUrl + this.api;
          const token = localStorage.getItem('access_token');
          xmlhttp.open('GET', url, false);
          xmlhttp.setRequestHeader('authorization', token);
          xmlhttp.send(null)
        }
      },
  },
  watch: {
    imgsrc(val) {
      this.fileList = [{url:val}];
    }
  },
}
</script>
