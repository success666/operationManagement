<template>
  <div>
    <div class="container">
      <h3>修改设备</h3><br>
      <el-form :inline="true" :rules="rules" :model="formInline" ref="formInline" label-width="100px" class="demo-form-inline">
        <h4 class="item-dispB"> 设备号：{{formInline.name}}</h4>
        <el-form-item label="MAC地址" class="item-dispIb" prop="mac">
          <el-input v-model="formInline.mac" type="number" placeholder="请输入MAC地址" style="width: 200px;display: inline-block"></el-input>
        </el-form-item>

        <el-form-item label="物联卡号" class="item-dispB" prop="internetNum">
          <el-input v-model="formInline.internetNum" type="number" placeholder="请输入物联卡号" style="width: 200px;display: inline-block"></el-input>
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
          mac: '', // 批次号
          internetNum: '' // 产品id
        },
        id: '',
        rules: {
          mac: [
            { required: true, message: '此项为必填，且是数字', trigger: 'blur' }
          ],
          internetNum: [
            { required: true, message: '此项为必填，且是数字', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      getData() { // 初始化获取设备
        const userId = this.$route.query.rowId;
        this.id = userId;
        request.get('/api/auth/v1/deviceMgmt/device/' + userId).then((res) => {
          this.formInline = res.data;
          this.id = res.data.id;
        }).catch((err) => {
          // console.log(err + '请求产品类型失败')
        })
      },
      handleSubmit(formName) { // 修改设备
        this.$refs[formName].validate((valid) => {
          if (valid) {
            request.post('/api/auth/v1/deviceMgmt/device/' + this.id, {
              id: this.id,
              mac: this.formInline.mac, // 描述
              internetNum: this.formInline.internetNum // 生产时间
            }).then((res) => {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.$router.push({
                path: 'device'
              })
            }).catch((err) => {
              this.$message({
                type: 'info',
                message: '保存失败!'
              })
            })
          } else {
            return false;
          }
        })
      },
      handleExit(formName) {
        this.$refs[formName].resetFields();
        this.$router.push({
          path: 'device'
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

</style>
