<template>
    <div>
        <div class="container">
          <h4>知识详情</h4>
          <div ref="form" :model="form" label-width="80px">
            <div class="item">
              <span class="item-title">类别：</span>
              <!--<span class="item-tip">{{form.categoryId}}</span>-->
                <!--<span class="item-tip" v-if="form.categoryId === ''">全部</span>-->
                <span class="item-tip" v-if="form.categoryId === 1">考试</span>
                <span class="item-tip" v-else-if="form.categoryId === 2">营养</span>
                <span class="item-tip" v-else-if="form.categoryId === 3">安全教育</span>
                <span class="item-tip" v-else-if="form.categoryId === 4">视力保健</span>
                <span class="item-tip" v-else-if="form.categoryId === 5">运动</span>
            </div>

            <div class="item">
              <span class="item-title">运动项目：</span>
              <span class="item-tip" v-for="(item, index) in form.sportItemCategorys" :key="index">{{item.name}}</span>
            </div>

            <div class="item">
              <span class="item-title">营养：</span>
              <span class="item-tip" v-for="(item, index) in form.nutritions" :key="index">{{item.name}}</span>
            </div>
            <div class="item">
              <span class="item-title">安全教育：</span>
              <span class="item-tip" v-for="(item, index) in form.safetyEducations" :key="index">{{item.name}}</span>
            </div>
            <div class="item">
              <span class="item-title">视力保健：</span>
              <span class="item-tip" v-for="(item, index) in form.funs" :key="index">{{item.name}}</span>
            </div>

            <div class="item">
              <span class="item-title">标题：</span>
              <span>{{form.title}}</span>
            </div>

            <div class="item">
              <span class="item-title">作者：</span>
              <span>{{form.author}}</span>
            </div>

            <div class="item">
              <span class="item-title">标签</span>
              <span class="item-tip" v-for="(item, index) in form.label" :key="index"> {{item ? item : '无标签'}} </span>
            </div>

            <div class="item">
              <span class="item-title">封面图：</span>
              <img :src="form.coverUrl" alt="图片不能正常显示" class="item-img">
            </div>

            <div class="item">
              <span class="item-title">简介：</span>
              <span class="jianjie">{{form.introduction}}</span>
            </div>

            <div class="item">
              <span class="item-title">内容：</span>
                <div class="item-video-dv" v-if="form.contentType === 1">
                  <video class="item-video" v-if="form.videoUrl" :src="form.videoUrl"  muted controls="controls">对不起；您的浏览器不支持HTML5视频在WebM和VP8 / VP9或MP4</video>
                  <br>
                  <!--<span class="item-shichang border1">时长 &nbsp; {{form.videoLength}}</span>-->
                </div>
                <!--<div class="item">-->
                  <!--<span class="item-title">简介：</span><br>-->
                  <pre class="border2" v-html="form.content"></pre>
                <!--</div>-->
            </div>

            <div class="item">
              <span class="item-title">创建时间：</span>
              <span>{{form.updateTime}}</span>
            </div>

            <!--<div class="item">-->
              <!--<span class="item-title">创建账号：</span>-->
              <!--<span>{{form.createUser}}</span>-->
            <!--</div>-->
            <!--<div class="item">-->
              <!--<span class="item-title">当前状态：</span>-->
                <!--<span v-if="form.status == 0">未发布</span>-->
                <!--<span v-else="1">已发布</span>-->
            <!--</div>-->
            <div class="textCenter">
              <el-button type="primary" @click="onSubmit">确定</el-button>
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
        sportitems: [],
        nutritions: [],
        safetys: [],
        funs: [],
        form: {
          id: '1',
          categoryId: '',
          sportItemCategorys: [],
          nutritions: [],
          safetyEducations: [],
          funs: [],
          title: '',
          author: '',
          label: [],
          inputVisible: false,
          inputValue: '',
          coverUrl: '',
          introduction: '',
          content: '',
          videoLength: '',
          videoUrl: '',
          contentType: '',
          updateTime: '',
          fileList: []
        }
      }
    },
    mounted() {
      // this.getSportItem()
      // this.getNutrition()
      // this.getSafety()
      // this.getFun()
    },
    created() {
      const userId = this.$route.query.userId;
      request.get('/api/auth/v1/knowledge/' + userId).then((res) => {
        // this.form = res.data;
        for (let name in res.data) {
          if (typeof this.form[name] !== 'undefined') {
            this.form[name] = res.data[name]
          }
        }
        // this.form.id = res.data.id + '';
        // this.form.categoryId = res.data.categoryId + '';
        // this.form.contentType = res.data.contentType + '';
        // this.form.status = res.data.status + '';
        // this.form.delFlag = res.data.delFlag + '';
        // this.form.browseCount = res.data.browseCount + '';
      }).catch((err) => {
        console.log(err)
      })
    },
    methods: {
      onSubmit() {
        this.$router.push({
          path: 'knowledge'
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
    display: block;
    margin: 15px 10px;

  }
  .item .jianjie{
    line-height: 30px;
    display: inline-block;
    width: 80%;
    margin-top: -10px;
    vertical-align: middle;
    vertical-align: -webkit-baseline-middle;
  }
  .item .item-video-dv{
    display: inline-block;
    vertical-align: top;
  }
  .item .item-title{
    display: inline-block;
    width: 90px;
    /*margin-right: 10px;*/
    font-weight: bold;
  }
  .item .item-video-dv .item-video{
    /*height: 200px;*/
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
    padding: 0 20px 10px 10px;
    line-height: 25px;
    /*margin-top: -20px;*/
    margin-left: 85px;
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
  }
  .textCenter{
    text-align: center;
    margin-bottom: 20px;
  }
  .item-img{
    vertical-align: top;
    display: inline-block;
    max-height: 200px;
  }
</style>
