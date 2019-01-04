<template>
  <div>
    <h3 class="item-title">固件名称： {{ name }}</h3>
    <div class="container">
      <el-form :inline="true" :model="formInline" label-width="80px" class="demo-form-inline">
        <el-form-item label="产品名称" class="margin5">
          <el-select v-model="formInline.productId" size="small" clearable placeholder="全部">
            <el-option v-for="(item,index) in productNames" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备号" class="margin5">
          <el-input v-model="formInline.name" size="small" placeholder="请输入产品名称"></el-input>
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
        <el-form-item label="绑定类型" class="margin5">
          <el-select v-model="formInline.bindType" size="small" clearable placeholder="请选择">
            <el-option label="全部" value="">全部</el-option>
            <el-option label="已绑定" value="1">已绑定</el-option>
            <el-option label="未绑定" value="0">未绑定</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="连接状态" class="margin5">
          <el-select v-model="formInline.connectionStatus" size="small" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="已连接" value="1"></el-option>
            <el-option label="未连接" value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="margin5">
          <el-button type="primary" size="small" @click="searchData">查询</el-button>
          <el-button type="info" size="small" @click="exportList(tableData)">导出列表</el-button>
          <el-button type="info" size="small" @click="cancel">返回</el-button>
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
            width="140">
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
              <span v-if="scope.row.bindType === 1">学校</span>
              <span v-if="scope.row.bindType === 2">个人</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createUser"
            align="center"
            label="绑定用户">
            <template slot-scope="scope">
              <span v-if="scope.row.bindType === 0">无</span>
              <span v-if="scope.row.bindType === 1">{{scope.row.schoolName}}</span>
              <span v-if="scope.row.bindType === 2">{{scope.row.studentName}}</span>
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

  export default {
    components: {
      Paging
    },
    data() {
      return {
        // nitiateMode: false,
        name: '',
        pageNum: 1,
        pageSize: 10,
        total: 0,
        size: '',
        pages: '',
        productNames: [],
        formInline: {
          name: '',
          mac: '',
          connectionStatus: '',
          productId: '',
          sn: '',
          internetNum: '',
          bindType: ''
        },
        tableData: [],
        outFile: '', // 导出文件el
        errorDialog: false, // 错误信息弹窗
        errorMsg: '' // 错误信息内容
      }
    },
    methods: {
      getData() {
        const rowData =  this.$route.query.rowData;
        this.name = rowData.name;
        // const firmwareId = rowData.id;
        const productId = rowData.productId;
        if (productId) {
          request.get('/api/auth/v1/deviceMgmt/device', {
            params: {
              productId: productId,
              pageNum: this.pageNum,
              pageSize: this.pageSize
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
        }
      },
      searchData() { // 查询  cuo d /api/auth/v1/deviceMgmt/firmware
        request.get('/api/auth/v1/deviceMgmt/device', {
          params: {
            pageSize: 10,
            pageNum: 1,
            name: this.formInline.name,
            mac: this.formInline.mac,
            connectionStatus: this.formInline.connectionStatus,
            internetNum: this.formInline.internetNum,
            sn: this.formInline.sn,
            bindType: this.formInline.bindType,
            productId: this.formInline.productId
          }
        }).then((res) => {
          // console.log(res.data);
          this.tableData = res.data.list;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.size = res.data.size;
          this.pages = res.data.pages;
        })
      },
      cancel() {
        this.$router.push({
          path: 'firmware'
        })
      },
      // submitData(index, row) { // 保存按钮
      //   request.get('/api/auth/v1/deviceMgmt/product/monitor/' + row.id).then((res) => {
      //     console.log(res + '保存成功')
      //     this.$message({
      //       type: 'success',
      //       message: '保存成功!'
      //     })
      //   }).catch((err) => {
      //     console.log(err + '保存操作失败');
      //   })
      // },

      getProductName() { // 产品类型列表
        request.get('/api/auth/v1/deviceMgmt/product/list').then((res) => {
          this.productNames = res.data
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
        let data = [{}]
        for (let k in rs[0]) {
          data[0][k] = k
        }
        data = data.concat(rs)
        this.downloadExl(data, '设备导出列表')
      },
      downloadExl: function(json, downName, type) {  // 导出到excel
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
  .item-title{
    font-weight: normal;
  }
</style>
