<template>
  <div>
    <div class="container">
      <h2>绑定学校</h2>
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" class="demo-form-inline">
        <el-form-item label="地区" prop="posDetail">
          <el-select
            v-model="ruleForm.posProvinceId"
            clearable
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
            clearable
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
            clearable
            placeholder="区"
            label-width="50px"
            @change="getSchool"
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

        <br>
        <el-form-item label="学校" class="margin5">
          <el-select v-model="schoolId" clearable placeholder="请选择学校">
            <el-option
              v-for="item in schoolList"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
          <!-- <span>{{schoolId}}</span> -->
          <!--<el-select v-model="school">-->
            <!--<el-option-->
              <!--v-for="item in qu1"-->
              <!--:key="item.id"-->
              <!--:label="item.value"-->
              <!--:value="item.id"></el-option>-->
          <!--</el-select>-->

        </el-form-item>

        <el-form-item class="item-dispB">
          <el-button type="primary" size="medium" @click="goBack">返回</el-button>
          <el-button type="primary" size="medium" @click="bindSchool">绑定</el-button>
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
        ruleForm: {
          posProvinceId: '',
          posCityId: '',
          posDistrictId: ''
        },
        schoolList: [], // 学校类型
        schoolId: '',
        deviceGroupId: '',
        provinceData: [], // 省市区
        cityData: [],
        areaData: []
      }
    },
    methods: {
      getCityData() {
        request.get('/api/auth/v1/chinaArea').then((res) => {
          this.provinceData = res.data
        })
      },
      getCity(provinceId) { // 城市
        const provinceItem = this.provinceData.filter((item) => {
          return item.id === provinceId
        })
        this.cityData = provinceItem[0].chinaAreaList;
        this.ruleForm.posCityId = '';
        this.ruleForm.posDistrictId = '';
        this.areaData = []
      },
      getArea(cityId) { // 区
        const cityItem = this.cityData.filter((item) => {
          return item.id === cityId;
        })
        this.areaData = cityItem[0].chinaAreaList;
        this.ruleForm.posDistrictId = ''
      },

      getSchool() {
        this.schoolId = '';
        const params = {};
        const { posProvinceId, posCityId, posDistrictId } = this.ruleForm;
        posProvinceId && (params.posProvinceId = posProvinceId);
        posCityId && (params.posCityId = posCityId);
        posDistrictId && (params.posDistrictId = posDistrictId);
        request.get('/api/auth/v1/school/list', {
          params
        }).then((res) => {
          this.schoolList = res.data;
        })
      },
      bindSchool() { // 绑定学校
        const rowId =  this.$route.query.rowId;
        request.post('/api/auth/v1/deviceMgmt/deviceGroup/bindSchool', {
          deviceGroupId: rowId,
          schoolId: this.schoolId
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '绑定学校成功'
          });
          this.$router.push({
            path: 'deviceGroup'
          })
        })
      },
      goBack() {
        this.$router.push({
          path: 'deviceGroup'
        })
      }
    },
    mounted() {
      this.getCityData();
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
  .margin5{
    margin: 15px 15px 15px 0;
  }
  .item-dispB{
    display: block;
    text-align: center;
    margin: 40px 200px 50px 0;
  }
</style>
