<template>
  <div class="contain-vessel schoolDetail"  v-loading="loading" element-loading-text="拼命加载中">
    <h3>学校详情</h3>
    <el-row class="labelRow">
      <el-col :span="24" >
        <span class="labelName">学校名称</span>
        <span class="labelValue">{{ruleForm.name}}</span>
      </el-col>
      <el-col :span="8">
        <span class="labelName">学校类型</span>
        <span class="labelValue">{{ruleForm.schoolTypeId}}</span>
      </el-col>
      <el-col :span="16">
        <span class="labelName">归属教育机构</span>
        <span class="labelValue">{{ruleForm.atrbPosProvinceId}}{{ruleForm.atrbPosCityId}}{{ruleForm.atrbPosDistrictId}}{{ruleForm.atrbName}}</span>
      </el-col>
      <el-col :span="8">
        <span class="labelName">学校地区类型</span>
        <span class="labelValue">{{ruleForm.schoolDistrictType}}</span>
      </el-col>
      <el-col :span="16">
        <span class="labelName">详细地址</span>
        <span class="labelValue">{{ruleForm.posProvinceId}}{{ruleForm.posCityId}}{{ruleForm.posDistrictId}}{{ruleForm.posDetail}}</span>
      </el-col>
      <el-col :span="8">
        <span class="labelName">学校地理位置经度</span>
        <span class="labelValue">{{ruleForm.longitudeValue}}</span>
      </el-col>
      <el-col :span="8">
        <span class="labelName">学校地理位置纬度</span>
        <span class="labelValue">{{ruleForm.latitudeValue}}</span>
      </el-col>
      <el-col :span="8">
        <span class="labelName">管理端显示经纬坐标点</span>
        <span class="labelValue">{{ruleForm.displayFlag}}</span>
      </el-col>
      <el-col :span="24">
        <span class="labelName">负责人</span>
        <span class="labelValue">{{ruleForm.responsiblePerson}}</span>
      </el-col>
      <el-col :span="24">
        <span class="labelName">联系电话</span>
        <span class="labelValue">{{ruleForm.tel}}</span>
      </el-col>
      <el-col :span="24">
        <span class="labelName">状态</span>
        <span class="labelValue">{{ruleForm.status}}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import request from '@/utils/request'
  export default {
    created() {
      console.log("修改");
      this.loading=true;
      this.$ajax.all([this.getProvince(), this.getData(), this.getSchoolType()])
        .then(this.$ajax.spread((res1, res2, res4) => {
          this.loading=false;
          var data=res2.data;
          for(var name in this.ruleForm){
            if(data[name]){
              this.ruleForm[name]=data[name];
            }
          }
          this.ruleForm.schoolTypeId=this.parseSchoolTypeId(res4.data);
          this.ruleForm.schoolDistrictType = this.ruleForm.schoolDistrictType==1 ? "城市":"农村";
          this.ruleForm.status = this.ruleForm.status==1 ? "启用":"停用";
          this.ruleForm.displayFlag = this.ruleForm.displayFlag==1 ? "是":"否";
          let province=this.parseProvince(res1.data,"atrbPosProvinceId")
          this.ruleForm.atrbPosProvinceId=province.name;
          let cityData=this.getCity(province.data,"atrbPosCityId")
          this.ruleForm.atrbPosCityId=cityData.name;
          let areaData=this.getArea(cityData.data,"atrbPosDistrictId")
          this.ruleForm.atrbPosDistrictId=cityData.areaData;
          province=this.parseProvince(res1.data,"posProvinceId")
          this.ruleForm.posProvinceId=province.name;
          cityData=this.getCity(province.data,"posCityId")
          this.ruleForm.posCityId=cityData.name;
          areaData=this.getArea(cityData.data,"posDistrictId")
          this.ruleForm.posDistrictId=areaData.name;
        //  this.schoolType = res4.data;
        })).catch(()=>{
          this.loading=false;
        })
    },
    data() {
      return {       
        ruleForm: {
            name:"",
            schoolTypeId:"",
            posProvinceId:"",
            posCityId:"",
            posDistrictId:"",
            posDetail:"",
            longitudeValue:"",
            latitudeValue:"",
            displayFlag:"",
            status:"",
            schoolDistrictType:"",
            responsiblePerson:"",
            tel:"",
            atrbPosProvinceId:"",
            atrbPosCityId:"",
            atrbPosDistrictId:"",
            mgmtDeptId:"",
            atrbName:""
        },
        loading:false
      }
    },
    methods: {
      getProvince() {
        return request.get('/api/auth/v1/chinaArea');
      },
      parseSchoolTypeId(data){
        const itemObj=data.filter((item) => {
          return item.id === this.ruleForm.schoolTypeId;
        })
        return itemObj[0].name;
      },
      parseProvince(data,fieldName){
        const itemObj=data.filter((item) => {
          return item.id === this.ruleForm[fieldName];
        })
        return {name:itemObj[0].name,data:itemObj[0].chinaAreaList};
      },
      getCity(data,fieldName) {
        const itemObj=data.filter((item) => {
          return item.id === this.ruleForm[fieldName];
        })
        return {name:itemObj[0].name,data:itemObj[0].chinaAreaList};
      },
      getArea(data,fieldName) {
        const itemObj=data.filter((item) => {
          return item.id === this.ruleForm[fieldName];
        })
        return {name:itemObj[0].name,data:itemObj[0].chinaAreaList};
      },
      getData() {
        const id = this.$route.query.id;
        return request.get(`/api/auth/v1/school/${id}`);
      },
      getSchoolType() {
        return request.get('/api/auth/v1/school/type')
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .labelRow{
    .el-col{
      font-size: 0px;
      margin-bottom: 10px;
      height: 27px;
      line-height: 27px;
      .labelName{
        display: inline-block;
        margin-right: 5px;
        font-size: 15px;
        vertical-align: middle;
      }
      .labelValue{
        display: inline-block;
        font-size: 15px;
        font-weight: 600;
        vertical-align: middle;
      }
    }
  }
  .schoolDetail{
    min-height: 565px;
  }
</style>
