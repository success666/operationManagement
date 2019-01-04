<template>
    <div class="contain-vessel" 
          v-loading="loading"
          element-loading-text="拼命加载中">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="ke-ruleForm" size="small">
            <el-form-item label="管理员账号" prop="account">
                <el-input :disabled="true" v-model="ruleForm.account" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="username">
                <el-input v-model="ruleForm.username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
                <el-select v-model="ruleForm.roleId" placeholder="角色">
                    <el-option v-for="item in roleList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="ruleForm.status" placeholder="状态">
                    <el-option label="启用" value="1"></el-option>
                    <el-option label="停用" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" size="medium">保存</el-button>
                <el-button @click="goback" size="medium">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
  import request from '@/utils/request'

  export default {
    created() {
      this.loading=true;
      const userId = this.$route.query.userId;
      request.get(`/api/auth/v1/operation/user/roles`).then((res) => {
        this.roleList = res.data
      })
      request.get(`/api/auth/v1/operation/user/${userId}`).then((res) => {
        const userData = res.data;
        this.loading=false;
        this.ruleForm.account = userData.account;
        this.ruleForm.username = userData.username;
        this.ruleForm.roleId = parseInt(userData.roleId);
        this.ruleForm.status = `${userData.status}`;
      }).catch(()=>{
        this.loading=false;
      })
    },
    data() {
      return {
        loading:false,
        roleList: [],
        ruleForm: {
          account: '',
          username: '',
          roleName: '',
          roleId: '',
          status: ''
        },
        rules: {
          account: [
            {required: true, message: '请输入管理员账号', trigger: 'blur'}
          ],
          username: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          roleId: [
            {required: true, message: '请选择角色', trigger: 'change'}
          ],
          status: [
            {required: true, message: '请选择状态', trigger: 'change'}
          ],
        },

      }
    },
    methods: {
      submitForm() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            const loginUser = JSON.parse(localStorage.getItem('ydl_user'));
            request.post(`/api/auth/v1/operation/user/${this.$route.query.userId}`, {
              account: this.ruleForm.account,
              roleId: this.ruleForm.roleId,
              username: this.ruleForm.username,
              status: this.ruleForm.status,
              userId: loginUser.userId,
              id: this.$route.query.userId
            }).then((res) => {
              this.$router.push({
                path: `/userSystem/accountlist`
              })
            })
          } else {
            console.log('fuck error')
          }
        })
      },
      goback() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
