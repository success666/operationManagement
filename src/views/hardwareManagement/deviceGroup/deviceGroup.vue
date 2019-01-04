<template>
  <div>
    <div class="container">
      <!--<h2>设备组管理</h2>-->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="设备组编号" class="margin5">
          <el-input v-model="formInline.code" size="small" placeholder="请输入设备组编号"></el-input>
        </el-form-item>

        <el-form-item label="状态" class="margin5">
          <el-select v-model="formInline.status" size="small" style="width:100px" clearable placeholder="请选择">
            <el-option label="全部" value=null></el-option>
            <el-option label="未使用" value="0"></el-option>
            <el-option label="使用中" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定状态" class="margin5">
          <el-select v-model="formInline.bindingType" size="small" style="width:100px" clearable placeholder="请选择">
            <el-option label="全部" value=null></el-option>
            <el-option label="未绑定" value="0"></el-option>
            <el-option label="已绑定" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学校名" class="margin5">
          <el-input v-model="formInline.schoolName" size="small" :disabled="formInline.bindingType==1?false:true" placeholder="请输入学校名"></el-input>
        </el-form-item>
        <el-form-item class="margin5">
          <el-button type="primary" size="small" @click="searchData">查询</el-button>
          <el-button type="primary" size="small" v-if="powerBtn.addBtn" @click="addRow">新增</el-button>
          <el-button type="info" size="small" @click="exportList(tableData)">导出列表</el-button>
          <a id="downlink"></a>
        </el-form-item>

      </el-form>
    </div>
    <div class="container">
      <template>
        <el-table
          :data="tableData"
          @sort-change="sortChange"
          style="width: 99%">
          <el-table-column
            prop="code"
            label="设备组编号"
            sortable="custom"
            
            align="center"
            width="200">
          </el-table-column>
          <el-table-column
            prop="deviceCount"
            label="数量"
            align="center"
            width="120">

          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
            width="250">

          </el-table-column>

          <el-table-column
            prop="status"
            align="center"
            label="状态"
            width="140">
            <template slot-scope="scope">
              <span> {{scope.row.status == 1 ? '使用中' : '未使用'}} </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="schoolName"
            align="center"
            label="绑定类型">
            <template slot-scope="scope">
              <span v-if="scope.row.schoolName"> {{scope.row.schoolName}} </span>
              <span v-else> 未绑定 </span>
            </template>
          </el-table-column>
          <!--<el-table-column-->
            <!--prop="schoolName"-->
            <!--align="center"-->
            <!--label="学校名称"-->
            <!--width="150">-->
          <!--</el-table-column>-->

          <el-table-column
            prop="start"
            align="center"
            label="操作"
            v-if="powerBtn.listDeviceBtn || powerBtn.bindSchoolBtn || powerBtn.deviceGroupDeleteBtn"
            width="250">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="powerBtn.listDeviceBtn"
                plain
                @click="handleView(scope.$index, scope.row)">查看</el-button>
              <el-button
                size="mini"
                type="primary"
                v-if="powerBtn.bindSchoolBtn"
                plain
                @click="handleBind(scope.$index, scope.row)">绑定</el-button>
              <el-button
                size="mini"
                type="primary"
                plain
                @click="importDevData(scope.$index, scope.row)">导入</el-button>
              <!-- <el-button
                size="mini"
                type="primary"
                v-if="powerBtn.deviceGroupDeleteBtn"
                plain
                disabled
                @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
              <!-- <el-button
                size="mini"
                plain
                @click="handleBreak(scope.$index, scope.row)">故障</el-button> -->
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
  import XLSX from 'xlsx'
  import parseBase from '@/utils/parseBase'
  import store from '@/utils/store'
  export default {
    components: {
      Paging
    },
    created() {
      let power = store.local.get('access_token').split('.')[1];
      power = parseBase.decode(power);
      if (power.indexOf('addDeviceGroup') < 0) this.powerBtn.addBtn = false;
      if (power.indexOf('deviceGroupBindSchool') < 0) this.powerBtn.bindSchoolBtn = false;
      if (power.indexOf('listDeviceGroup') < 0) this.powerBtn.listDeviceBtn = false;
      if (power.indexOf('listFaultDevice') < 0) this.powerBtn.listFaultBtn = false;
      if (power.indexOf('deviceGroupListDevice') < 0) this.powerBtn.deviceGroupListBtn = false;
      if (power.indexOf('deleteDeviceGroup') < 0) this.powerBtn.deleteBtn = false
    },
    data() {
      return {
        // codeNum: 1,
        pageNum: 1,
        pageSize: 10,
        total: 0,
        size: '',
        pages: '',
        productTypes: [],
        powerBtn: {
          addBtn: true,
          listDeviceBtn: true,
          listFaultBtn: true,
          deviceGroupListBtn: true,
          deviceGroupAddBtn: true,
          bindSchoolBtn: true,
          deviceGroupDeleteBtn: true,
          deleteBtn: true
        },
        formInline: {
          schoolName:'',
          name: '',
          productCategoryId: '',
          status: '',
          code: ''
        },
        tableOrder:"ascending",
        tableData: [],
        outFile: '', // 导出文件el
        errorDialog: false, // 错误信息弹窗
        errorMsg: '' // 错误信息内容
      }
    },
    methods: {
      importDevData(index,row){
        console.log(row);
        this.$router.push({
          name: 'importDevice',
          params:{
            deviceGroupId:row.id
          }
        })
      },
      sortChange({column, prop, order} ){
        console.log(column, prop, order);
        this.tableOrder=order;
        this.getData();
      },
      addRow() {
        request.post('/api/auth/v1/deviceMgmt/deviceGroup').then((res) => {
          this.getData(10);
          this.$message({
            type: 'success',
            message: '新增成功!'
          });
        })
      },
      getData(e) {
        let api=""
        if(this.tableOrder=="ascending"){
          api="/api/auth/v1/deviceMgmt/deviceGroup"
        }else{
          api="/api/auth/v1/deviceMgmt/deviceGroup/listDeviceGroupDesc"
        }
        request.get(api, {
          params: {
            pageNum: e || this.pageNum,
            pageSize: this.pageSize,
            code: this.formInline.code || null,
            status: this.formInline.status || null,
            bindingType: this.formInline.bindingType || null
          }
        }).then((res) => {
          this.tableData = res.data.list || [];
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.size = res.data.size;
          this.pages = res.data.pages;
        })
      },
      getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        if (hours >= 0 && hours <= 9) {
          hours = "0" + hours;
        }
        if (minutes >= 0 && minutes <= 9) {
          minutes = "0" + minutes;
        }
        if (seconds >= 0 && seconds <= 9) {
          seconds = "0" + seconds;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + " " + hours + seperator2 + minutes + seperator2 + seconds;
        return currentdate;
      },
      searchData() { // 查询
        request.get('/api/auth/v1/deviceMgmt/deviceGroup', {
          params: {
            pageSize: 10,
            pageNum: 1,
            schoolName:this.formInline.schoolName,
            code: this.formInline.code,
            status: this.formInline.status,
            bindingType: this.formInline.bindingType
          }
        }).then((res) => {
          // console.log(res.data);
          this.tableData = res.data.list;
          this.pageNum = res.data.pageNum;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.size = res.data.size;
          this.pages = res.data.pages;
        })
      },
      addProduct() {
        this.$router.push({
          path: 'productadd'
        })
      },
      handleView(index, row) { // 查看
        this.$router.push({
          path: 'viewdevicegroup',
          query: { rowCode: row.code, rowId: row.id, rowStatus: row.status }
        })
      },
      handleBind(index, row) {
        // console.log(row.id);
        this.$router.push({
          path: 'bindschool',
          // query: { rowData: row }
          query: { rowId: row.id }
          // query: { rowId: row.code }
        })
      },
      handleDelete(index, row) { // 删除按钮
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.delete('/api/auth/v1/deviceMgmt/deviceGroup/' + row.id).then((res) => {
            // this.listData = this.listData.filter((item) => {
            //   return item.id != row.id
            // })
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getData()
          }).catch((err) => {
            this.$message({
              type: 'info',
              message: '删除失败!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      getCurrent(current) { // 分页器
        // console.log(current);
        if (current.currentPage) {
          this.pageNum = current.currentPage
        }
        if (current.currentSize) {
          this.pageSize = current.currentSize
        }
        this.getData()
      },
      exportList(rs) {
        let data = [{}];
        for (let k in rs[0]) {
          data[0][k] = k
        }
        data = data.concat(rs);
        this.downloadExl(data, '设备组导出列表')
      },
      downloadExl: function(json, downName, type) { // 导出到excel
        json[0] = { code: '设备组编号', deviceCount: '设备数量', createTime: '创建时间', status: '使用状态', schoolName: '绑定学校' };
        let keyMap = [] // 获取键  表头部分，可设置
        for (let k in json[0]) {
          keyMap.push(k)
        }
        // console.info('keyMap', keyMap, json);
        let tmpdata = [] // 用来保存转换好的json
        json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
          v: v[k],
          position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
        }))).reduce((prev, next) => prev.concat(next)).forEach(function(v) {
          tmpdata[v.position] = { v: v.v }
        });
        let outputPos = Object.keys(tmpdata); // 设置区域,比如表格从A1到D10
        let tmpWB = {
          SheetNames: ['mySheet'], // 保存的表标题
          Sheets: {
            'mySheet': Object.assign({}, tmpdata, { '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] })
          }
        };
        let tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
          { bookType: (type === undefined ? 'xlsx' : type), bookSST: false, type: 'binary' } // 这里的数据是用来定义导出的格式类型
        ))], {
          type: ''
        }); // 创建二进制对象写入转换好的字节流
        var href = URL.createObjectURL(tmpDown); // 创建对象超链接
        this.outFile.download = downName + '.xlsx'; // 下载名称
        this.outFile.href = href; // 绑定a标签
        this.outFile.click(); // 模拟点击实现下载
        setTimeout(function() { // 延时释放
          URL.revokeObjectURL(tmpDown) // 用URL.revokeObjectURL()来释放这个object URL
        }, 100)
      }, // 导出使用
      s2ab: function(s) { // 字符串转字符流
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (var i = 0; i !== s.length; ++i) {
          view[i] = s.charCodeAt(i) & 0xFF
        }
        return buf
      },
      getCharCol: function(n) { // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
        let s = '';
        let m = 0;
        while (n > 0) {
          m = n % 26 + 1;
          s = String.fromCharCode(m + 64) + s;
          n = (n - m) / 26
        }
        return s
      }
    },
    mounted() {
      this.getData();
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
