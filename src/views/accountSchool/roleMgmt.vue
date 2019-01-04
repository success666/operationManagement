<template>
  <div>
    <div class="search-add">
      <el-button type="primary" size="medium" @click="addRole()" v-show="powerBtn.addBtn">新增角色</el-button>
    </div>
    <div class="contain-vessel">
      <el-table
        :data="roleList"
        style="width: 100%;"
        v-loading="loading"
        element-loading-text="拼命加载中"
      >
        <el-table-column
          prop="name"
          label="角色"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          header-align="center"
          v-show="powerBtn.alertBtn || powerBtn.deleteBtn"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="modifyRole(scope.row)" v-show="powerBtn.alertBtn">编辑</el-button>
            <el-button type="primary" size="small" @click="deleteRole(scope.row)" v-show="powerBtn.deleteBtn">删除</el-button>
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
      if(power.indexOf("addSchoolRole")<0) this.powerBtn.addBtn=false;
      if(power.indexOf("deleteSchoolRole")<0) this.powerBtn.deleteBtn=false;
      if(power.indexOf("updateSchoolRole")<0) this.powerBtn.alertBtn=false;
    },
    data() {
      return {
        loading:false,
        roleList: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        tableData: {},
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
      modifyRole(row) {
        this.$router.push({
          path: `/schoolAccount/roleadd`,
          query: {id: row.id}
        })
      },
      getList() {
        this.loading=true;
        request.get('/api/auth/v1/school/role', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }).then((res) => {
          this.loading=false;
          this.roleList = res.data.list || [];
          this.tableData = res.data;
          this.total = res.data.total;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
        }).catch(()=>{
          this.loading=false;
        })
      },
      deleteRole(row) {
        console.log(row.id);
        this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.delete(`/api/auth/v1/school/role/${row.id}`).then((res) => {
            this.roleList = this.roleList.filter((item) => {
              return item.id != row.id
            })
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(() => {
          console.log("234")
        });
      },
      addRole() {
        this.$router.push({
          name: `schoolAcRoleAdd`
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
</style>
