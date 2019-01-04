<template>
  <div class="app-wrapper" :class="classObj">
    <!--<div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>-->
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import requestYapi from '@/utils/requestYapi'
export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data(){
    return{
      problemFeedbackFn:''
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        // hideSidebar: !this.sidebar.opened,
        // withoutAnimation: this.sidebar.withoutAnimation,
        // mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    problemFeedback(){
      this.problemFeedbackFn = setInterval(()=>{
        requestYapi.get('/api/auth/v1/question/no-reply').then(res=>{
          if(res.status.code == '0'){
            this.$store.dispatch('problemFeedbackStatus', res.data);
          }
        }).catch((err) => {
          // console.log(err + '请求失败')
        })
      }, 180000);

    },
    clearIntervalFn(){
      window.clearInterval(this.problemFeedbackFn);
    }

  },
  mounted(){
    let token = localStorage.getItem('access_token')
    let beforeNum = token.indexOf('.');
    token = token.slice(beforeNum*1+1);
    let lastNum = token.indexOf('.');
    token = token.slice(0,lastNum);
    let reg = new RegExp( '_' , "g" )
    let regexp = new RegExp('-',"g");
    token = token.replace(reg,'/').replace(regexp,'+')
    let tokenObj
    tokenObj = decodeURIComponent(atob(token).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    tokenObj = JSON.parse(JSON.parse(tokenObj).sub).menus
    for(let key of tokenObj){
      if(key.code == 'userSystem'){
        requestYapi.get('/api/auth/v1/question/no-reply').then(res=>{
          if(res.status.code == '0'){
            this.$store.dispatch('problemFeedbackStatus', res.data);
          }
        }).catch((err) => {
          // console.log(err + '请求失败')
        })
        this.problemFeedback();
      }
    }
  }
  
  
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
