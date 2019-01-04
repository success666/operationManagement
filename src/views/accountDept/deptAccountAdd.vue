<template>
  <div class="contain-vessel">
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="140px" class="ke-ruleForm" size="small">
      <el-form-item label="选择教育机构单位" prop="mgmtDeptId">
        <el-select
          v-model="ruleForm.posProvinceId"
          placeholder="省"
          @change="getCity"
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
        <el-select
          v-model="ruleForm.posCityId"
          placeholder="市"
          @change="getArea"
          label-width="50px"
        >
          <el-option
            v-for="item in cityData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="ruleForm.posDistrictId"
          placeholder="区"
          label-width="50px"
          @change="getDept"
        >
          <el-option
            v-for="item in areaData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <div style="margin-top: 10px;">
          <el-select
            v-model="ruleForm.mgmtDeptId"
            placeholder="教育机构"
          >
            <el-option
              v-for="item in mgmtList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="教育机构账号" prop="account">
        <el-input v-model="ruleForm.account" auto-complete="off" placeholder="请输入教育机构账号..."></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="ruleForm.roleId" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系人姓名" prop="username">
        <el-input v-model="ruleForm.username" auto-complete="off" placeholder="请输入联系人姓名..."></el-input>
      </el-form-item>
      <el-form-item label="联系人手机号" prop="tel">
        <el-input v-model="ruleForm.tel" auto-complete="off" placeholder="请输入联系人手机号..."></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码..."></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="ruleForm.status" placeholder="请选择状态">
          <el-option label="启用" value="1"></el-option>
          <el-option label="停用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveForm"  size="medium">保存</el-button>
        <el-button @click="goback"  size="medium">取消</el-button>
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
      this.getRole();
      this.getDept();
    },
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else if (!PASSWORD.test(value)) {
          callback(new Error(PASSWORD_TIP));
        } else {
          callback();
        }
      };
      const validateMobile = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else if (!MOBILE.test(value)) {
          callback(new Error('请输入正确的手机号码'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          mgmtDeptId: '',
          account: '',
          roleId: '',
          username: '',
          tel: '',
          password: '',
          status: '',
          posProvinceId: '',
          posCityId: '',
          posDistrictId: '',
        },
        rules: {
          mgmtDeptId: [
            { required: true, message: '请选择教育机构单位', trigger: 'change' }
          ],
          account: [
            { required: true, message: '请选择教育机构账号', trigger: 'blur' }
          ],
          roleId: [
            { required: true, message: '请选择角色', trigger: 'change' }
          ],
          username: [
            { required: true, message: '请输入联系人姓名', trigger: 'blur' }
          ],
          tel: [
            { required: true, validator: validateMobile, trigger: 'blur' }
          ],
          password: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
        },
        roleList: [],
        mgmtList: [],
        provinceData: [],
        cityData: [],
        areaData: []
      }
    },
    methods: {
      getProvince() {
        request.get('/api/auth/v1/chinaArea').then((res) => {
          this.provinceData = res.data;
        })
      },
      getCity(provinceId) {
        const provinceItem = this.provinceData.filter((item) => {
          return item.id === provinceId;
        })
        this.cityData = provinceItem[0].chinaAreaList;
        this.ruleForm.posCityId = '';
        this.ruleForm.posDistrictId = '';
        this.areaData = [];
        this.getDept();
      },
      getArea(cityId) {
        const cityItem = this.cityData.filter((item) => {
          return item.id === cityId;
        })
        this.areaData = cityItem[0].chinaAreaList;
        this.ruleForm.posDistrictId = '';
        this.getDept();
      },
      getRole() {
        request.get('/api/auth/v1/mgmtDept/role/list').then((res) => {
          this.roleList = res.data;
        })
      },
      getDept() {
        const params = {};
        const { posProvinceId, posCityId, posDistrictId } = this.ruleForm;
        posProvinceId && (params.posProvinceId = posProvinceId);
        posCityId && (params.posCityId = posCityId);
        posDistrictId && (params.posDistrictId = posDistrictId);
        request.get('/api/auth/v1/mgmtDept/list', {
          params
        }).then((res) => {
          this.mgmtList = res.data;
        })
      },
      saveForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            request.post('/api/auth/v1/mgmtDept/account', {
              account: this.ruleForm.account,
              mgmtDeptId: this.ruleForm.mgmtDeptId,
              roleId: this.ruleForm.roleId,
              username: this.ruleForm.username,
              tel: this.ruleForm.tel,
              password: this.ruleForm.password,
              status: this.ruleForm.status
            }).then((res) => {
              this.$router.push({
                path: '/mgmtDeptAccount/deptaccountmgmt'
              })
            })
          }
        })
      },
      goback() {
        this.$router.go(-1);
      }
    }
  }
</script>

<style scoped>

</style>
