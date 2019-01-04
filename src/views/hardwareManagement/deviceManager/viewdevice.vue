<template>
    <div>
      <div class="container">
        <template>
          <el-table
            :data="tableData"
            style="width: 99%">
            <el-table-column
              prop="productId"
              label="产品名称"
              align="center"
              width="120">
              <template slot-scope="scope">
                <span v-for="(item,index) in productNames" :key="index" v-if="scope.row.productId === item.id"> {{item.name}} </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="设备号"
              align="center"
              width="110">
            </el-table-column>
            <el-table-column
              prop="mac"
              align="center"
              label="MAC地址"
              width="200">
            </el-table-column>
            <el-table-column
              prop="internetNum"
              align="center"
              label="物联卡号"
              width="150">
            </el-table-column>
            <el-table-column
              prop="sn"
              align="center"
              label="批次号"
              width="150">
            </el-table-column>
            <el-table-column
              prop="connectionStatus"
              align="center"
              label="连接状态"
              width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.connectionStatus === 1 ? '已连接' : '未连接'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="bindType"
              align="center"
              label="绑定类型"
              width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.bindType === 0">未绑定</span>
                <span v-if="scope.row.bindType === 1">设备组</span>
                <span v-if="scope.row.bindType === 2">个人</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="bindType"
              align="center"
              label="绑定用户">
              <template slot-scope="scope">
                <span v-if="scope.row.bindType === 0">无</span>
                <span v-if="scope.row.bindType === 1">{{scope.row.deviceCode}}</span>
                <span v-if="scope.row.bindType === 2">{{scope.row.studentName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="internetNum"
              align="center"
              label="物联卡号"
              width="100">
            </el-table-column>
          </el-table>
        </template>
      </div>
      <!--<p>设备日志</p>-->
      <!--<div class="container">-->
        <!--<el-form :inline="true" :model="formInline" class="demo-form-inline">-->
          <!--<el-form-item label="生产日期" class="item-dispIb">-->
            <!--<el-date-picker type="date" placeholder="请选择日期" v-model="formInline.produceTime" value-format="yyyy-MM-dd" style="width: 150px;"></el-date-picker>-->
          <!--</el-form-item>-->
          <!--<el-form-item class="item-dispIb">-->
            <!--<el-button type="primary" size="medium" class="demonstration" @click="searchLog('formInline')">查询</el-button>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
        <!--<hr>-->
        <!--<div class="item-log">-->
          <!--日志-->
        <!--</div>-->
      <!--</div>-->
    </div>
</template>

<script>
  import request from '@/utils/request'

  export default {
    data() {
      return {
        formInline: {
          name: '',
          productCategoryId: '',
          mac: '',
          status: ''
        },
        tableData: [],
        productNames: []
      }
    },
    methods: {
      getData() {
        request.get("/api/auth/v1/deviceMgmt/device",{
          params:{
            pageNum: 1,
            pageSize: 10,
            name:this.$route.query.name
          }
        }).then(res=>{
           this.tableData=res.data.list;
        })
        // const userId = this.$route.query.rowId;
        // request.get('/api/auth/v1/deviceMgmt/device/' + userId).then((res) => {
        //   this.tableData.push(res.data);
        // })


      },
      getProductName() { // 产品类型列表
        request.get('/api/auth/v1/deviceMgmt/product/list').then((res) => {
          this.productNames = res.data
        }).catch((err) => {
          console.log(err + '请求产品类型失败')
        })
      },
      searchLog(formName) { // 日志
        // 暂无接口
      }
    },
    mounted() {
      this.getData()
      this.getProductName()
    }
  }
</script>

<style scoped>
  .container{
    background-color: #ffffff;
    border-radius: 10px;
    padding: 5px 0 5px 15px;
    margin-top: 15px;
    font-size: 15px;
  }
  .demonstration{
    margin: 5px 30px 5px 0;
    display: inline-block;
  }
  .item-dispIb{
    display: inline-block;
    margin: 10px 50px 10px 5px;
  }
  .item-log{
    border-top: 1px solid #eeeeee;
  }
</style>
