<template>
    <div>
      <h2>设备组编码：{{ id }}</h2>
      <div class="container">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="产品名称" class="margin5">
            <el-select v-model="formInline.productId" size="small" placeholder="全部">
              <el-option v-for="(item,index) in productNames" :label="item.name" :value="item.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备号" class="margin5">
            <el-input v-model="formInline.name" size="small" placeholder="请输入设备号"></el-input>
          </el-form-item>
          <el-form-item label="MAC地址" class="margin5">
            <el-input v-model="formInline.mac" size="small" placeholder="请输入MAC地址产品名称"></el-input>
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
          <el-form-item class="margin5">
            <el-button type="primary" plain size="small" v-if="powerBtn.deviceGroupAddBtn" @click="addDevice">添加</el-button>
            <el-button type="info" size="small" @click="exportList()">导出列表</el-button>
            <el-button type="info" size="small" @click="cancel()">取消</el-button>
            <a id="downlink"></a>
          </el-form-item>
        </el-form>
      </div>
      <div class="container">
        <template>
          <el-table
            :data="tableData"
            class="tb-edit"
            style="width: 99%"
            :default-sort = "{prop: 'sort'}"
            highlight-current-row>
            <el-table-column
              prop="sort"
              sortable
              label=""
              align="center"
              width="30">
              <template slot-scope="scope">
                <span>{{scope.row.studentIds}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="sort"
              type="index"
              label="序号"
              align="center"
              width="80">
              <template slot-scope="scope">
                <el-input size="small" sortable v-model="scope.row.sort" @change="handleEdit(scope.row.id, scope.row.sort)"></el-input> <span>{{scope.row.sort}}</span>
              </template>
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
              sortable
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
              width="200">
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
              width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.connectionStatus === 1 ? '已连接' : '未连接'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              v-if="rowStatus !== 1"
              v-show="powerBtn.deviceGroupDeleteBtn"
              width="220">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--<Paging :pageNum="pageNum"-->
                  <!--:pageSize="pageSize"-->
                  <!--:total="total"-->
                  <!--@current="getCurrent"-->
          <!--&gt;</Paging>-->
          <div v-if="powerBtn.deviceGroupDeviceBtn" style="margin-left:30px;">
            <el-button type="primary" size="small" @click="savedSort()">保存序号</el-button>
          </div>
        </template>
        <!--<div>-->
           <!--<p v-for="(item, index) in tableData" :key="index">{{index}}:{{item.id}}  对应  {{item.sort}}</p><br>-->
        <!--</div>-->
      </div>
    </div>
</template>

<script>
  import request from '@/utils/request'
  // import Paging from '../../../components/common/paging'
  import XLSX from 'xlsx'
  import parseBase from '@/utils/parseBase'
  import store from '@/utils/store'
  export default {
    // components: {
    //   Paging
    // },
    created() {
      let power = store.local.get('access_token').split('.')[1];
      power = parseBase.decode(power);
      if (power.indexOf('deviceGroupAddDevice') < 0) this.powerBtn.deviceGroupAddBtn = false;
      if (power.indexOf('deviceGroupDeleteDevice') < 0) this.powerBtn.deviceGroupDeleteBtn = false;
      if (power.indexOf('deviceGroupDeviceModifySort') < 0) this.powerBtn.deviceGroupDeviceBtn = false;
    },
    data() {
      return {
        excelUrl:'',
        id: '',
        rowStatus: '',
        repeat: true,
        deviceGroupId: '',
        pageNum: 1,
        pageSize: 10,
        total: 0,
        size: '',
        pages: '',
        changeStatus: false, // 是否修改了序号，true为修改过
        productNames: [],
        powerBtn: {
          deviceGroupAddBtn: true, // 新增设备
          deviceGroupDeleteBtn: true, // 删除指定设备
          deviceGroupDeviceBtn: true // 保存序号
        },
        formInline: {
          internetNum: '',
          mac: '',
          name: '',
          productId: '',
          sn: '',
          deviceGroupId: '',
          status: ''
        },
        tableData: [],
        deviceIdsSorts: [],
        outFile: '', // 导出文件el
        errorDialog: false, // 错误信息弹窗
        errorMsg: '' // 错误信息内容
      }
    },
    methods: {
      handleEdit(id, sort) {
        this.changeStatus = true;
        this.deviceIdsSorts.push({ deviceId: id, sort: sort })
      },
      getInit() {
        const code = this.$route.query.rowCode;
        const deviceGroupId = this.$route.query.rowId;
        this.rowStatus = this.$route.query.rowStatus;
        this.id = code;
        this.deviceGroupId = deviceGroupId
      },
      searchData() {
        request.get('/api/auth/v1/deviceMgmt/deviceGroup/device', {
          params: {
            mac: this.formInline.mac,
            internetNum: this.formInline.internetNum,
            name: this.formInline.name,
            productId: this.formInline.productId,
            sn: this.formInline.sn,
            deviceGroupId: this.deviceGroupId
          }
        }).then((res) => {
          this.tableData = res.data;
        }).catch((err) => {
          console.log(err);
        })
      },
      addDevice() {
        this.$router.push({
          path: 'addDevice',
          query: { id: this.id, deviceGroupId: this.deviceGroupId }
        })
      },
      cancel() {
        this.$router.go(-1);
      },
      handleDelete(index, row) {
        this.$confirm('是否确定删除？', '警告', {
          distinguishCancelAndClose: true,
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          center: true
        }).then(() => {
          request.delete('/api/auth/v1/deviceMgmt/deviceGroup/device/' + row.id)
            .then((res) => {
              this.$message({
                type: 'success',
                message: '已经成功删除'
              })
              this.searchData();
            })
            .catch((err) => {
              this.$message({
                type: 'info',
                message: '删除失败' + err
              })
            })
        })
      },
      savedSort() { // 修改序号
        // 判断有没有修改，有修改则继续，没有修改则不运行下面代码
        if (this.changeStatus == true) {
          this.yanzheng();
          if (this.repeat) {
            this.$message({
              type: 'error',
              message: '序号有重复,请重新编辑'
            })
          } else {
            request.post('/api/auth/v1/deviceMgmt/deviceGroup/device/sort', {
              devicIdsSorts: this.deviceIdsSorts
            }).then((res) => {
              this.searchData();
              this.$message({
                type: 'success',
                message: '序号修改成功'
              })
              this.changeStatus = false;
            })
          }
        } else {
          this.$message({
            type: 'warning',
            message: '您还没有进行修改'
          })
        }


      },
      yanzheng() {
        let arr = [];
        for (let a = 0; a < this.tableData.length; a++) {
          arr.push(this.tableData[a].sort);
        }
        arr.sort();
        // console.log('arr', arr);
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] == arr[i + 1] && (newArr.indexOf(arr[i]) == -1)) {
            newArr.push(arr[i])
          }
        }
        // console.log('newArr', newArr);
        if (newArr.length > 0) {
          this.repeat = true;
        } else {
          this.repeat = false;
        }
      },
      getProductName() { // 产品名称列表
        request.get('/api/auth/v1/deviceMgmt/product/list').then((res) => {
          // console.log(res + '请求产品类型成功');
          this.productNames = res.data;
          // this.formInline.productId = res.data.productId;
        }).catch((err) => {
          console.log(err)
        })
      },
      // getCurrent(current) { // 分页器
      //   if (current.currentPage) {
      //     this.pageNum = current.currentPage
      //   }
      //   if (current.currentSize) {
      //     this.pageSize = current.currentSize
      //   }
      //   this.searchData()
      // },
      exportList() {
        let obj = {
            mac: this.formInline.mac,
            internetNum: this.formInline.internetNum,
            name: this.formInline.name,
            productId: this.formInline.productId,
            sn: this.formInline.sn,
            deviceGroupId: this.deviceGroupId
        }
        let str = '';
        for(let key in obj){
            if(obj[key]!=''&&obj[key]!=undefined){
                str+=key+'='+obj[key]+'&';
            }
        }
        str = str.slice(0,-1);
        window.open(this.excelUrl + "/api/auth/v1/deviceMgmt/deviceGroup/device/export?"+str)
       
      }
  
    },
    mounted() {
      this.excelUrl = process.env.BASE_API
      this.getInit();
      this.searchData();
      this.getProductName();
      this.outFile = document.getElementById('downlink')
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
  .margin5{
    margin: 5px 15px 5px 0;
  }
  .tb-edit .el-input {
    display: none
  }
  .tb-edit .current-row .el-input {
    display: block
  }
  .tb-edit .current-row .el-input+span {
    display: none
  }
</style>
