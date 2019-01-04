<template>
    <div>
      <div class="search-add">
          <div class="search">
            <el-input v-model="account" size="small" placeholder="账号"></el-input>
            <el-input v-model="username" size="small" placeholder="姓名"></el-input>
            <el-button type="primary" size="small" @click="searchList()">查询</el-button>
          </div>
          <el-button type="primary" size="medium" @click="addAccount()" v-show="powerBtn.addBtn">新增账号</el-button>
        </div>
      <div class="contain-vessel">
        <el-table
          :data="listData"
          style="width: 100%;"
          v-loading="loading"
          element-loading-text="拼命加载中"
        >
          <el-table-column
            prop="account"
            label="管理员账户"
            align="center"
            header-align="center"
            width="160px"
          >
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
            align="center"
            header-align="center"
            width="160px"
          >
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="角色"
            align="center"
            header-align="center"
            width="130px"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            align="center"
            header-align="center"
            width="100px"
          >
            <template slot-scope="scope">{{scope.row.status === 1 ? '启用' : '停用'}}</template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            header-align="center"
            v-show="powerBtn.alertBtn || powerBtn.updateBtn || powerBtn.deleteBtn"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="modifyRole(scope.row)" v-show="powerBtn.alertBtn" :disabled="scope.row.id==1">编辑</el-button>
              <el-button type="primary" size="small" @click="resetPwd(scope.row)" v-show="powerBtn.updateBtn">重置密码</el-button>
              <el-button type="primary" size="small" @click="deleteRole(scope.row)" v-show="powerBtn.deleteBtn" :disabled="scope.row.id==1">删除</el-button>
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
      <el-dialog title="重置密码" :visible.sync="dialogFormVisible" width="500px">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="管理员账户" prop="account">
                    <el-input :disabled="true" v-model="form.account" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="pass">
                    <el-input v-model="form.pass" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureDialog">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import request from '@/utils/request'
  import Paging from '../../components/common/paging'
  import { PASSWORD, PASSWORD_TIP } from '../../utils/validate'
  import parseBase from '@/utils/parseBase';
  import store from '@/utils/store';

  export default {
    created() {
      this.getList();
      var power=store.local.get("access_token").split(".")[1];
      power=parseBase.decode(power);
      if(power.indexOf("addUser")<0) this.powerBtn.addBtn=false;
      if(power.indexOf("deleteUser")<0) this.powerBtn.deleteBtn=false;
      if(power.indexOf("updateUser")<0) this.powerBtn.alertBtn=false;
      if(power.indexOf("updatePassword")<0) this.powerBtn.updateBtn=false;
    },
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else if (!PASSWORD.test(value)) {
          callback(new Error(PASSWORD_TIP));
        } else {
          callback();
        }
      };
      return {
        loading:false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
        listData: [],
        username: '',
        account: '',
        form: {
          pass: '',
          id: ''
        },
        dialogFormVisible: false,
        powerBtn:{
          addBtn:true,
          alertBtn:true,
          deleteBtn:true,
          updateBtn:true
        },
        rules: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      getList() {
        this.loading=true;
        request.get('/api/auth/v1/operation/user/list', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            username: this.username,
            account: this.account
          }
        }).then((res) => {
          this.loading=false;
          this.listData = res.data.list || [];
          this.total = res.data.total;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
        }).catch(()=>{
          this.loading=false;
        })
      },
      modifyRole(row) {
        this.$router.push({
          path: `/userSystem/accountedit`,
          query: {userId: row.id}
        })
      },
      deleteRole(row) {
        console.log(row.id);
        this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.delete(`/api/auth/v1/operation/user/${row.id}`).then((res) => {
            this.listData = this.listData.filter((item) => {
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
      resetPwd(row) {
        this.form.account = row.account;
        this.form.pass = '';
        this.form.id = row.id;
        this.dialogFormVisible = true
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
      addAccount() {
        this.$router.push({
          path: '/userSystem/accountadd'
        });
      },
      sureDialog() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            request.post('/api/auth/v1/operation/user/updatePassword', {
              password: this.form.pass,
              userId: this.form.id
            }).then((res) => {
              this.$message({
                type: 'success',
                message: '重置密码成功!'
              });
              this.dialogFormVisible = false;
            })
          }
        })
      },
      searchList() {
        this.pageSize = 10;
        this.pageNum = 1;
        this.getList();
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
