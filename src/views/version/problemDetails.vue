<template>
    <div class="problemDetails">
      <div class="title">
        <h3>问题详情</h3>
        <p>
          <span>反馈者：</span>
          <span>{{feedbacks}}</span>
          <span>联系方式：</span>
          <span>{{phoneNumber}}</span>
        </p>
      </div>
      <div v-for="item of data" :key="item.id" :class="item.type == '1'?'bg':'content'">
        <span>{{item.type | capitalize}}</span>
        <span>{{item.createTime}}</span>
        <p>{{item.type | problemType}}</p>
       
        <p>{{item.content}}</p>
        <img v-for="key of item.url.split(',')" :key="key.id" :src="key" alt="">
      </div>

      <div class="reply">
        <common-upload @upload="replyUpload" @remove="replyRemove" :condition="replyCondition" :api="'/api/auth/v1/oss/policy?dir=guidancePoint'" class="fl" ref="child"></common-upload>
        <textarea name="text" id="text" cols="30" rows="10" v-model="text" @input="change"></textarea>
        <span class="num">{{text.length}}/1000</span>
      </div>
      <p class="foot">
        <span>
          <el-button type="primary" @click="$router.go(-1);">取消</el-button>
          <el-button type="primary" @click="reply">提交</el-button>
        </span>
      </p>
    </div>
</template>

<script>
import requestYapi from '@/utils/requestYapi'
import Upload from "@/components/common/uploadPicture";
export default {
  components: {
      "common-upload":Upload
    },
    data(){
      return{
        data:[],
        id:'',
        feedbacks:'',
        phoneNumber:'',
        text:'',
        replyCondition:{
          num:3,
          type:'png,jpeg,jpg',
          title:'最多上传3张图片，格式为jpeg等图片格式'
        },
        arrayImg:[],
      }
    },
    filters: {
      capitalize(value){
        if(value == 1){
          return '【追问】'
        }else if(value == 2){
          return '【提问】'
        }else{
          return '【回复】'
        }
      },
      problemType(value){
        if(value == 0){
          return '回复描述：'
        }else{
          return '问题描述：'
        }
      }
    },
    methods:{
      getData(type){
        let params = {
          type:type
        }
        requestYapi.get('/api/auth/v1/question/'+this.id,{params}).then(res=>{
          this.data = res.data;
          this.feedbacks = res.data[0].feedbacks;
          this.phoneNumber = res.data[0].phone;
        })
      },
      replyUpload(data){
        this.arrayImg.push({url:data.url,name:data.name});
      },
      replyRemove(data){
        for(let key of this.arrayImg){
          if(key.name == data.name){
            this.arrayImg.remove(key);
          }
        }
      },
      change(){
        if(this.text.length>=1000){
          this.text = this.text.slice(0,1000);
        }
      },
      reply(){
        let url = '';
        for(let key of this.arrayImg){
          url += key.url + ',';
        }
        if(url.length){
          url = url.slice(0,-1);
        }
        let data = {
          questionId:this.id,
          content:this.text,
          picUrl:url
        }
        // console.log(data);
        requestYapi.post('/api/auth/v1/question/answer',{data}).then(res=>{
          if(res.status.code == '0'){
            this.arrayImg = [];
            this.text = '';
            this.$refs.child.empty('string');
            this.getData();
          }else{
            this.$message.error(res.status.msg)
          }
        })
      }
    },
    mounted(){
      this.$route.meta.title = this.$route.query.title;
      this.id = this.$route.query.id;
      let type;
      if(this.$route.query.title.indexOf('家长')>=0){
        type = 2;
      }else{
        type = 1;
      }
      this.getData(type);
    }
}
</script>
<style lang="scss"> 
.problemDetails{
  border-radius: 14px;
  padding-bottom: 20px;
  background:#fff;
  .title{
    h3{
      padding-top:20px;
      margin-left: 10px;
    }
    span:nth-child(2){
      margin-right: 20px;
    }
    span:nth-child(1){
      margin-left: 10px;
    }
  }
  .content{
    padding:18px;
  }
  .bg{
    background:#f5f5f5;
    margin:10px;
    padding:8px;
  }
  img{
    width: 300px;
    height: 200px;
  }
  .reply{
    padding:10px;
    #text{
      margin-top:10px;
      width: 100%;
      height: 300px;
    }
    .num{
      float: right;
    }
  }
  .foot{
    text-align: center;
  }
}
</style>
