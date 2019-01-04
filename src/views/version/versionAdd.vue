<template>
  <div>
    <!--<h4>版本数据</h4>-->
    <div class="container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item label="APP版本名：" prop="name"><br>
          <el-select v-model="ruleForm.name" placeholder="请选择版本名">
            <el-option label="家长APP" value="1"></el-option>
            <el-option label="学校APP" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台：" prop="platform"><br>
          <el-select v-model="ruleForm.platform" placeholder="请选择平台">
            <el-option label="iOS" value="1"></el-option>
            <el-option label="Android" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安装包地址：" prop="packageUrl"><br>
          <el-input v-model="ruleForm.packageUrl" placeholder="请输入URL，如：http://imtt.dd.qq.com/16891/21F60B57297AD56A0527893275C7137C.apk?fsname=com.qsntzjk.school_1.1.0_1048580.apk&csr=1bbd"></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="description"><br>
          <el-input type="textarea" v-model="ruleForm.description" placeholder="对app版本更新内容进行描述"></el-input>
        </el-form-item>
        <el-form-item label="版本：" prop="versionNum"><br>
          <el-input v-model="ruleForm.versionNum" placeholder="请输入版本号，格式如0.0.1"></el-input>
        </el-form-item>
        <el-form-item label="更新强制性：" prop="update"><br>
          <el-radio-group v-model="ruleForm.WhetherToForceUpdate">
            <el-radio :label="'1'">非强制更新</el-radio>
            <el-radio :label="'0'" style="margin-left:90px;">强制更新</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="textCenter">
          <el-button size="medium" plain @click="cancel('ruleForm')">取消</el-button>
          <el-button type="primary" size="medium" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import request from '@/utils/request'
  export default {
    name: 'versionData',
    data() {
      let versionRule = (rule, value, callback) => {
        let regExp = /^[0-9][.][0-9][.][0-9]$/;
        if (regExp.test(value) === false) {
          callback(new Error('未通过正则验证，请输入类似1.1.1或2.1.3的版本号'));
        } else {
          callback();
        }
      };
      let packageUrlRule = (rule, value, callback) => {
        var strRegex = "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&amp;=+$%-]+: )?[0-9a-z_!~*'().&amp;=+$%-]+@)?"
        let regExp = new RegExp(strRegex);
        if (regExp.test(value) === false) {
          callback(new Error('未通过正则验证，请输入正确的安装包地址'));
        } else {
          callback();
        }
      };
      let verification = (rule,value,callback) =>{
        if(this.ruleForm.WhetherToForceUpdate == ''){
          this.$message.error('更新强制性为必填项');
        }else{
          callback();
        }
      }
      return {
        id: 1,
        createUser: '',
        ruleForm: {
          name: '',
          WhetherToForceUpdate:'',
          platform: '',
          packageUrl: '',
          versionNum: '',
          description: ''
        },
        rules: {
          update: [{ required: true,validator:verification}],
          name: [
            { required: true, message: '此项为必填项', trigger: 'change' }
          ],
          platform: [
            { required: true, message: '此项为必填项', trigger: 'change' }
          ],
          versionNum: [
            { required: true, message: '此项为必填项', trigger: 'blur' },
            { min: 3, max: 5, message: '非法版本号，正确格式如：1.1.1', trigger: 'blur' },
            { validator: versionRule, trigger: 'blur' }
          ],
          packageUrl: [
            { required: true, message: '此项为必填项', trigger: 'blur' },
            { min: 5, message: '非法URL', trigger: 'blur' },
            { validator: packageUrlRule, trigger: 'blur' }
          ],
          description: [
            { required: true, message: '此项为必填项', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            request.post('/api/auth/v1/appVersion', {
              name: this.ruleForm.name,
              platform: this.ruleForm.platform,
              versionNum: this.ruleForm.versionNum,
              packageUrl: this.ruleForm.packageUrl,
              description: this.ruleForm.description,
              isForce:this.ruleForm.WhetherToForceUpdate
            }).then((res) => {
              // console.log(res + '新版本提交成功')
              this.$message({
                type: 'success',
                message: '新版本提交成功!'
              });
              this.$router.push({
                path: 'appVersion'
              })
            }).catch((err) => {
              // console.log(err + '新版本提交失败')
              this.$message({
                type: 'warning',
                message: '新版本提交失败!'
              })
            })
          } else {
            // console.log('error submit!!')
            return false
          }
        })
      },
      cancel(formName) {
        this.$refs[formName].resetFields();
        this.$router.push({
          path: 'appVersion'
        })
      }
    }
  }
</script>

<style scoped>
  .container{
    background-color: #ffffff;
    border-radius: 10px;
    padding: 10px 40px;
    margin-top: 15px;
    font-size: 15px;
  }
  .textCenter {
    text-align: center;
    margin-bottom: 20px;
  }
  .el-select{
    display: block!important;
  }
</style>
