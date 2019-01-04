<template>
    <div>
      <div class="container">
        <div class="title">
          <h3 class="float-l">版本详情</h3>
          <el-button type="primary" size="medium" class="float-r" @click="returnUp()">返回上一级</el-button>
        </div>
        <div ref="datas" :model="datas">
          <div class="item">
            <span class="item-title">APP版本名：</span>
            <span class="item-text">{{datas.name === 1 ? '家长端APP' : '学校端APP'}}</span>
          </div>
          <div class="item">
            <span class="item-title">平台：</span>
            <span class="item-text">{{datas.platform === 1 ? 'iOS' : 'Android'}}</span>
          </div>
          <div class="item">
            <span class="item-title">版本：</span>
            <span class="item-text">{{datas.versionNum}}</span>
          </div>
          <div class="item">
            <span class="item-title">URL：</span>
            <span class="item-text">{{datas.packageUrl}}</span>
          </div>
          <div class="item">
            <span class="item-title">描述：</span>
            <span class="item-text">{{datas.description}}</span>
          </div>
          <div class="item">
            <span class="item-title">创建人：</span>
            <span class="item-text">{{datas.createUser}}</span>
          </div>
          <div class="item">
            <span class="item-title">创建时间：</span>
            <span class="item-text">{{datas.createTime}}</span>
          </div>
          <div class="item">
            <span class="item-title">更新强制性：</span>
            <span class="item-text">{{datas.isForce == 1?'否':'是'}}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import request from '@/utils/request'
    export default {
      name: 'versionDetail',
      data() {
        return {
          datas: {
            id: '',
            name: '',
            platform: '',
            packageUrl: '',
            versionNum: '',
            description: '',
            createUser: '',
            createTime: ''
          }
        }
      },
      methods: {
        getData() {
          const userId = this.$route.query.rowId;
          // const rowData = this.$route.query.rowData;
          // this.datas = rowData;
          request.get('/api/auth/v1/appVersion/' + '' + userId).then((res) => {
            this.datas = res.data
          }).catch((err) => {
            // console.log(err + '请求失败')
          })
        },
        returnUp() {
          this.$router.go(-1);
          // this.$router.push({
          //   path: 'appVersion'
          // })
        }
      },
      mounted() {
        this.getData()
      }
    }
</script>

<style scoped>
  .container{
    background-color: #ffffff;
    border-radius: 10px;
    padding: 10px;
    margin-top: 15px;
    font-size: 15px;
    color: #615e60;
  }
  .title{
    height: 41px;
  }
  .title .float-l{
    float: left;
  }
  .title .float-r{
    float: right;
  }
  .item{
    display: block;
    margin: 15px 10px;
    line-height: 40px;
  }
  .item .item-title{
    display: inline-block;
    width: 250px;
    text-align: right;
    font-size: 20px;
  }
  .item .item-text{
    margin-left: 20px;
    font-size: 12px;
  }
</style>
