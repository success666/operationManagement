<template>
  <div class="dictData" :style="{'min-height':dictDataHeight}">
    <keep-alive>
       <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
var vm = "";
export default {
  name: "dictData",
  data() {
    return {
      dictDataHeight: "500px"
    };
  },
  mounted() {
    vm = this;
    this.dictDataHeight = document.body.clientHeight - 50 + "px";
  }
};
window.onresize = function() {
  if(typeof vm.dictDataHeight=="undefined") return;
  vm.dictDataHeight = document.body.clientHeight - 50 + "px";
};
</script>
<style lang="scss" scoped>
.dictData {
  background: #fff;
  border-radius: 7px;
}
</style>


