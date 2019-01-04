<template>
  <div>
    <el-radio-group class="tab" v-model="activeName" @change="handleClick">
      <el-radio-button label="first">账号管理</el-radio-button>
      <el-radio-button label="second">角色管理</el-radio-button>
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
            path = '/userSystem/accountlist';
            break;
          case 'second':
            path = '/userSystem/rolelist';
            break;
        }
        this.$router.push({
          path: path
        })
      },
      handleChange(value, name) {
        console.log(value, name)
      },
      getTabActive() {
        const strArr = this.$router.history.current.path.split('/');
        const str = strArr[strArr.length - 1];
        if (str === 'accountlist' || str === 'accountadd' || str === 'accountedit') {
          this.activeName = 'first';
        } else if (str === 'role' || str === 'rolelist') {
          this.activeName = 'second';
        }
      }
    },
    created() {
      this.getTabActive()
    },
    watch: {
      $route() {
        this.getTabActive()
      }
    },
  }
</script>

<style scoped>
  .tab {
    margin-bottom: 15px;
  }
</style>
