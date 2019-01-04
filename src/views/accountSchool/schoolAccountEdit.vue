<template>
    <div class="contain-vessel">
      <el-form :model="ruleForm" status-icon ref="ruleForm" :rules="rules"
      label-width="120px" class="ke-ruleForm" size="small"
      v-loading="loading" element-loading-text="拼命加载中">
        <el-form-item label="省" prop="province" class="form-inline">
          <el-select size="small"
            v-model="ruleForm.province"
            placeholder="省"
            @change="getCity('nochange')"
            label-width="50px"
          >
            <el-option
              v-for="item in provinceData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市" prop="city" class="form-inline">
          <el-select size="small"
            v-model="ruleForm.city"
            placeholder="市"
            @change="getArea('nochange')"
          >
            <el-option
              v-for="item in cityData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区" prop="area" class="form-inline">
          <el-select size="small"
            v-model="ruleForm.area"
            placeholder="区"
            @change="getSchool('nochange')"
          >
            <el-option
              v-for="item in areaData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
          <el-input size="small" v-model="ruleForm.account" auto-complete="off" placeholder="请输入学校账号"></el-input>
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
        <el-form-item label="状态" prop="status">
          <el-select size="small" v-model="ruleForm.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveForm" size="medium">保存</el-button>
          <el-button @click="goback" size="medium">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import request from '@/utils/request'
  import axios from 'axios'
  import {PASSWORD, PASSWORD_TIP, MOBILE} from '../../utils/validate'

  export default {
    created() {
      this.loading=true;
      axios.all([this.getData(), this.getProvince(), this.getRoleList()])
        .then(axios.spread((res1, res2, res3) => {
          this.loading=false;
          const {account, roleId, school = {}, status, tel, username, posProvinceId, posCityId, posDistrictId} = res1.data;
          this.ruleForm.account = account;
          this.ruleForm.roleId = parseInt(roleId);
          this.ruleForm.schoolId = school.schoolId;
          this.ruleForm.status = `${status}`;
          this.ruleForm.tel = tel;
          this.ruleForm.username = username;
          this.ruleForm.province = school.posProvinceId;
          this.ruleForm.city = school.posCityId;
          this.ruleForm.area = school.posDistrictId;
          console.log(this.provinceData);
          this.provinceData = res2.data;
          this.getCity(this.ruleForm.province);
          this.getArea(this.ruleForm.city);
          this.getSchool();
          this.roleData = res3.data
        })).catch(()=>{
          this.loading=false;
        })
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
      const validateUserNum = (rule, value, callback) => {
        let regExp = /^([a-zA-Z1-9])[-_a-zA-Z0-9]{5,25}$/;
        if (regExp.test(value) === false) {
          callback(new Error('请输入正确的账号(纯数字、纯字母、字母数字组合，6-26位)'));
        } else {
          callback();
        }
      };
      return {
        loading:false,
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
      getData() {
        const id = this.$route.query.id;
        return request.get(`/api/auth/v1/school/account/${id}`);
      },
      getProvince() {
        return request.get('/api/auth/v1/chinaArea')
      },
      getCity(province) {
        console.log("123");
        const provinceId = province || this.ruleForm.province;
        const provinceItem = this.provinceData.filter((item) => {
          return item.id == this.ruleForm.province;
        })
        this.cityData = provinceItem[0].chinaAreaList;
        if (province === 'nochange') {
          this.ruleForm.city = '';
          this.ruleForm.area = '';
          this.ruleForm.schoolId = '';
          this.schoolData = [];
          this.areaData = [];
        }
      },
      getArea(city) {
        const cityId = city || this.ruleForm.city
        const cityItem = this.cityData.filter((item) => {
          return item.id == this.ruleForm.city;
        })
        this.areaData = cityItem[0].chinaAreaList;
        if (city === 'nochange') {
          this.ruleForm.area = '';
          this.ruleForm.schoolId = '';
          this.schoolData = [];
        }
      },
      getSchool(area) {
        request.get(`/api/auth/v1/school/list`, {
          params: {
            posProvinceId: this.ruleForm.province,
            posCityId: this.ruleForm.city,
            posDistrictId: this.ruleForm.area
          }
        }).then((res) => {
          if (area === 'nochange') {
            this.ruleForm.schoolId = '';
          }
          this.schoolData = res.data;
        })
      },
      changeSchool(value){
        if(value && this.schoolData.length==0){
          this.getSchool("nochange");
        }
      },
      getRoleList() {
        return request.get(`/api/auth/v1/school/role/list`);
      },
      saveForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            request.post(`/api/auth/v1/school/account/${this.$route.query.id}`, {
              schoolId: this.ruleForm.schoolId,
              roleId: this.ruleForm.roleId,
              account: this.ruleForm.account,
              username: this.ruleForm.username,
              tel: this.ruleForm.tel,
              status: this.ruleForm.status,
              id: this.$route.query.id
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
      },
      test1() {
        return request.get(`/api/auth/v1/school/account/15`)
      },
      test2() {
        return request.get('/api/auth/v1/chinaArea')
      }
    }
  }
</script>

<style scoped>
  .form-inline {
    display: inline-block;
  }
</style>
