<template>
  <div>
    <el-radio-group class="tab" v-model="activeName" @change="handleClick">
      <el-radio-button label="first">教育机构管理</el-radio-button>
      <el-radio-button label="second">教育机构账号管理</el-radio-button>
      <el-radio-button label="third">角色管理</el-radio-button>
    </el-radio-group>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeName: 'first'
      };
    },
    methods: {
      handleClick(tab, event) {
        let path;
        switch (tab) {
          case 'first':
            path = '/mgmtDeptAccount/deptmgmt';
            break;
          case 'second':
            path = '/mgmtDeptAccount/deptaccountmgmt';
            break;
          case 'third':
            path = '/mgmtDeptAccount/deptrolemgmt';
            break;
        }
        this.$router.push({
          path: path
        })
      },
      getTabActive() {
        const strArr = this.$router.history.current.path.split('/');
        const str = strArr[strArr.length - 1];
        if (str === 'deptmgmt' || str === 'deptadd' || str === 'deptedit') {
          this.activeName = 'first';
        } else if (str === 'deptaccountmgmt' || str === 'deptaccountadd' || str === 'deptaccountedit') {
          this.activeName = 'second';
        } else if (str === 'deptrolemgmt' || str === 'deptroleadd') {
          this.activeName = 'third';
        }
      }
    },
    created() {
      this.getTabActive();
    },
    watch: {
      $route() {
        this.getTabActive();
      }
    }
  }
</script>

<style scoped>
  .tab {
    margin-bottom: 15px;
  }
</style>
