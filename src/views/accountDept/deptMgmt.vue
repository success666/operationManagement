<template>
  <div>
    <div class="search-add">
      <div class="search">
        <el-input v-model="name" size="small" placeholder="教育机构名称"></el-input>
        <el-button type="primary" size="small" @click="searchList()">查询</el-button>
      </div>
      <el-button type="primary" size="medium" @click="addList()" v-show="powerBtn.addBtn">新增机构</el-button>
    </div>
    <div class="contain-vessel">
      <el-table
        :data="tableList"
        style="width: 100%;"
        v-loading="loading"
        element-loading-text="拼命加载中"
      >
        <el-table-column
          prop="name"
          label="教育机构名称"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="jurisdiction"
          label="管辖范围"
          align="center"
          header-align="center"
          :formatter="formateJur"
        >
        </el-table-column>
        <el-table-column
          prop="mgmtDeptName"
          label="地区"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">{{`${scope.row.province}${scope.row.city}${scope.row.district} ${scope.row.posDetail}`}}</template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">{{scope.row.status === 1 ? '启用' : '停用'}}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          header-align="center"
          v-show="powerBtn.alertBtn"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="modifyList(scope.row)">编辑</el-button>
            <!--<el-button type="primary" size="small" @click="deleteList(scope.row)">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <Paging :pageNum="pageNum"
              :pageSize="pageSize"
              :total="total"
              @current="getCurrent"
      >

      </Paging>
    </div>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import Paging from '../../components/common/paging'
  import parseBase from '@/utils/parseBase';
  import store from '@/utils/store';

  export default {
    created() {
      this.getList();
      var power=store.local.get("access_token").split(".")[1];
      power=parseBase.decode(power);
      if(power.indexOf("addMgmtDept")<0) this.powerBtn.addBtn=false;
      if(power.indexOf("updateMgmtDept")<0) this.powerBtn.alertBtn=false;
    },
    data() {
      return {
        loading:false,
        tableList: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        tableData: {},
        name: '',
        powerBtn:{
          addBtn:true,
          appenBtn:true,
          detailsBtn:true,
          alertBtn:true,
          deleteBtn:true
        }
      }
    },
    methods: {
      modifyList(row) {
        this.$router.push({
          path: `/mgmtDeptAccount/deptedit`,
          query: {id: row.id}
        })
      },
      getList() {
        this.loading=true;
        request.get('/api/auth/v1/mgmtDept', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            name: this.name,
          }
        }).then((res) => {
          this.loading=false;
          this.tableList = res.data.list || [];
          this.tableData = res.data;
          this.total = res.data.total;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
        }).catch(()=>{
          this.loading=false;
        })
      },
      deleteList(row) {
        console.log(row.id);
        this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.delete(`/api/auth/v1/school/role/${row.id}`).then((res) => {
            this.tableList = this.tableList.filter((item) => {
              return item.id != row.id
            })
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(() => {

        });
      },
      addList() {
        this.$router.push({
          path: `/mgmtDeptAccount/deptadd`
        })
      },
      getCurrent(current) {
        console.log(current);
        if (current.currentPage) {
          this.pageNum = current.currentPage;
        }
        if (current.currentSize) {
          this.pageSize = current.currentSize
        }
        this.getList()
      },
      searchList() {
        this.pageSize = 10;
        this.pageNum = 1;
        this.getList();
      },
      formateJur(row, column, value) {
        let text = '';
        switch (value) {
          case 1:
            text = '教育部';
            break;
          case 2:
            text = '省级';
            break;
          case 3:
            text = '市级';
            break;
          case 4:
            text = '区级';
            break;
        }
        return text;
      }
    },
    components: {
      Paging
    }
  }
</script>

<style lang="scss" scoped>
  .search-add {
    text-align: right;
  }
  .search {
    float: left;
  }
  .el-input {
    width: 150px !important;
  }
</style>
