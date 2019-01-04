<template>
  <div>
    <div class="container">
      <h4>新增产品</h4><br>
      <el-form :inline="true" :rules="rules" :model="formInline" ref="formInline" label-width="80px" class="demo-form-inline">
        <el-form-item label="产品名称" class="item-dispIb" prop="name">
          <el-input v-model="formInline.name" placeholder="请输入产品名称" style="width: 200px;display: inline-block"></el-input>
        </el-form-item>
        <el-form-item label="产品类型" class="item-dispIb" prop="productCategoryId">
          <el-select v-model="formInline.productCategoryId" placeholder="产品类型" style="width: 200px;display: inline-block">
            <el-option v-for="(item,index) in productTypes" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="厂家" class="item-dispIb">
          <el-input v-model="formInline.manufactor" placeholder="请填写厂家" style="width: 200px;display: inline-block"></el-input>
        </el-form-item>
        <el-form-item label="型号" class="item-dispIb" prop="model">
          <el-input v-model="formInline.model" placeholder="请填写型号" style="width: 200px;display: inline-block"></el-input>
        </el-form-item>

        <el-form-item label="描述" class="item-dispB">
          <el-input type="textarea" class="item-textarea" v-model="formInline.description" placeholder="请输入简介"></el-input>
        </el-form-item>

        <el-form-item label="形象图" class="item-dispB">
          <Upload
            :verifyUrl="'/api/auth/v1/oss/policy?dir=guidancePoint'"
            :tip="'请上传150x150的图片,大小不超过100KB,只能上传一张'"
            :buttonText="'上传图片'"
            :accept="'image/*'"
            :limit="1"
            :VerifyFile="VerifyCoverUrl"
            :fileList="formInline.appearanceUrls"
            @coverUrl="onCoverUrl"
          ></Upload>

          <el-dialog :visible.sync="formInline.dialogVisible">
            <img width="100%" :src="formInline.logoUrl" alt="">
          </el-dialog>
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
  // import superagent from 'superagent'
  import Upload from '@/components/common/upload'

  export default {
    components: {
      Upload
    },
    data() {
      return {
        productTypes: [],
        formInline: {
          name: '',
          productName: '',
          productCategoryId: '',
          manufactor: '', // 厂家
          model: '',
          logoUrl: '',
          description: '',
          appearanceUrls: [], // 上传
          dialogVisible: false
        },
        rules: {
          name: [
            { required: true, message: '请输入产品名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          productCategoryId: [
            { required: true, message: '请选择产品类型', trigger: 'change' }
          ],
          model: [
            { required: true, message: '请填写型号：首字母+序号，如手环第一代-SH01', trigger: 'blur' },
            { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handlePictureCardPreview(file) {
        this.formInline.logoUrl = file.url;
        this.appearanceUrls.push(this.formInline.logoUrl);
        this.formInline.dialogVisible = true;
      },
      handleExit(formName) {
        this.$refs[formName].resetFields();
        this.$router.push({
          path: 'product'
        })
      },
      getProductType() { // 产品类型列表
        request.get('/api/auth/v1/deviceMgmt/product/type').then((res) => {
          this.productTypes = res.data;
          // console.log(res.data);
        }).catch((err) => {
          console.log(err)
        })
      },
      VerifyCoverUrl(file) {
        const imgFile = file
        const _URL = window.URL || window.webkitURL
        const _self = this
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.src = _URL.createObjectURL(imgFile)
          img.onload = function() {
            if (imgFile.size / 1024 < 100 && this.width <= 180 && this.height <= 180) {
              resolve(true)
            } else {
              _self.$message({
                type: 'error',
                message: '缩略图请上传180x150的图片,大小不超过100KB!'
              })
              reject(false)
            }
          }
        })
      },
      onCoverUrl(data) {
        console.log(data);
        this.formInline.logoUrl = data;
        this.formInline.appearanceUrls = [];
        this.formInline.appearanceUrls.push(data);
      },
      // 提交
      handleSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            request.post('/api/auth/v1/deviceMgmt/product', {
              name: this.formInline.name,
              description: this.formInline.description,
              model: this.formInline.model,
              logoUrl: this.formInline.logoUrl,
              manufactor: this.formInline.manufactor, // 厂家
              productCategoryId: this.formInline.productCategoryId, // 产品类型ID
              appearanceUrls: this.formInline.appearanceUrls || []// 外形图URL
            }).then((res) => {
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
              this.$router.push({
                path: 'product'
              })
            }).catch((err) => {
              console.log(err, '保存失败')
            })
          } else {
            // console.log('error submit!!');
            return false;
          }
        })
      }
    },
    mounted() {
      this.getProductType()
    }
  }
</script>

<style scoped>
  .container{
    background-color: #ffffff;
    border-radius: 10px;
    padding: 5px 0px 5px 15px;
    margin-top: 15px;
    font-size: 15px;
  }
  .float_r{
    float: right;
  }
  .demonstration{
    margin: 5px 30px 5px 0px;
    display: inline-block;
  }
  .item-dispIb{
    display: inline-block;
    margin: 10px 50px 20px 5px;
  }
  .item-dispB{
    display:block;
    margin: 10px 5px;
  }
  .item-sub{
    text-align: center;
    width: 620px;
    margin: 50px 5px 50px 5px;
  }
  .item-textarea{
    width: 540px;
  }

</style>
