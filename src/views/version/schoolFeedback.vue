<template>
    <div class="schoolFeedback">
      <el-radio-group v-model="tabPosition" @change="phyRouter">
          <el-radio-button label="1">
            <el-badge :is-dot="$store.state.Common.parentNum" class="item">
                家长反馈
            </el-badge>
          </el-radio-button>
          <el-radio-button label="2">
            <el-badge :is-dot="$store.state.Common.schoolNum" class="item">
              学校反馈
            </el-badge>
          </el-radio-button>
      </el-radio-group>
      <el-tabs :tab-position="tabPosition" style="height: 200px;">
        <ProblemList
          :pageNum="pageNum"
          :pageSize="pageSize"
          :tableData="tableData"
          :type="type"
          :total="total"
          @current="getCurrent">
        </ProblemList>
      </el-tabs>
    </div>
</template>

<script>
import request from '@/utils/request'
import requestYapi from '@/utils/requestYapi'
import ProblemList from './problemList';
export default {
  components:{
    "ProblemList":ProblemList
  },
  data(){
    return{
      type:'学校反馈',
      tabPosition:'2',
      tableData:[],
      pageNum:1,
      pageSize:10,
      total:0,
      provinceId:'',
      cityId:'',
      districtId:'',
      schoolId:'',
      schoolName:'',

    }
  },
  methods:{
    getCurrent(current) {
      this.provinceId  = current.searchData.province.value
      this.cityId = current.searchData.city.value
      this.districtId = current.searchData.area.value
      this.schoolId = current.searchData.schoolTypeId.value
      this.schoolName = current.searchData.schoolName.value
      if (current.currentPage) {
          this.pageNum = current.currentPage;
      }
      if (current.currentSize) {
          this.pageSize = current.currentSize;
      }
      this.getTable();
    },
    phyRouter() {
      if (this.tabPosition === '1') {
        this.$router.push('/problemFeedback/parentFeedback')
      } else if (this.tabPosition === '2') {
        this.$router.push('/problemFeedback/schoolFeedback')
      }
    },
    getTable(){
      let params = {
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        provinceId:this.provinceId,
        cityId:this.cityId,
        districtId:this.districtId,
        schoolId:this.schoolId,
        schoolName:this.schoolName,
        type:1
      }
      requestYapi.get('/api/auth/v1/question/sch-sts',{params}).then(res=>{
        this.tableData = res.data.list;
        this.total = res.data.total;
      })
    }
  },
  mounted(){
    this.getTable();
  }
}
</script>
