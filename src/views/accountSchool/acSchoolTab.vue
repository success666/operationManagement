<template>
  <div>
    <el-radio-group class="tab" v-model="activeName" @change="handleClick">
      <el-radio-button label="first">学校管理</el-radio-button>
      <el-radio-button label="second">学校账号管理</el-radio-button>
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
            path = '/schoolAccount/schoolmgmt';
            break;
          case 'second':
            path = '/schoolAccount/schoolacmgmt';
            break;
          case 'third':
            path = '/schoolAccount/role';
            break;
        }
        this.$router.push({
          path: path
        })
      },
      getTabActive() {
        const strArr = this.$router.history.current.path.split('/');
        const str = strArr[strArr.length - 1];
        if (str === 'schoolmgmt' || str === 'schooladd' || str === 'schooledit') {
          this.activeName = 'first';
        } else if (str === 'schoolacmgmt' || str === 'schoolacadd' || str === 'schoolacedit') {
          this.activeName = 'second';
        } else if (str === 'role' || str === 'roleadd') {
          this.activeName = 'third';
        }
      }
    },
    created() {
     this.getTabActive();
    },
    watch: {
      $route() {
        this.getTabActive()
      }
    }
  }
</script>

<style scoped>
  .tab {
    margin-bottom: 15px;
  }
</style>
