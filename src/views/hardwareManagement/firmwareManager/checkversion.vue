<template>
  <div>
    <div class="container">
      <h2>查看固件</h2>
      <div>
        <el-row>
          <el-col :span="8">
            <div class="item">
              <span class="item-title">固件名称：</span>
              <span class="">{{datas.name}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item">
              <span class="item-title">产品名称：</span>
              <span>{{datas.productName}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item">
              <span class="item-title">固件版本：</span>
              <span>{{datas.version}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="item">
              <span class="item-title">创建时间：</span>
              <span>{{datas.createTime}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item">
              <span class="item-title">已更新设备：</span>
              <span>{{datas.deviceCount}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item">
              <span class="item-title">启用状态：</span>
              <span> {{datas.status===1 ? '已启用' : '未启用'}} </span>
            </div>
          </el-col>
        </el-row>

        <div class="item">
          <span class="item-title">描述：</span>
          <span>{{datas.description}}</span>
        </div>
        <br>
        <div class="item">
          <span class="item-title">固件包：</span>
          <span class="item-mar-r">{{datas.packagePath}}</span>
          <span v-if="datas.packagePath"><a :href="datas.packagePath" style="color: deepskyblue;text-decoration: underline">点击下载</a></span>
          <span v-else>还未上传固件</span>
        </div>


        <div class="textCenter">
          <el-button type="success" @click="onSubmit">返回上一步</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import request from '@/utils/request'
  export default {
    data() {
      return {
        datas: {
          id: '1',
          name: '',
          productId: '',
          version: '',
          status: '',
          createTime: '',
          packagePath: '',
          description: '',
          deviceCount: '',
          productName: ''
        }
      }
    },
    created() {
      const userId = this.$route.query.rowId;
      request.get('/api/auth/v1/deviceMgmt/firmware/' + '' + userId).then((res) => {
        this.datas = res.data
      }).catch((err) => {
        // console.log('请求失败' + err)
      })
    },
    methods: {
      onSubmit() {
        this.$router.push({
          path: 'firmware'
        })
      }
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
  }
  .item{
    /*display: block;*/
    margin: 15px 10px;
  }
  .item .item-video-dv{
    display: inline-block;
    vertical-align: top;
  }
  .item .item-title{
    display: inline-block;
    width: 90px;
    margin-right: 10px;
    margin-left: 20px;
    /*font-weight: bold;*/
  }
  .item .item-video-dv .item-video{
    height: 200px;
    width: 350px;
    vertical-align: top;
  }
  .item .item-video-dv .item-shichang{
    display: inline-block;
    margin: 5px 0;
  }
  .item .item-tip{
    display: inline-block;
    padding: 5px 10px;
    border-radius: 10px;
    border: 1px solid #dcdfe6;
    margin-right: 10px;
  }
  .border1{
    border: 1px solid #1f2d3d;
    border-radius: 5px;
    padding: 10px;
  }
  .border2{
    display: block;
    border: 1px solid #1f2d3d;
    border-radius: 5px;
    padding: 10px;
    margin-top: -20px;
    margin-left: 85px;
  }
  .textCenter{
    text-align: center;
    margin-bottom: 20px;
  }
  .item-img{
    vertical-align: top;
    display: inline-block;
    height: 200px;
  }
  .item-img img{
    height: 100%;
  }
  .item-mar-r{
    margin-right: 20px;
  }
</style>
