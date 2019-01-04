<template>
  <div>
    <div class="container">
      <h4>新增批次</h4><br>
      <el-form :inline="true" :rules="rules" :model="formInline" ref="formInline" label-width="80px" class="demo-form-inline">
        <el-form-item label="产品名称" class="item-dispIb" prop="productId">
          <el-select v-model="formInline.productId" clearable placeholder="产品名称">
            <el-option v-for="(item,index) in productNames" :label="item.name" :value="item.id" :key="index" :disabled="item.status === 0 || item.status === null"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="生产日期" class="item-dispIb">
          <el-date-picker type="date" placeholder="选择开始日期" v-model="producetime" value-format="yyyy-MM-dd" style="width: 150px;"></el-date-picker>
        </el-form-item>
        <br>

        <el-form-item label="批次号" class="item-dispIb" prop="sn">
          <el-input v-model="formInline.sn" placeholder="请填写型号" style="width: 200px;display: inline-block"></el-input>
        </el-form-item>

        <el-form-item label="描述" class="item-dispB">
          <el-input type="textarea" class="item-textarea" v-model="formInline.description" placeholder="请输入简介"></el-input>
        </el-form-item>
        <br>
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

  export default {
    data() {
      return {
        productNames: [],
        formInline: {
          sn: '', // 批次号
          productId: '', // 产品id
          produceTime: '', // 生产时间
          productName: '',
          status: '',
          description: '' // 描述
        },
        producetime: '', // 生产时间
        rules: {
          productId: [
            { required: true, message: '请输入产品名称', trigger: 'blur' },
            // { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          sn: [
            { required: true, message: '请输入产品批次', trigger: 'blur' },
            // { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.producetime !== '') {
              this.formInline.produceTime = this.producetime + ' ' +  '00:00:00';
            }else{
              this.formInline.produceTime = ''
            }
            request.post('/api/auth/v1/deviceMgmt/batch', {
              sn: this.formInline.sn, // 批次号
              productId: this.formInline.productId, // 产品ID
              description: this.formInline.description, // 描述
              produceTime: this.formInline.produceTime // 生产时间
            }).then((res) => {
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
              this.$router.push({
                path: 'productBatch'
              })
            }).catch((err) => {
              // console.log(err.status.msg)
              this.$message({
                type: 'error',
                message: '保存失败!'
              })
            })
          } else {
            // console.log('error submit!!');
            return false;
          }
        })
      },
      handleExit(formName) {
        // this.$refs[formName].resetFields();
        this.$router.push({
          path: 'productBatch'
        })
      },
      getProductType() { // 产品名称列表
        request.get('/api/auth/v1/deviceMgmt/product/list').then((res) => {
          this.productNames = res.data;
        }).catch((err) => {
          // console.log(err + '请求产品名称失败')
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
