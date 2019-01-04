<template>
  <div class="role contain-vessel"
        v-loading="loading"
        element-loading-text="拼命加载中">
    <el-input v-model="roleName" placeholder="请输入角色名称" class="role-name"></el-input>
    <el-tree :data="menuList"
             :default-expanded-keys="[1]"
             :default-checked-keys="permissionIds"
             show-checkbox
             node-key="id"
             :props="defaultProps"
             ref="roletree"
             :check-strictly="true"
             @check-change="checkChange"
    >
    </el-tree>
    <div class="role-btn">
      <el-button @click="cancelSet">取消</el-button>
      <el-button type="primary" @click="sureSet">确认</el-button>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  created() {
    this.getMenuData();
    if (this.$route.query.id) {
      this.loading = true;
      request.get(`/api/auth/v1/mgmtDept/role/${this.$route.query.id}`).then(res => {
          this.loading = false;
          this.permissionIds = res.data.menuIds || [];
          this.roleName = res.data.name;
          this.$refs.roletree.setCheckedKeys(res.data.menuIds);
          setTimeout(() => {
            this.changeCheck = true;
          }, 2000);
        })
        .catch(() => {
          this.loading = false;
        });
    } else {
        this.changeCheck = true;
    }
  },
  data() {
    return {
      loading: false,
      roleName: "",
      menuList: [],
      permissionIds: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      changeCheck: false
    };
  },
  methods: {
    sureSet() {
      if (!this.roleName) {
        this.$message.error("请输入角色名称");
        return;
      }
      const permissionId = this.$refs.roletree.getCheckedKeys();
      if (this.$route.query.id) {
        request
          .post(`/api/auth/v1/mgmtDept/role/${this.$route.query.id}`, {
            name: this.roleName,
            remark: "",
            menuIds: permissionId,
            id: this.$route.query.id
          })
          .then(res => {
            this.$router.push({
              path: `/mgmtDeptAccount/deptrolemgmt`
            });
          });
      } else {
        request
          .post(`/api/auth/v1/mgmtDept/role`, {
            name: this.roleName,
            remark: "",
            menuIds: permissionId
          })
          .then(res => {
            this.$router.push({
              path: `/mgmtDeptAccount/deptrolemgmt`
            });
          });
      }
    },
    cancelSet() {
      this.$router.push({
        path: `/mgmtDeptAccount/deptrolemgmt`
      });
    },
    getMenuData() {
      request.get(`/api/auth/v1/mgmtDept/menu`).then(res => {
        this.menuList = res.data || [];
      });
    },
    checkChange(node, isCheck, parent) {
      if (!this.changeCheck) return;
      if (node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          setNode(this, node.children[i], isCheck);
        }
      }
    }
  }
};
function setNode(vm, node, isCheck) {
  if (node.children.length == 0) {
    vm.$refs.roletree.setChecked(node.id, isCheck, false);
  } else {
    vm.$refs.roletree.setChecked(node.id, isCheck, false);
    for (let i = 0; i < node.children.length; i++) {
      setNode(vm, node.children[i], isCheck, false);
    }
  }
}
</script>

<style lang="scss" scoped>
.role {
  padding: 10px;
  background: #fff;
}
.role-btn {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 40px;
}
.role-name {
  display: inline-block;
  width: 250px;
  margin-bottom: 20px;
}
</style>
