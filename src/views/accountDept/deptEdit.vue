<template>
  <div class="contain-vessel"
    v-loading="loading"
    element-loading-text="拼命加载中">
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="140px" class="ke-ruleForm" size="small">
      <el-form-item label="教育机构单位" prop="name">
        <el-input v-model="ruleForm.name" auto-complete="off" placeholder="请输入教育机构单位..."></el-input>
      </el-form-item>
      <el-form-item label="选择管辖范围" prop="jurisdiction">
        <el-select
          v-model="ruleForm.jurisdiction"
          placeholder="管辖范围"
          @change="jurisChange"
        >
          <el-option
            v-for="item in jurisdictionArr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="管辖地区" prop="jurisdictionDistrictId" v-if="ruleForm.jurisdiction && ruleForm.jurisdiction != 1">
        <el-select
          v-model="ruleForm.jurisdictionProvinceId"
          placeholder="省"
          @change="getJurCity('nochange')"
          label-width="50px"
          v-if="ruleForm.jurisdiction && ruleForm.jurisdiction != 1"
        >
          <el-option
            v-for="item in groupProvince"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="ruleForm.jurisdictionCityId"
          placeholder="市"
          @change="getJurArea('nochange')"
          label-width="50px"
          v-if="ruleForm.jurisdiction == 3 || ruleForm.jurisdiction == 4"
        >
          <el-option
            v-for="item in groupCity"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="ruleForm.jurisdictionDistrictId"
          placeholder="区"
          label-width="50px"
          v-if="ruleForm.jurisdiction == 4"
        >
          <el-option
            v-for="item in groupArea"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地区" prop="posDetail">
        <el-select
          v-model="ruleForm.posProvinceId"
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
        <el-select
          v-model="ruleForm.posCityId"
          placeholder="市"
          @change="getArea('nochange')"
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
        >
          <el-option
            v-for="item in areaData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-input v-model="ruleForm.posDetail" auto-complete="off" placeholder="请输入详细地址" style="margin-top: 10px;"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="ruleForm.status" placeholder="请选择状态">
          <el-option label="启用" value="1"></el-option>
          <el-option label="停用" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveForm" size="medium">保存</el-button>
        <el-button @click="goback"  size="medium">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { JURISDICTION } from '@/utils/comData'
  import request from '@/utils/request'
  export default {
    created() {
      this.loading=true;
      this.$ajax.all([this.getProvince(), this.getData()])
        .then(this.$ajax.spread((res1, res2) => {
          this.loading=false;
          const res2Data = res2.data || {};
          this.provinceData = res1.data;
          this.groupProvince = res1.data;
          this.ruleForm.name = res2Data.name;
          this.ruleForm.jurisdiction = res2Data.jurisdiction;
          this.ruleForm.jurisdictionProvinceId = res2Data.jurisdictionProvinceId;
          this.ruleForm.jurisdictionCityId = res2Data.jurisdictionCityId;
          this.ruleForm.jurisdictionDistrictId = res2Data.jurisdictionDistrictId;
          this.ruleForm.posProvinceId = res2Data.posProvinceId;
          this.ruleForm.posCityId = res2Data.posCityId;
          this.ruleForm.posDistrictId = res2Data.posDistrictId;
          this.ruleForm.posDetail = res2Data.posDetail;
          this.ruleForm.status = String(res2Data.status);
          this.getCity(this.ruleForm.posProvinceId);
          this.getArea(this.ruleForm.posCityId);
          if (this.ruleForm.jurisdiction == 3) {
            this.getJurCity(this.ruleForm.jurisdictionProvinceId);
          }
          if (this.ruleForm.jurisdiction == 4) {
            this.getJurCity(this.ruleForm.jurisdictionProvinceId);
            this.getJurArea(this.ruleForm.jurisdictionCityId);
          }
        })).catch(()=>{
          this.loading=false;
        })
    },
    data() {
      const validateDistrictId = (rule, value, callback) => {
        const { jurisdictionProvinceId, jurisdictionCityId, jurisdictionDistrictId, jurisdiction } = this.ruleForm;
        if (jurisdiction == 1) {
          callback()
        } else if (jurisdiction == 2) {
          if (!jurisdictionProvinceId) {
            callback(new Error('请选择管辖地区'))
          } else {
            callback()
          }
        } else if (jurisdiction == 3) {
          if (!jurisdictionProvinceId || !jurisdictionCityId) {
            callback(new Error('请选择管辖地区'))
          } else {
            callback()
          }
        } else if (jurisdiction == 4) {
          if (!jurisdictionProvinceId || !jurisdictionCityId || !jurisdictionDistrictId ) {
            callback(new Error('请输入详细管辖地区'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      const validateposDetail = (rule, value, callback) => {
        const { posProvinceId, posCityId, posDistrictId, posDetail } = this.ruleForm;
        if (!posProvinceId || !posCityId || !posDistrictId || !posDetail ) {
          callback(new Error('请输入详细地区'))
        } else {
          callback()
        }
      }
      return {
        loading:false,
        ruleForm: {
          name: '',
          jurisdiction: '',
          jurisdictionProvinceId: '',
          jurisdictionCityId: '',
          jurisdictionDistrictId: '',
          posProvinceId: '',
          posCityId: '',
          posDistrictId: '',
          posDetail: '',
          status: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入教育机构单位', trigger: 'blur' }
          ],
          jurisdiction: [
            { required: true, message: '请选择管辖范围', trigger: 'change' }
          ],
          jurisdictionDistrictId: [
            { validator: validateDistrictId, required: true, trigger: 'change' }
          ],
          posDetail: [
            { validator: validateposDetail, required: true, trigger: 'change' }
          ],
          status: [
            { required: true, message: '请选择管辖范围', trigger: 'change' }
          ],
        },
        jurisdictionArr: JURISDICTION,
        provinceData: [],
        cityData: [],
        areaData: [],
        groupProvince: [],
        groupCity: [],
        groupArea: [],
      }
    },
    methods: {
      getProvince() {
        return request.get('/api/auth/v1/chinaArea')
      },
      getCity(provinceId) {
        const provinceItem = this.provinceData.filter((item) => {
          return item.id === this.ruleForm.posProvinceId;
        })
        this.cityData = provinceItem[0].chinaAreaList;
        if (provinceId === 'nochange') {
          this.ruleForm.posCityId = '';
          this.ruleForm.posDistrictId = '';
          this.areaData = [];
        }
      },
      getArea(cityId) {
        const cityItem = this.cityData.filter((item) => {
          return item.id === this.ruleForm.posCityId;
        })
        this.areaData = cityItem[0].chinaAreaList;
        if (cityId === 'nochange') {
          this.ruleForm.posDistrictId = '';
        }
      },
      getJurCity(provinceId) {
        const provinceItem = this.groupProvince.filter((item) => {
          return item.id === this.ruleForm.jurisdictionProvinceId;
        })
        this.groupCity = provinceItem[0].chinaAreaList;
        if (provinceId === 'nochange') {
          this.ruleForm.jurisdictionCityId = '';
          this.ruleForm.jurisdictionDistrictId = '';
          this.groupArea = [];
        }
      },
      getJurArea(cityId) {
        const cityItem = this.groupCity.filter((item) => {
          return item.id === this.ruleForm.jurisdictionCityId;
        })
        this.groupArea = cityItem[0].chinaAreaList;
        if (cityId === 'nochange') {
          this.ruleForm.jurisdictionDistrictId = '';
        }
      },
      saveForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            const id = this.$route.query.id;
            request.post(`/api/auth/v1/mgmtDept/${id}`, {
              name: this.ruleForm.name,
              jurisdiction: this.ruleForm.jurisdiction,
              jurisdictionProvinceId: this.ruleForm.jurisdictionProvinceId,
              jurisdictionCityId: this.ruleForm.jurisdictionCityId,
              jurisdictionDistrictId: this.ruleForm.jurisdictionDistrictId,
              posProvinceId: this.ruleForm.posProvinceId,
              posCityId: this.ruleForm.posCityId,
              posDistrictId: this.ruleForm.posDistrictId,
              posDetail: this.ruleForm.posDetail,
              status: this.ruleForm.status,
              id: id
            }).then((res) => {
              this.$router.push({
                path: '/mgmtDeptAccount/deptmgmt'
              })
            })
          }
        })
      },
      goback() {
        this.$router.go(-1);
      },
      getData() {
        const id = this.$route.query.id;
        return request.get(`/api/auth/v1/mgmtDept/${id}`);
      },
      jurisChange(value) {
        if (value == 1) {
          this.ruleForm.jurisdictionProvinceId = '';
          this.ruleForm.jurisdictionCityId = '';
          this.ruleForm.jurisdictionDistrictId = '';
        } else if (value == 2) {
          this.ruleForm.jurisdictionCityId = '';
          this.ruleForm.jurisdictionDistrictId = '';
        } else if (value == 3) {
          this.ruleForm.jurisdictionDistrictId = '';
        }
      }
    }
  }
</script>

<style scoped>

</style>
