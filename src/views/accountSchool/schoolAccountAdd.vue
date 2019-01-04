<template>
    <div class="contain-vessel">
      <el-form :model="ruleForm" status-icon ref="ruleForm" :rules="rules" label-width="110px" class="ke-ruleForm" size="small">
        <el-form-item label="省" prop="province" class="form-inline">
          <el-select size="small"
            v-model="ruleForm.province"
            placeholder="省"
            @change="getCity"
            label-width="50px"
          >
            <el-option
              v-for="item in provinceData"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市" prop="city" class="form-inline">
          <el-select size="small"
            v-model="ruleForm.city"
            placeholder="市"
            @change="getArea"
          >
            <el-option
              v-for="item in cityData"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区" prop="area" class="form-inline">
          <el-select size="small"
            v-model="ruleForm.area"
            placeholder="区"
            @change="getSchool"
          >
            <el-option
              v-for="item in areaData"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学校" prop="schoolId" class="form-inline">
          <el-select size="small"
            v-model="ruleForm.schoolId"
            placeholder="学校"
            @visible-change="changeSchool"
          >
            <el-option
              v-for="item in schoolData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学校账号" prop="account">
          <el-input v-model="ruleForm.account" auto-complete="off" placeholder="请输入学校账号" size="small"> </el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select size="small"
            v-model="ruleForm.roleId"
            placeholder="角色"
          >
            <el-option
              v-for="item in roleData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="username">
          <el-input size="small" v-model="ruleForm.username" auto-complete="off" placeholder="请输入联系人姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系人手机号" prop="tel" >
          <el-input size="small" v-model="ruleForm.tel" auto-complete="off" placeholder="请输入联系人手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input size="small" v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select  size="small" v-model="ruleForm.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveForm">保存</el-button>
          <el-button @click="goback">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import request from '@/utils/request'
  import {PASSWORD, PASSWORD_TIP, MOBILE} from '../../utils/validate'

  export default {
    created() {
      this.getProvince();
      this.getRoleList();
    },
    data() {
      const validateMobile = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else if (!MOBILE.test(value)) {
          callback(new Error('请输入正确的手机号码'));
        } else {
          callback();
        }
      };
      const validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入正确格式（字母、数字）'));
        } else if (!PASSWORD.test(value)) {
          callback(new Error('请输入正确格式 6-16位（字母，数字组合）'));
        } else {
          callback();
        }
      };
      const validateUserNum = (rule, value, callback) => {
        let regExp = /^([a-zA-Z1-9])[-_a-zA-Z0-9]{5,25}$/;
        if (regExp.test(value) === false) {
          callback(new Error('请输入正确的账号(纯数字、纯字母、字母数字组合，6-26位)'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          province: '',
          city: '',
          area: '',
          schoolId: '',
          account: '',
          roleId: '',
          username: '',
          tel: '',
          password: '',
          status: ''
        },
        rules: {
          province: [
            { required: true, message: '请选择省', trigger: 'change' }
          ],
          city: [
            { required: true, message: '请选择市', trigger: 'change' }
          ],
          area: [
            { required: true, message: '请选择区', trigger: 'change' }
          ],
          schoolId: [
            { required: true, message: '请选择学校', trigger: 'change' }
          ],
          account: [
            { required: true, message: '请输入学校账号', trigger: 'blur' },
            { required: true, validator: validateUserNum, trigger: 'blur' }
          ],
          roleId: [
            { required: true, message: '请选择角色', trigger: 'change' }
          ],
          username: [
            { required: true, message: '请输入联系人姓名', trigger: 'blur' },
            { min: 2, message: '姓名至少两个字符', trigger: 'blur' }
          ],
          tel: [
            { required: true, message: '请输入联系人手机号', trigger: 'blur' },
            { required: true, validator: validateMobile, trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { required: true, validator: validatePassword, trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
        },
        provinceData: [],
        cityData: [],
        areaData: [],
        roleData: [],
        schoolData: []
      }
    },
    methods: {
      getProvince() {
        request.get('/api/auth/v1/chinaArea').then((res) => {
          this.provinceData = res.data;
        })
      },
      getCity() {
        request.get(`/api/auth/v1/chinaArea/${this.ruleForm.province}`).then((res) => {
          this.cityData = res.data;
          this.ruleForm.city = '';
          this.ruleForm.area = '';
          this.ruleForm.schoolId = '';
          this.areaData = [];
          this.schoolData = [];
        })
      },
      getArea() {
        request.get(`/api/auth/v1/chinaArea/${this.ruleForm.city}`).then((res) => {
          this.areaData = res.data;
          this.ruleForm.area = '';
          this.ruleForm.schoolId = '';
          this.schoolData = [];
        })
      },
      getSchool() {
        const provinceItem = this.provinceData.filter(item => item.code == this.ruleForm.province)[0];
        const cityItem = this.cityData.filter(item => item.code == this.ruleForm.city)[0];
        const areaItem = this.areaData.filter(item => item.code == this.ruleForm.area)[0];
        request.get(`/api/auth/v1/school/list`, {
          params: {
            posProvinceId: provinceItem.id,
            posCityId: cityItem.id,
            posDistrictId: areaItem.id
          }
        }).then((res) => {
          this.ruleForm.schoolId = '';
          this.schoolData = res.data
        })
      },
      changeSchool(value){
        if(value && this.schoolData.length==0){
          this.getSchool("nochange");
        }
      },
      getRoleList() {
        request.get(`/api/auth/v1/school/role/list`).then((res) => {
          console.log(res)
          this.roleData = res.data
        })
      },
      saveForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            request.post('/api/auth/v1/school/account', {
              schoolId: this.ruleForm.schoolId,
              roleId: this.ruleForm.roleId,
              account: this.ruleForm.account,
              username: this.ruleForm.username,
              tel: this.ruleForm.tel,
              password: this.ruleForm.password,
              status: this.ruleForm.status
            }).then((res) => {
               this.$router.push({
                path: '/schoolAccount/schoolacmgmt'
              })
            })
          } else {

          }
        })
      },
      goback() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>
  .form-inline {
    display: inline-block;
  }
</style>
