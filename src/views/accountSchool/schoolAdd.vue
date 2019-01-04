<template>
  <div class="contain-vessel">
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="140px" class="ke-ruleForm" size="small">
      <el-form-item label="学校名称" prop="name">
        <el-input v-model="ruleForm.name" auto-complete="off" placeholder="请输入学校名称" class="item-input"></el-input>
      </el-form-item>
      <el-form-item label="学校类型" prop="schoolTypeId">
        <el-select
          v-model="ruleForm.schoolTypeId"
          placeholder="学校类型"
        >
          <el-option
            v-for="item in schoolType"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址" prop="posDetail">
        <el-select class="item-select"
          v-model="ruleForm.province"
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
        <el-select class="item-select"
          v-model="ruleForm.city"
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
        <el-select class="item-select"
          v-model="ruleForm.area"
          placeholder="区"
          label-width="50px"
        >
          <el-option
            v-for="item in areaData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-input class="item-input" v-model="ruleForm.posDetail" auto-complete="off" placeholder="请输入详细地址" ></el-input>
      </el-form-item>
      <el-form-item label="学校地区类型" prop="schoolDistrictType">
        <el-radio v-model="ruleForm.schoolDistrictType" label="1">城市</el-radio>
        <el-radio v-model="ruleForm.schoolDistrictType" label="2">农村</el-radio>
      </el-form-item>
      <el-form-item label="学校地理位置经度" prop="longitudeValue" label-width="140px" class="item-col">
        <el-input v-model="ruleForm.longitudeValue" auto-complete="off"  placeholder="请输入学校地理位置经度"></el-input>
      </el-form-item>
      <el-form-item label="学校地理位置纬度" prop="latitudeValue" class="item-col">
        <el-input v-model="ruleForm.latitudeValue" auto-complete="off"  placeholder="请输入学校地理位置纬度"></el-input>
      </el-form-item>
      <el-form-item label="是否在管理端显示坐标点" prop="displayFlag" label-width="183px">
        <el-radio-group v-model="ruleForm.displayFlag">
          <el-radio label="1">是</el-radio>
          <el-radio label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="归属教育机构" prop="mgmtDeptId">
        <el-select class="item-select"
          v-model="ruleForm.groupProvinceId"
          placeholder="省"
          @change="getGroupCity"
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
        <el-select class="item-select"
          v-model="ruleForm.groupCityId"
          placeholder="市"
          @change="getGroupArea"
          label-width="50px"
        >
          <el-option
            v-for="item in groupCity"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-select class="item-select"
          v-model="ruleForm.groupAreaId"
          placeholder="区"
          label-width="50px"
          @change="getMgmt"
        >
          <el-option
            v-for="item in groupArea"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-select style="width:300px;"
          v-model="ruleForm.mgmtDeptId"
          placeholder="归属教育机构"
          label-width="50px"
        >
          <el-option
            v-for="item in mgmtArr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="ruleForm.status" placeholder="请选择状态">
          <el-option label="启用" value="1"></el-option>
          <el-option label="停用" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="responsiblePerson">
        <el-input v-model="ruleForm.responsiblePerson" class="item-input1" placeholder="请输入负责人姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="tel">
        <el-input v-model="ruleForm.tel" class="item-input1" placeholder="请输入联系电话"></el-input>
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
  export default {
    created() {
      this.getProvince();
      this.getSchoolType();
      this.getMgmt();
    },
    data() {
      const validateMobile = (rule, value, callback) => {
        let regExp = /^(0[0-9]{2,3}-)?([0-9]{7,11})+(-[0-9]{1,4})?$/;
        if (regExp.test(value) === false) {
          callback(new Error('请输入正确的座机或手机号码,如020-8888888或13812345678'));
        } else {
          callback();
        }
      };
      const validateDetail = (rule, value, callback) => {
        const { province, city, area, posDetail } = this.ruleForm;
        if (!province || !city || !area || !posDetail) {
          callback(new Error('请输入详细地址'))
        } else {
          callback()
        }
      };
      const valLongitude=(rule,value,callback) => {
        if (value === '') {
          callback(new Error('请输入经度值'));
        }
        if(isNaN(value)){
          callback(new Error('只能输入数字'));
        }
        if (value < 0 || value > 180) {
          return callback(new Error('请输入正确的经度值，值的范围在0-180'))
        } else {
          value = value.toString();
          const valueIndex = value.indexOf(".");
          if (valueIndex >= 0) {
            if (valueIndex+6 < value.length-1) {
              callback(new Error('请保留小数点后6位'))
            } else {
              callback();
            }
          } else {
            callback();
          }
        }
      }
      const valLatitude = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请输入纬度值'));
        }
        if (isNaN(value)) {
          callback(new Error('只能输入数字'));
        }
        if (value<0||value>90) {
          callback(new Error('请输入正确的纬度值，值的范围在0-90'))
        } else {
          value = value.toString();
          const valueIndex = value.indexOf(".");
          if (valueIndex >= 0) {
            if (valueIndex+6 < value.length-1) {
              callback(new Error('请保留小数点后6位'))
            } else {
              callback();
            }
          } else {
            callback();
          }
        }
      };
      return {
        ruleForm: {
          name: '',
          schoolTypeId: '',
          province: '',
          city: '',
          area: '',
          posDetail: '',
          longitudeValue: '',
          latitudeValue: '',
          displayFlag: '',
          mgmtDeptId: '',
          status: '',
          groupProvinceId: '',
          groupCityId: '',
          groupAreaId: '',
          schoolDistrictType: '',
          responsiblePerson: '',
          tel: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入学校名称', trigger: 'blur' }
          ],
          schoolTypeId: [
            { required: true, message: '请选择学校类型', trigger: 'change' }
          ],
          province: [
            { required: true, message: '请选择省', trigger: 'change' }
          ],
          city: [
            { required: true, message: '请选择市', trigger: 'change' }
          ],
          area: [
            { required: true, message: '请选择区', trigger: 'change' }
          ],
          posDetail: [
            { validator: validateDetail, required: true, message: '请输入学校详细地址', trigger: 'blur' }
          ],
          schoolDistrictType: [
            { required: true, message: '请选择学校地区类型', trigger: 'change' }
          ],
          longitudeValue: [
            { required: true, trigger: 'blur', validator: valLongitude }
          ],
          latitudeValue: [
            { required: true, trigger: 'blur', validator: valLatitude }
          ],
          displayFlag: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          mgmtDeptId: [
            { required: true, message: '请选择归属教育机构', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          responsiblePerson: [
            { required: true, message: '请输入联系人', trigger: 'blur' }
          ],
          tel: [
            { required: true, message: '请输入电话号码', trigger: 'blur' },
            { required: true, validator: validateMobile, trigger: 'blur' }
          ]
        },
        schoolType: [],
        provinceData: [],
        cityData: [],
        areaData: [],
        groupProvince: [],
        groupCity: [],
        groupArea: [],
        mgmtArr: []
      }
    },
    methods: {
      getProvince() {
        request.get('/api/auth/v1/chinaArea').then((res) => {
          this.provinceData = res.data;
          this.groupProvince = res.data;
        })
      },
      getCity(provinceId) {
        const provinceItem = this.provinceData.filter((item) => {
          return item.id === provinceId;
        })
        this.cityData = provinceItem[0].chinaAreaList;
        this.ruleForm.city = '';
        this.ruleForm.area = '';
        this.areaData = [];
      },
      getArea(cityId) {
        const cityItem = this.cityData.filter((item) => {
          return item.id === cityId;
        })
        this.areaData = cityItem[0].chinaAreaList;
        this.ruleForm.area = '';
      },
      getGroupCity(provinceId) {
        const provinceItem = this.groupProvince.filter((item) => {
          return item.id === provinceId;
        })
        this.groupCity = provinceItem[0].chinaAreaList;
        this.ruleForm.groupCityId = '';
        this.ruleForm.groupAreaId = '';
        this.groupArea = [];
        this.ruleForm.mgmtDeptId = '';
        this.mgmtArr = [];
        this.getMgmt();
      },
      getGroupArea(cityId) {
        const cityItem = this.groupCity.filter((item) => {
          return item.id === cityId;
        })
        this.groupArea = cityItem[0].chinaAreaList;
        this.ruleForm.groupAreaId = '';
        this.ruleForm.mgmtDeptId = '';
        this.mgmtArr = [];
        this.getMgmt();
      },
      getMgmt() {
        const params = {};
        const {groupProvinceId, groupCityId, groupAreaId} = this.ruleForm;
        groupProvinceId && (params.posProvinceId = groupProvinceId);
        groupCityId && (params.posCityId = groupCityId);
        groupAreaId && (params.posDistrictId = groupAreaId);
        request.get('/api/auth/v1/mgmtDept/listByArea', {
          params: params
        }).then((res) => {
          this.mgmtArr = res.data
        })
      },
      getSchoolType() {
        request.get('/api/auth/v1/school/type').then((res) => {
          this.schoolType = res.data;
        })
      },
      saveForm() {
        console.log("保存")
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            request.post('/api/auth/v1/school', {
              name: this.ruleForm.name,
              schoolTypeId: this.ruleForm.schoolTypeId,
              posProvinceId: this.ruleForm.province,
              posCityId: this.ruleForm.city,
              posDistrictId: this.ruleForm.area,
              posDetail: this.ruleForm.posDetail,
              longitudeValue: this.ruleForm.longitudeValue,
              latitudeValue: this.ruleForm.latitudeValue,
              displayFlag: this.ruleForm.displayFlag,
              atrbPosProvinceId: this.ruleForm.groupProvinceId,
              atrbPosCityId: this.ruleForm.groupCityId,
              atrbPosDistrictId: this.ruleForm.groupAreaId,
              mgmtDeptId: this.ruleForm.mgmtDeptId,
              status: this.ruleForm.status,
              schoolDistrictType:this.ruleForm.schoolDistrictType,
              responsiblePerson:this.ruleForm.responsiblePerson,
              tel:this.ruleForm.tel
            }).then((res) => {
              this.$router.push({
                path: '/schoolAccount/schoolmgmt'
              })
            }).catch(()=>{
              console.log("保存")
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

<style rel="stylesheet/scss" lang="scss" scoped>
  .form-inline {
    display: inline-block;
  }
  .contain-vessel{
    .item-col{
      width: 300px;
      display: inline-block;
    }
    .item-select{
      width: 120px;
      vertical-align: middle;
    }
    .item-input{
      width: 300px;
      vertical-align: middle;
    }
    .item-input1{
      width: 150px;
      vertical-align: middle;
    }
  }
</style>
