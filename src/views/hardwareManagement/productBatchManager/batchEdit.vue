<template>
  <div>
    <div class="container">
      <h4>修改批次</h4><br>
      <el-form :inline="true" :rules="rules" :model="formInline" ref="formInline" label-width="80px" class="demo-form-inline">
        <el-form-item label="批次号" class="item-dispIb">
          <!--<el-input v-model="formInline.sn" placeholder="请填写型号" style="width: 200px;display: inline-block"></el-input>-->
          <span>{{formInline.sn}}</span>
        </el-form-item>

        <el-form-item label="生产日期" class="item-dispIb" prop="produceTime">
          <el-date-picker type="date" placeholder="选择开始日期" v-model="formInline.produceTime" value-format="yyyy-MM-dd" style="width: 150px;"></el-date-picker>
        </el-form-item>
        <br>
        <el-form-item label="产品名称" class="item-dispIb">
          <!--<el-input v-model="formInline.productName" placeholder="请输入产品名称" style="width: 200px;display: inline-block"></el-input>-->
          <span>{{formInline.productName}}</span>
        </el-form-item>

        <el-form-item label="描述" class="item-dispB" prop="description">
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
        formInline: {
          sn: '', // 批次号
          productId: '', // 产品id
          produceTime: '', // 生产时间
          productName: '', // 产品名称
          status: '',
          description: '' // 描述
        },
        id: '',
        rules: {
          produceTime: [
            { required: true, message: '请输入生产日期', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入产品描述', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      getData() { // 初始化获取数据
        const userId = this.$route.query.rowId;
        this.id = userId;
        request.get('/api/auth/v1/deviceMgmt/batch/' + userId).then((res) => {
          this.formInline = res.data;
        }).catch((err) => {
          // console.log(err + '请求产品类型失败')
        })
      },
      handleSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            request.post('/api/auth/v1/deviceMgmt/batch/' + this.id, {
              id: this.id,
              description: this.formInline.description, // 描述
              produceTime: this.formInline.produceTime + ' ' +  '00:00:00' // 生产时间
            }).then((res) => {
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
              this.$router.push({
                path: 'productBatch'
              })
            }).catch((err) => {
              this.$message({
                type: 'info',
                message: '保存失败!' + err
              })
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      handleExit(formName) {
        this.$refs[formName].resetFields();
        this.$router.push({
          path: 'productBatch'
        })
      }
    },
    mounted() {
      this.getData()
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
