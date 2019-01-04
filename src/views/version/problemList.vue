<template>
    <div class="problemList">
      <div class="title">
        <el-tabs :tab-position="tabPosition">
          <span>地区</span>
          <el-select size="small" class="problemFeedback-select"
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
         <el-select size="small" class="problemFeedback-select"
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
        <el-select size="small" class="problemFeedback-select"
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
        <el-select size="small" class="problemFeedback-select"
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
        <el-input v-model="search.schoolName.value" size="small" placeholder="请输入学校名称"   class="schoolName"></el-input>
          <div class="search-btn">
            <el-button type="primary" size="small" @click="searchList" class="btn">查询</el-button>
            <el-button type="primary" size="small" @click="clearnData" class="btn">重置</el-button>
          </div>
        </el-tabs>
      </div>
        
      <div class="tabel">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              align="center"
              label="地区">
              <template slot-scope="scope">{{ scope.row.provinceName + scope.row.cityName + scope.row.districtName }}</template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="schoolTypeName"
              label="学校类型">
            </el-table-column>
            <el-table-column
              align="center"
              prop="schoolName"
              label="学校">
            </el-table-column>
            <el-table-column
              align="center"
              prop="number"
              label="问题（个）">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">
                    <el-badge v-if="scope.row.status == '0'" is-dot class="item">
                      查看
                    </el-badge>
                    <span v-else is-dot>
                      查看
                    </span>
                  </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[5, 10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>

    </div>
</template>

<script>
import request from '@/utils/request'
export default {
    data(){
        return{
          tabPosition: '1',
          search:{
            schoolName:{value:''},
            province: {value:"",data:[]},
            city: {value:"",data:[]},
            area: {value:"",data:[]},
            schoolTypeId: {value:"",data:[]}
          },
        }
    },
    props:["pageNum","pageSize","total","tableData","type"],
    methods:{
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.$emit('current', {currentSize: val,searchData:this.search});
            
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.$emit('current', {currentPage: val,searchData:this.search});
          
      },
       handleEdit(index, row) {
        this.$router.push({
          path: "/problemFeedback/problemLook",
          query: {
            schoolId:row.schoolId,
            title:this.type + ' - ' + row.schoolName
          }
        });
      },
      getProvince() {
        request.get('/api/auth/v1/chinaArea').then((res) => {
          this.search.province.data = res.data;
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
      getSchoolType(){
         request.get('/api/auth/v1/school/type').then((res) => {
          this.search.schoolTypeId.data = res.data;
        })
      },
      clearnData(){
        for(var name in this.search){
          this.search[name].value="";
        }
      },
      searchList(){
        this.$emit('current', {searchData:this.search});
      }
    },
    mounted(){
      this.getProvince();
      this.getSchoolType();
    }
}
</script>
<style lang="scss">
  .problemList{
    .title{
      background: #fff;
      border-radius: 12px;
      padding:0px 10px 14px 10px;
      margin-bottom: 20px;
    }
    .tabel{
      border-radius: 14px;
      overflow: hidden;
      
    }
    .problemFeedback-select{
      width: 160px;
    }
    .schoolName{
      width: 200px;
    }
    .search-btn{
      float:right;
    }
    .page{
      height: 70px;
      padding-top:4px;
      padding-right: 20px;
      float:right;
      .el-pagination{
        padding-top:20px;
      }
    }
  }
</style>
