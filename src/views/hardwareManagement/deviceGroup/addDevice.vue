<template>
  <div>
    <h2>设备组编码：{{ id }}</h2>
    <div class="container">
      <!--<h2>添加设备</h2>-->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">

        <el-form-item label="产品名称" class="margin5">
          <el-select v-model="formInline.productId" size="small" placeholder="产品名称">
            <el-option v-for="(item,index) in productNames" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备号" class="margin5">
          <el-input v-model="formInline.name" size="small" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="MAC地址" class="margin5">
          <el-input v-model="formInline.mac" size="small" placeholder="请输入MAC地址"></el-input>
        </el-form-item>
        <el-form-item label="物联卡号" class="margin5">
          <el-input v-model="formInline.internetNum" size="small" placeholder="请输入物联卡号"></el-input>
        </el-form-item>
        <el-form-item label="批次号" class="margin5">
          <el-input v-model="formInline.sn" size="small" placeholder="请输入批次号"></el-input>
        </el-form-item>

        <el-form-item class="margin5">
          <el-button type="primary" size="small" @click="searchData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="container">
      <template>
        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 99%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="productId"
            label="产品名称"
            align="center"
            width="150">
            <template slot-scope="scope">
              <span v-for="(item,index) in productNames" :key="index" v-if="scope.row.productId === item.id"> {{item.name}} </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="设备号"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="mac"
            align="center"
            label="MAC地址">
          </el-table-column>
          <el-table-column
            prop="internetNum"
            align="center"
            label="物联卡号"
            width="220">
          </el-table-column>
          <el-table-column
            prop="sn"
            align="center"
            label="批次号">
          </el-table-column>
        </el-table>

        <Paging :pageNum="pageNum"
                :pageSize="pageSize"
                :total="total"
                @current="getCurrent">
        </Paging>

        <div style="margin-top: 32px;">
          <el-button size="small" @click="toggleSelection(tableData)">全选/反选</el-button>
          <el-button type="primary" size="small" @click="toggleSelection()">取消选择</el-button>
          <el-button type="primary" size="small" @click="submitData()">保存</el-button>
          <el-button type="info" size="small" @click="cancel()">取消</el-button>
          <!--<span>{{savestate}}</span>-->
        </div>
        <!-- <p v-for="item in multipleSelection">{{item.id}}</p> -->

      </template>
    </div>

  </div>
</template>

<script>
  import request from '@/utils/request'
  import Paging from '../../../components/common/paging'

  export default {
    components: {
      Paging
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        size: '',
        pages: '',
        productNames: [],
        formInline: {
          name: '',
          mac: '',
          sn: '',
          productId: '',
          internetNum: ''
        },
        id: '',
        savestate: true,
        deviceIds: [],
        tableData: [],
        multipleSelection: [] // 表格选中项
      }
    },
    methods: {
      getData() {
        const code = this.$route.query.id;
        this.id = code;
        const deviceGroupId = this.$route.query.deviceGroupId;
        this.deviceGroupId = deviceGroupId;
        // request.get('/api/auth/v1/deviceMgmt/device/list').then((res) => {
        request.get('/api/auth/v1/deviceMgmt/deviceGroup/addDeviceList', {
          params: {
            bindType:0,
            // pageNum: pageNum || this.pageNum,
            // pageSize: this.pageSize
          }
        }).then((res) => {
          // console.log(res);
          this.tableData = res.data.list;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
        })
      },
      searchData() { // 查询
        // request.get('/api/auth/v1/deviceMgmt/device/list', {
        request.get('/api/auth/v1/deviceMgmt/deviceGroup/addDeviceList', {
          params: {
            mac: this.formInline.mac,
            internetNum: this.formInline.internetNum,
            name: this.formInline.name,
            productId: this.formInline.productId,
            sn: this.formInline.sn,
            bindType: 0,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }).then((res) => {
          this.tableData = res.data.list;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
        })
      },
      cancel() {
        if (this.savestate === false) {
          this.$confirm('尚未保存，是否取消！', '警告', {
            distinguishCancelAndClose: true,
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning',
            center: true
          }).then(() => {
            this.$router.go(-1)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '您尚未保存'
            })
          })
        } else {
          this.$router.go(-1)
        }
      },
      toggleSelection(rows) { // 全选/反选
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      handleSelectionChange(val) { // 选中的值
        this.multipleSelection = val;
        this.savestate = false;
        let deviceIds = [];
        this.multipleSelection.forEach(function(v) { deviceIds.push(v.id) });
        this.deviceIds = deviceIds;
        // console.log(this.deviceIds);
      },
      submitData(index, row) { // 保存按钮
        request.post('/api/auth/v1/deviceMgmt/deviceGroup/addDevice', {
          deviceGroupId: this.deviceGroupId, // 设备组id
          // deviceGroupId: this.id,
          deviceIds: this.deviceIds
        }).then((res) => {
          // console.log(res + '保存成功')
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.savestate = true;
          this.$router.go(-1);
        }).catch((err) => {
          // console.log(err + '保存操作失败')
        })
      },
      getProductName() { // 产品名称列表
        request.get('/api/auth/v1/deviceMgmt/product/list').then((res) => {
          this.productNames = res.data
        }).catch((err) => {
          // console.log(err + '请求产品类型失败')
        })
      },
      getCurrent(current) { // 分页器
        console.log(current);
        if (current.currentPage) {
          this.pageNum = current.currentPage
        }
        if (current.currentSize) {
          this.pageSize = current.currentSize
        }
        this.searchData()
      }
    },
    mounted() {
      this.getData();
      this.getProductName()
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
    margin: 5px 15px 5px 0;
  }

</style>
