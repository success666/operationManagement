<template>
    <div>
      <div class="container">
        <h2>新增固件</h2>
        <el-form :inline="true" label-width="80px" :rules="rules" ref="formInline" :model="formInline" class="demo-form-inline">
          <el-form-item label="固件名称" class="item-dispIb" prop="name">
            <el-input v-model="formInline.name" placeholder="请输入固件名称"></el-input>
          </el-form-item>
          <el-form-item label="固件版本" class="item-dispIb" prop="version" title="命名规则：V+型号+序号，如手环第一代第一个版本-VSH0101">
            <el-input v-model="formInline.version" placeholder="请输入固件版本号"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="产品名称" class="item-dispIb" prop="productId">
            <el-select v-model="formInline.productId" clearable placeholder="请选择产品名称">
              <el-option v-for="(item,index) in productNames" :label="item.name" :value="item.id" :key="index" :disabled="item.status === 0"></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="启用状态" class="item-dispIb">-->
            <!--<el-select v-model="formInline.status" placeholder="请选择启用状态">-->
              <!--<el-option label="启用" value="1"></el-option>-->
              <!--<el-option label="停用" value="0"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <br>
          <el-form-item label="描述" class="item-dispB">
            <el-input
              type="textarea"
              class="item-textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入描述"
              v-model="formInline.description">
            </el-input>
          </el-form-item>
          <!--<el-form-item label="上传固件" class="item-dispB">-->
            <!--<el-upload v-model="formInline.packagePath"-->
              <!--class="upload-demo"-->
              <!--action=""-->
              <!--:on-preview="handlePreview"-->
              <!--:on-remove="handleRemove"-->
              <!--:before-remove="beforeRemove"-->
              <!--:limit="1"-->
              <!--:on-exceed="handleExceed"-->
              <!--:file-list="fileList">-->
              <!--<el-button size="small" type="primary">上传固件</el-button>-->
              <!--&lt;!&ndash;<div slot="tip" class="el-upload__tip">只能上传xxx.zip文件，且不超过1Mb</div>&ndash;&gt;-->
            <!--</el-upload>-->
          <!--</el-form-item>-->

          <el-form-item label="上传固件" class="item-dispB">
            <!--:accept="'video/mp4'"-->
            <UploadFiles
              :verifyUrl="'/api/auth/v1/oss/policy?dir=guidancePoint'"
              :tip="'请上传大小不超过100M，zip格式的文件'"
              :buttonText="'上传固件'"
              :VerifyFile="VerifyFiles"
              :dataSrc="formInline.packagePath"
              @uploadUrl="onFilesUrl"
            ></UploadFiles>
          </el-form-item>

          <el-form-item class="item-sub">
            <el-button size="medium" class="demonstration" @click="handleExit('formInline')">取消</el-button>
            <el-button type="primary" size="medium" class="demonstration" @click="handleSubmit('formInline')">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
  import request from '@/utils/request'
  import UploadFiles from '@/components/common/uploadFiles'

  export default {
    components: {
      UploadFiles
    },
    data() {
      return {
        fileList: [],
        productNames: [],
        productBatchIds: [],
        formInline: {
          name: '', //
          productId: '', // 产品id
          version: '', // 固件版本
          description: '', // 描述
          packagePath: '',
          status: ''
        },
        rules: {
          name: [
            { required: true, message: '此项为必填', trigger: 'blur' }
          ],
          version: [
            { required: true, message: '此项为必填', trigger: 'blur' }
          ],
          productId: [
            { required: true, message: '此项为必填', trigger: 'blur' }
          ]
        },
        id: ''
      }
    },
    methods: {
      handleSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            request.post('/api/auth/v1/deviceMgmt/firmware', {
              name: this.formInline.name,
              productId: this.formInline.productId,
              version: this.formInline.version,
              packagePath: this.formInline.packagePath,
              status: 0,
              description: this.formInline.description
            }).then((res) => {
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
              this.$router.push({
                path: 'firmware'
              })
            }).catch((err) => {
              console.log(err)
            })
          } else {
            return false
          }
        })
      },
      handleExit() {
        this.$router.push({
          path: 'firmware'
        })
      },
      // 固件上传
      VerifyFiles(file) {
        const isLimit = file.size / 1024 / 1024 < 100;
        return new Promise((resolve, reject) => {
          if (!isLimit) {
            this.$message({
              type: 'error',
              message: '请上传大小不超过100M，zip格式的视频!'
            })
            reject(false)
          } else {
            resolve(true)
          }
        })
      },
      onFilesUrl(data) {
        this.formInline.packagePath = data;
      },
      // 产品名称列表
      getProductName() {
        request.get('/api/auth/v1/deviceMgmt/product/list').then((res) => {
          this.productNames = res.data;
        })
      }
    },
    mounted() {
      this.getProductName()
    }
  }
</script>

<style scoped>
  .container{
    background-color: #ffffff;
    border-radius: 10px;
    padding: 5px 0 5px 15px;
    margin-top: 15px;
    font-size: 15px;
  }
  .demonstration{
    margin: 5px 30px 5px 0px;
    display: inline-block;
  }
  .item-dispIb{
    display: inline-block;
    margin: 10px 50px 10px 5px;
  }
  .item-dispB{
    display:block;
    width: 100%;
    margin: 10px 5px;
  }
  .item-textarea{
    width: 540px;
  }
  .item-sub{
    text-align: center;
    width: 620px;
    margin: 50px 5px 50px 5px;
  }
  .item-download{
    display: inline-block;
    color: deepskyblue;
    text-decoration:underline;
    margin-left: 30px;
  }
</style>
