<template>
  <div>
    <div class="container">
      <!--<h2>产品批次管理</h2>-->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="批次号" class="margin5">
          <el-input v-model="formInline.sn" size="small" placeholder="请输入批次号"></el-input>
        </el-form-item>
        <el-form-item label="产品名称" class="margin5">
          <el-select v-model="formInline.productId" size="small" clearable placeholder="产品名称">
            <el-option v-for="(item,index) in productTypes" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态" class="margin5">
          <el-select v-model="formInline.status" size="small" clearable placeholder="启用状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="margin5">
          <el-button type="primary" size="small" @click="searchData">查询</el-button>
        </el-form-item>
        <el-form-item class="margin5">
          <el-button type="primary" size="small" v-if="powerBtn.addBtn" @click="addProduct">新增批次</el-button>
          <el-button type="info" size="small" @click="exportData">导出列表</el-button>
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
            prop="sn"
            label="批次号"
            align="center"
            width="150">
          </el-table-column>
          <el-table-column
            prop="produceTime"
            label="生产日期"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="deviceCount"
            align="center"
            label="设备数量">
          </el-table-column>
          <el-table-column
            prop="productName"
            align="center"
            label="产品名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="description"
            align="center"
            label="描述">
          </el-table-column>
          <el-table-column
            prop="status"
            align="center"
            label="操作"
            v-if="powerBtn.updateBtn || powerBtn.disableBtn"
            width="220">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="powerBtn.updateBtn"
                plain
                @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <span v-if="powerBtn.disableBtn">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="handleStop(scope.$index, scope.row)" v-if="scope.row.status===1">停用</el-button>
              <el-button
                size="mini"
                type="primary"
                plain
                @click="handleStart(scope.$index, scope.row)" v-if="scope.row.status===0">启用</el-button>
              </span>

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
      if (power.indexOf('addProductBatch') < 0) this.powerBtn.addBtn = false;
      if (power.indexOf('listProductBatch') < 0) this.powerBtn.listBtn = false;
      if (power.indexOf('getProductBatch') < 0) this.powerBtn.getBtn = false;
      if (power.indexOf('updateProductBatch') < 0) this.powerBtn.updateBtn = false;
      if (power.indexOf('disableProductBatch') < 0) this.powerBtn.disableBtn = false
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        size: 10,
        pages: '',
        productTypes: [],
        powerBtn: {
          addBtn: true,
          listBtn: true,
          getBtn: true,
          updateBtn: true,
          disableBtn: true
        },
        formInline: {
          sn: '',
          productId: '',
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
        request.get('/api/auth/v1/deviceMgmt/batch', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }).then((res) => {
          this.tableData = res.data.list || [];
          // console.log(this.tableData);
          this.pageNum = res.data.pageNum;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.size = res.data.size;
          this.pages = res.data.pages;
        })
      },

      searchData() { // 查询
        request.get('/api/auth/v1/deviceMgmt/batch', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            size: this.size,
            sn: this.formInline.sn,
            status: this.formInline.status,
            productId: this.formInline.productId
          }
        }).then((res) => {
          this.tableData = res.data.list;
          // console.log(this.tableData);
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.size = res.data.size;
          this.pages = res.data.pages;
          this.startRow = res.data.startRow;
        })
      },
      addProduct() {
        this.$router.push({
          path: 'batchadd'
        })
      },

      handleEdit(index, row) { // 修改
        this.$router.push({
          path: 'batchedit',
          // query: { rowData: row }
          query: { rowId: row.id }
        })
      },
      handleStop(index, row) {
        this.$confirm('【停用】后，该产品下的所有批次和设备将停用！', '警告', {
          distinguishCancelAndClose: true,
          confirmButtonText: '停用',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            request.post('/api/auth/v1/deviceMgmt/batch/status', {
              status: 0,
              id: row.id
            }).then(() => {
              row.status = 0;
              this.$message({
                type: 'info',
                message: '保存修改'
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '保存修改失败'
              })
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '放弃停用'
            })
          })
        // this.nitiateMode = true
      },
      handleStart(index, row) {
        this.$confirm('【启用】后，该产品下的所有批次和设备将启用，请在启用后重新监听消息。', '警告', {
          distinguishCancelAndClose: true,
          confirmButtonText: '启用',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          request.post('/api/auth/v1/deviceMgmt/batch/status', {
            status: 1,
            id: row.id
          }).then(() => {
            row.status = 1;
            this.$message({
              type: 'info',
              message: '保存修改'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '保存修改失败'
            })
          })
        }).catch(action => {
          this.$message({
            type: 'info',
            message: '放弃启用'
          })
        });
        this.nitiateMode = false
      },

      getProductName() { // 产品名称列表
        request.get('/api/auth/v1/deviceMgmt/product/list').then((res) => {
          this.productTypes = res.data;
          this.formInline.productId = res.data.productId;
        }).catch((err) => {
          // console.log(err + '请求产品类型失败')
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
      exportData() {
        request.get('/api/auth/v1/deviceMgmt/batch', {
          params: {
            pageNum: 1,
            pageSize: 1000, // 最多导出1000条数据
            size: this.size,
            sn: this.formInline.sn,
            status: this.formInline.status,
            productId: this.formInline.productId
          }
        }).then((res) => {
          this.exportList(res.data.list)
        })
      },
      exportList(rs) {
        let data = [{}]
        for (let k in rs[0]) {
          data[0][k] = k
        }
        data = data.concat(rs)
        // console.log(data);
        this.downloadExl(data, '批次管理列表')
      },
      downloadExl: function(json, downName, type) { // 导出到excel
        json[0] = { sn: '批次号', produceTime: '生产日期', deviceCount: '设备数量', productId: '产品Id', productName: '产品名称', description: '描述', status: '启用状态（1为启用）' };
        let keyMap = [] // 获取键
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
