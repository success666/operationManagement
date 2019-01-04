<template>
  <div>
    <div class="container">
      <!--<h2>设备管理</h2>-->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="产品名称" class="margin5">
          <el-select v-model="formInline.productId" size="small" clearable placeholder="产品名称">
            <el-option v-for="(item,index) in productTypes" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
          <!--<el-input v-model="formInline.name" placeholder="请选择产品"></el-input>-->
        </el-form-item>
        <el-form-item label="设备号" class="margin5">
          <el-input v-model="formInline.name" size="small" placeholder="请输入设备号"></el-input>
        </el-form-item>
        <el-form-item label="MAC" class="margin5">
          <el-input v-model="formInline.mac" size="small" placeholder="请输入MAC地址"></el-input>
        </el-form-item>
        <el-form-item label="物联卡" class="margin5">
          <el-input v-model="formInline.internetNum" size="small" placeholder="请输入物联卡号"></el-input>
        </el-form-item>
        <el-form-item label="批次号" class="margin5">
          <el-input v-model="formInline.sn" size="small" placeholder="请输入批次号"></el-input>
        </el-form-item>

        <el-form-item label="连接状态" class="margin5">
          <el-select v-model="formInline.connectionStatus" size="small" clearable placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="未连接" value="0"></el-option>
            <el-option label="已连接" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定类型" class="margin5">
          <el-select v-model="formInline.bindType" size="small" clearable placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="未绑定" value="0"></el-option>
            <el-option label="设备组" value="1"></el-option>
            <el-option label="个人" value="2"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="状态status" class="margin5">-->
          <!--<el-select v-model="formInline.status" size="small" clearable placeholder="全部">-->
            <!--<el-option label="全部" value=null></el-option>-->
            <!--<el-option label="未故障" value="0"></el-option>-->
            <!--<el-option label="故障" value="1"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item class="margin5">
          <el-button type="primary" size="small" @click="searchData">查询</el-button>
        </el-form-item>
        <el-form-item class="margin5">
          <el-button type="primary" size="small" v-if="powerBtn.uploadBtn" @click="importDevice">导入设备</el-button>
          <el-button type="primary" size="small" @click="exportList(tableData)">导出列表</el-button>
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
            width="120">
            <template slot-scope="scope">
            <span v-for="(item,index) in productTypes" :key="index" v-if="scope.row.productId === item.id"> {{item.name}} </span>
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
            label="MAC地址">
          </el-table-column>
          <el-table-column
            prop="internetNum"
            align="center"
            label="物联卡号">
          </el-table-column>
          <el-table-column
            prop="sn"
            align="center"
            label="批次号">
          </el-table-column>
          <el-table-column
            prop="connectionStatus"
            align="center"
            label="连接状态"
            width="80">
            <template slot-scope="scope">
              <span>{{scope.row.connectionStatus === 1 ? '已连接' : '未连接'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="bindType"
            align="center"
            label="绑定类型"
            width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.bindType === 0">未绑定</span>
              <span v-if="scope.row.bindType === 1">设备组</span>
              <span v-if="scope.row.bindType === 2">个人</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="bindingType"
            align="center"
            label="绑定用户">
            <template slot-scope="scope">
              <span v-if="scope.row.bindType === 0">无</span>
              <span v-if="scope.row.bindType === 1">{{scope.row.deviceCode}}</span>
              <span v-if="scope.row.bindType === 2">{{scope.row.studentName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="start"
            align="center"
            label="操作"
            width="220">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain
                v-if="powerBtn.updateBtn"
                @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="primary"
                plain
                v-if="powerBtn.getBtn"
                @click="handleView(scope.$index, scope.row)">查看</el-button>
              <el-button
                size="mini"
                type="primary"
                plain
                v-if="powerBtn.statusBtn"
                @click="handleFault(scope.$index, scope.row)">故障</el-button>
            </template>
          </el-table-column>

        </el-table>
        <Paging :pageNum="pageNum"
                :pageSize="pageSize"
                :total="total"
                @current="getCurrent"
        ></Paging>
      </template>
    </div>

  </div>
</template>

<script>
  import request from '@/utils/request'
  import Paging from '../../../components/common/paging'
  import parseBase from '@/utils/parseBase'
  import store from '@/utils/store'
  export default {
    components: {
      Paging
    },
    created() {
      let power = store.local.get('access_token').split('.')[1];
      power = parseBase.decode(power);
      if (power.indexOf('batchDeviceUpload') < 0) this.powerBtn.uploadBtn = false;
      if (power.indexOf('listDevice') < 0) this.powerBtn.listBtn = false;
      if (power.indexOf('getDevice') < 0) this.powerBtn.getBtn = false;
      if (power.indexOf('updateDevice') < 0) this.powerBtn.updateBtn = false;
      if (power.indexOf('deleteDevice') < 0) this.powerBtn.deleteBtn = false;
      if (power.indexOf('disableDevice') < 0) this.powerBtn.statusBtn = false;
      this.ossUrl = process.env.ossUrl;
    },
    mounted() {
      this.getData();
      this.getProductName();
      this.outFile = document.getElementById('downlink')
    },
    data() {
      return {
        ossUrl: '',
        pageNum: 1,
        pageSize: 10,
        total: 0,
        size: '',
        pages: '',
        productTypes: [],
        powerBtn: {
          uploadBtn: true,
          listBtn: true,
          getBtn: true,
          updateBtn: true,
          deleteBtn: true,
          statusBtn: true
        },
        formInline: {
          name: '',
          productId: '',
          productCategoryId: '',
          mac: '',
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
        request.get('/api/auth/v1/deviceMgmt/device', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            mac: this.mac,
            status: 0
          }
        }).then((res) => {
          this.tableData = res.data.list || [];
          this.pageNum = res.data.pageNum;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.size = res.data.size;
          this.pages = res.data.pages;
        })
      },
      searchData() { // 查询
        request.get('/api/auth/v1/deviceMgmt/device', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            mac: this.formInline.mac,
            connectionStatus: this.formInline.connectionStatus,
            productId: this.formInline.productId,
            name: this.formInline.name,
            internetNum: this.formInline.internetNum,
            sn: this.formInline.sn,
            bindType: this.formInline.bindType,
            // status: this.formInline.status
            status: 0
          }
        }).then((res) => {
          this.tableData = res.data.list;
          this.pageNum = res.data.pageNum;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.size = res.data.size;
          this.pages = res.data.pages;
        })
      },
      importDevice() { // 导入
        this.$router.push({
          path: 'importdevice'
        })
      },
      handleEdit(index, row) { // 修改
        this.$router.push({
          path: 'deviceedit',
          // query: { rowData: row }
          query: { rowId: row.id }
        })
      },
      handleView(index, row) { // 查看
        this.$router.push({
          path: 'viewdevice',
          query: { name: row.name }
          // query: { rowId: row.id }
        })
      },
      handleFault(index, row) {
        this.$confirm('【故障】后，该设备将不再接受数据！', '警告', {
          distinguishCancelAndClose: true,
          confirmButtonText: '停用',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            request.post('/api/auth/v1/deviceMgmt/device/fault', {
              deviceId: row.id,
              status: 1, // 0是有故障，1 无故障
              faultStatus: 1
            }).then(() => {
              // if (row.status === 0) {
              //   row.status = 1
              // } else {
              //   row.status = 0
              // }
              this.$message({
                type: 'info',
                message: '保存修改'
              });
              this.searchData()
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '保存修改失败'
              });
            })
          })
          .catch(action => {
            this.$message({
              type: 'info',
              message: '放弃停用'
            })
          })
      },
      getProductName() { // 产品名称列表
        request.get('/api/auth/v1/deviceMgmt/product/list').then((res) => {
          this.productTypes = res.data;
          this.formInline.productId = res.data.productId
        }).catch((err) => {
          console.log(err)
        })
      },
      getCurrent(current) { // 分页器
        if (current.currentPage) {
          this.pageNum = current.currentPage
        }
        if (current.currentSize) {
          this.pageSize = current.currentSize
        }
        this.searchData()
      },
      exportList(rs) { // 导出列表
        this.formInline.connectionStatus === undefined ? this.formInline.connectionStatus = '' : this.formInline.status = 0;
        this.formInline.name === undefined ? this.formInline.name = '' : this.formInline.status = 0;
        this.formInline.productId === undefined ? this.formInline.productId = '' : this.formInline.status = 0;
        this.formInline.internetNum === undefined ? this.formInline.internetNum = '' : this.formInline.status = 0;
        this.formInline.sn === undefined ? this.formInline.sn = '' : this.formInline.status = 0;
        this.formInline.bindType === undefined ? this.formInline.bindType = '' : this.formInline.status = 0;
        window.open(this.ossUrl + '/api/auth/v1/deviceMgmt/device/export?mac=' +
          this.formInline.mac + '&connectionStatus=' + this.formInline.connectionStatus + '&productId=' + this.formInline.productId + '&name=' + this.formInline.name + '&internetNum=' + this.formInline.internetNum + '&sn=' + this.formInline.sn + '&bindType=' + this.formInline.bindType + '&status=0');
      }
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
