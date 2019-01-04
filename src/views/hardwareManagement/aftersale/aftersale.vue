<template>
  <div>
    <div class="container">
      <h3>售后管理</h3>
      <el-form :inline="true" :model="formInline" label-width="80px" class="demo-form-inline">
        <el-form-item label="产品名称" class="margin5">
          <el-select v-model="formInline.productId" size="small" clearable placeholder="全部">
            <el-option v-for="(item,index) in productNames" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备号" class="margin5">
          <el-input v-model="formInline.name" size="small" placeholder="请输入设备名称"></el-input>
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
          <el-button type="primary" size="medium" @click="searchData()">查询</el-button>
          <el-button type="info" size="medium" @click="exportList(tableData)">导出列表</el-button>
          <a id="downlink"></a>
        </el-form-item>
      </el-form>
    </div>
    <div class="container">
      <template>
        <el-table
          :data="tableData"
          style="width: 99%">
          <el-table-column
            prop="productId"
            label="产品名称"
            align="center"
            width="150">
            <template slot-scope="scope">
              <span v-for="(item,index) in productNames" :key="index" v-if="scope.row.productId == item.id"> {{item.name}} </span>
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
            width="120">
          </el-table-column>
          <el-table-column
            prop="sn"
            align="center"
            label="批次号">
          </el-table-column>

          <el-table-column
            prop="start"
            align="center"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain
                v-if="powerBtn.statusBtn"
                @click="handleStart(scope.$index, scope.row)">启用</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--<Paging :pageNum="pageNum"-->
                <!--:pageSize="pageSize"-->
                <!--:total="total"-->
                <!--@current="getCurrent"-->
        <!--&gt;</Paging>-->

      </template>
    </div>

  </div>
</template>

<script>
  import request from '@/utils/request'
  // import Paging from '../../../components/common/paging'
  import parseBase from '@/utils/parseBase'
  import store from '@/utils/store'
  export default {
    // components: {
    //   Paging
    // },
    created() {
      let power = store.local.get('access_token').split('.')[1];
      power = parseBase.decode(power);
      if (power.indexOf('listFaultDevice') < 0) this.powerBtn.faultBtn = false;
      if (power.indexOf('disableDevice') < 0) this.powerBtn.statusBtn = false;
      this.ossUrl = process.env.ossUrl;
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        size: '',
        pages: '',
        ossUrl: '',
        productNames: [],
        powerBtn: {
          statusBtn: true,
          faultBtn: true
        },
        formInline: {
          sn: '',
          productId: '',
          name: '',
          mac: '',
          internetNum: '',
          productCategoryId: '',
          status: ''
        },
        tableData: [],
        outFile: '', // 导出文件el
        errorDialog: false, // 错误信息弹窗
        errorMsg: '' // 错误信息内容
      }
    },
    methods: {
      getData() {
        request.get('/api/auth/v1/deviceMgmt/device/fault', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }).then((res) => {
          this.tableData = res.data || [];
          this.pageNum = res.data.pageNum;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.size = res.data.size;
          this.pages = res.data.pages;
        })
      },
      searchData() { // 查询
        request.get('/api/auth/v1/deviceMgmt/device/fault', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            mac: this.formInline.mac,
            internetNum: this.formInline.internetNum,
            name: this.formInline.name,
            productId: this.formInline.productId,
            sn: this.formInline.sn
            // bindType: '',
            // deviceGroupId: ''
          }
        }).then((res) => {
          // this.pageNum = res.data.pageNum;
          // this.pageSize = res.data.pageSize;
          // this.total = res.data.total;
          // this.size = res.data.size;
          // this.pages = res.data.pages;
          this.tableData = res.data
        }).catch((err) => {
          console.log(err)
        })
      },
      getProductName() { // 产品名称列表
        request.get('/api/auth/v1/deviceMgmt/product/list').then((res) => {
          this.productNames = res.data
        }).catch((err) => {
          console.log(err)
        })
      },
      handleStart(index, row) {
        this.$confirm('是否重新启动？', '警告', {
          distinguishCancelAndClose: true,
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          center: true
        }).then(() => {
          request.post('/api/auth/v1/deviceMgmt/device/fault', {
            status: 0,
            deviceId: row.id
          }).then((res) => {
            this.$message({
              type: 'success',
              message: '启动成功!'
            });
            this.searchData()
          }).catch((err) => {
            this.$message({
              type: 'info',
              message: '重新启动失败!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '尚未启动'
          })
        })
      },
      getCurrent(current) { // 分页器
        if (current.currentPage) {
          this.pageNum = current.currentPage
        }
        if (current.currentSize) {
          this.pageSize = current.currentSize
        }
        this.getData()
      },
      exportList(rs) {
        this.formInline.mac === undefined ? this.formInline.mac = '' : this.formInline.status = 0;
        this.formInline.name === undefined ? this.formInline.name = '' : this.formInline.status = 0;
        this.formInline.productId === undefined ? this.formInline.productId = '' : this.formInline.status = 0;
        this.formInline.internetNum === undefined ? this.formInline.internetNum = '' : this.formInline.status = 0;
        this.formInline.sn === undefined ? this.formInline.sn = '' : this.formInline.status = 0;
        window.open(this.ossUrl + '/api/auth/v1/deviceMgmt/device/fault/export?mac=' +
          this.formInline.mac + '&productId=' + this.formInline.productId + '&name=' + this.formInline.name + '&internetNum=' + this.formInline.internetNum + '&sn=' + this.formInline.sn);
      }
    },
    mounted() {
      this.getData();
      this.getProductName();
      this.outFile = document.getElementById('downlink')
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
