<template>
  <div>
    <div class="search-add">
      <div class="search">
        <span class="address">地址</span>
        <el-select size="small" class="address-select"
          v-model="search.province.value"
          placeholder="请选择省"
          @change="getCity"
          label-width="50px">
          <el-option
            v-for="item in search.province.data"
            :key="item.id"
            :label="item.name"
            :value="item.id" >
          </el-option>
        </el-select>
         <el-select size="small" class="address-select"
          v-model="search.city.value"
          placeholder="请选择市"
          @change="getArea"
          label-width="50px">
          <el-option
            v-for="item in search.city.data"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select size="small" class="address-select"
          v-model="search.area.value"
          placeholder="请选择区"
          label-width="50px">
          <el-option
            v-for="item in search.area.data"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>

        <span class="schoolType">学校类型</span>
        <el-select size="small" class="address-select"
          v-model="search.schoolTypeId.value"
          placeholder="学校类型"
        >
          <el-option
            v-for="item in search.schoolTypeId.data"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
         <span class="schoolType">学校名称</span>
        <el-input v-model="search.schoolName.value" size="small" placeholder="学校名称"  class="address-input"></el-input>

      </div>
      <div class="search-btn">
        <el-button type="primary" size="small" @click="searchList" class="btn">查询</el-button>
        <el-button type="primary" size="small" @click="clearnData" class="btn">重置</el-button>
        <el-button type="primary" size="small" @click="addList"  class="btn" v-show="powerBtn.addBtn">新增学校</el-button>
      </div>
    </div>
    <div class="contain-vessel">
      <el-table
        :data="tableList"
        style="width: 100%;"
        v-loading="loading"
        element-loading-text="拼命加载中"
      >
        <el-table-column
          prop="name"
          label="学校名称"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="dictSchoolTypeName"
          label="学校类型"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="mgmtDeptName"
          label="归属管理"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">{{scope.row.status === 1 ? '启用' : '停用'}}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          header-align="center"
          v-show="powerBtn.alertBtn || powerBtn.detailsBtn"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="modifyList(scope.row,'detail')" v-show="powerBtn.detailsBtn">查看</el-button>
            <el-button type="primary" size="small" @click="modifyList(scope.row,'edit')" v-show="powerBtn.alertBtn">编辑</el-button>
            <!--<el-button type="primary" size="small" @click="deleteList(scope.row)">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <Paging :pageNum="pageNum"
              :pageSize="pageSize"
              :total="total"
              @current="getCurrent"
      >

      </Paging>
    </div>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import parseBase from '@/utils/parseBase';
  import store from '@/utils/store';
  import Paging from '../../components/common/paging'

  export default {
    created() {
      this.getList();
      this.getProvince();
      this.getSchoolType();
      let power=store.local.get("access_token").split(".")[1];
      power=parseBase.decode(power);
      if(power.indexOf("addSchool")<0) this.powerBtn.addBtn=false;
      if(power.indexOf("updateSchool")<0) this.powerBtn.alertBtn=false;
      if(power.indexOf("getSchool")<0) this.powerBtn.detailsBtn=false;
    },
    data() {
      return {
        tableList: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        tableData: {},
        loading:false,
        search:{
          schoolName:{value:''},
          province: {value:"",data:[]},
          city: {value:"",data:[]},
          area: {value:"",data:[]},
          schoolTypeId: {value:"",data:[]}
        },
        loading:false,
        loading:false,
        powerBtn:{
          addBtn:true,
          appenBtn:true,
          detailsBtn:true,
          alertBtn:true,
          deleteBtn:true
        }
      }
    },
    methods: {
      getProvince() {
        request.get('/api/auth/v1/chinaArea').then((res) => {
          this.search.province.data = res.data;
        })
      },
      getSchoolType(){
         request.get('/api/auth/v1/school/type').then((res) => {
          this.search.schoolTypeId.data = res.data;
        })
      },
      getCity(provinceId) {
        const provinceItem = this.search.province.data.filter((item) => {
          return item.id === provinceId;
        })
        this.search.city.data = provinceItem[0].chinaAreaList;
        this.search.city.value = '';
        this.search.area.value = '';
        this.search.area.data = [];
      },
      getArea(cityId) {
        const cityItem = this.search.city.data.filter((item) => {
          return item.id === cityId;
        })
        this.search.area.data = cityItem[0].chinaAreaList;
        this.search.area.value = '';
      },
      modifyList(row,type) {
        var path="";
        if(type=="edit") {
          path='/schoolAccount/schooledit';
        }else{
          path='/schoolAccount/schooldetail';
        }
        this.$router.push({
          path: path,
          query: {id: row.id},
        })
      },
      getList() {
        this.loading=true;
        const params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        this.search.province.value && (params.posProvinceId = this.search.province.value)
        this.search.city.value && (params.posCityId = this.search.city.value)
        this.search.area.value && (params.posDistrictId = this.search.area.value)
        this.search.schoolTypeId.value && (params.schoolTypeId = this.search.schoolTypeId.value)
        this.search.schoolName.value && (params.name = this.search.schoolName.value)
        request.get('/api/auth/v1/school', {
          params
        }).then((res) => {
          this.loading=false;
          this.tableList = res.data.list || [];
          this.tableData = res.data;
          this.total = res.data.total;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
        }).catch(()=>{
          this.loading=false;
        })
      },
      deleteList(row) {
        console.log(row.id);
        this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.delete(`/api/auth/v1/school/role/${row.id}`).then((res) => {
            this.tableList = this.tableList.filter((item) => {
              return item.id != row.id
            })
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(() => {

        });
      },
      addList() {
        this.$router.push({
          path: `/schoolAccount/schooladd`
        })
      },
      getCurrent(current) {
        if (current.currentPage) {
          this.pageNum = current.currentPage;
        }
        if (current.currentSize) {
          this.pageSize = current.currentSize
        }
        this.getList()
      },
      searchList() {
        this.pageSize = 10;
        this.pageNum = 1;
        this.getList();
      },
      clearnData(){
        for(var name in this.search){
          this.search[name].value="";
        }
      }
    },
    components: {
      Paging
    }
  }
</script>

<style lang="scss" scoped>
  .search {
    display: inline-block;
    font-size: 0px;
    margin-bottom : 10px;
    .address{
      display: inline-block;
      width: 40px;
      vertical-align: middle;
      font-size: 14px;
      text-align: right;
    }
    .schoolType{
      display: inline-block;
      width: 60px;
      vertical-align: middle;
      font-size: 14px;
      margin-left: 10px;
      text-align: right;
    }
    .address-select{
      width: 140px;
      vertical-align: middle;
      margin-left: 5px;
    }
    .address-input{
      vertical-align: middle;
    }
  }
  .search-btn{
    display: inline-block;
    vertical-align: middle;
    font-size: 0px;
    margin-left: 0px;
    padding-left: 40px;
    .el-button{
      margin-left: 5px;
    }
  }
  .el-input {
    width: 150px !important;
    margin-left: 5px;
  }
</style>
