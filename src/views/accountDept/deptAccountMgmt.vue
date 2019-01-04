<template>
  <div>
    <div class="search-add">
      <div class="search">
        <el-input v-model="username" size="small" placeholder="联系人名称"></el-input>
        <el-input v-model="tel" size="small" placeholder="联系人手机号"></el-input>
        <el-button type="primary" size="small" @click="searchList()">查询</el-button>
      </div>
      <el-button type="primary" size="medium" @click="addList()" v-show="powerBtn.addBtn">新增账号</el-button>
    </div>
    <div class="contain-vessel">
      <el-table
        :data="tableList"
        style="width: 100%;"
        v-loading="loading"
        element-loading-text="拼命加载中"
      >
        <el-table-column
          prop="mgmtDeptName"
          label="教育机构名称"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="account"
          label="教育机构账号"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="mgmtDeptRoleName"
          label="角色"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          label="联系人名称"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="tel"
          label="联系人手机号"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="name"
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
      if(power.indexOf("addMgmtDeptAccount")<0) this.powerBtn.addBtn=false;
      if(power.indexOf("updateMgmtDeptAccount")<0) this.powerBtn.alertBtn=false;
    },
    data() {
      return {
        tableList: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        tableData: {},
        tel: '',
        username: '',
        loading:false,
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
          path: `/mgmtDeptAccount/deptaccountedit`,
          query: {id: row.id}
        })
      },
      getList() {
        this.loading=true;
        request.get('/api/auth/v1/mgmtDept/account', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            tel: this.tel,
            username: this.username
          }
        }).then((res) => {
          this.tableList = res.data.list || [];
          this.tableData = res.data;
          this.total = res.data.total;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
          this.loading=false;
        }).catch(() =>{
          this.loading=false;
        })
      },
      addList() {
        this.$router.push({
          path: `/mgmtDeptAccount/deptaccountadd`
        })
      },
      getCurrent(current) {
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
      rowClick(row){
        console.log(row);
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
