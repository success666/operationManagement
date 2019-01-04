<template>
  <div class="problemLook">
    <h2>{{$route.query.title.slice(6)}}</h2>
    <div class="title" @click="target">
      <span class="problemLook_title">全部({{tableData.replyNum*1 + tableData.noReplyNum*1}})</span>
      <span class="problemLook_title">已回复({{tableData.noReplyNum}})</span>
      <span class="problemLook_title">未回复({{tableData.replyNum}})</span>
    </div>
    <div class="tabel">
      <el-table
        :data="tableData.list"
        style="width: 100%">
        <el-table-column
          align="center"
          prop="createTime"
          label="时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="content"
          label="内容">
        </el-table-column>
        <el-table-column
          align="center"
          prop="feedbacks"
          label="反馈者">
        </el-table-column>
        <el-table-column
          align="center"
          prop="phoneNumber"
          label="手机号码">
        </el-table-column>
        <el-table-column
          align="center"
          label="状态">
          <template slot-scope="scope">{{ scope.row.status == '0'?'未回复':'已回复' }}</template>
        </el-table-column>
        
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="particulars(scope.$index, scope.row)">
                <el-badge v-if="scope.row.status == '0'" is-dot class="item">
                  详情
                </el-badge>
                <span v-else is-dot>
                  详情
                </span>
              </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import requestYapi from '@/utils/requestYapi'
  export default {
    data() {
      return {
        typeStatus:0,
        type:'',
        tabPosition:'1',
        tableData:[],
        pageNum:1,
        pageSize:10,
        total:0,
      }
    },

    methods: {
      handleSizeChange(val) {
        this.pageSize = val;
        this.getTable();
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getTable();
        // console.log(`当前页: ${val}`);
      },
      particulars(index, row) {
        // console.log(row);
        this.$router.push({
          path: "/problemFeedback/ProblemDetails",
          query: {
            title:this.$route.query.title + ' - 详情',
            id:row.id

          }
        });
      },
      target(event){
        if(event.target.className == 'problemLook_title'){
          let arr = document.querySelectorAll('.problemLook_title')
          for(let i=0;i<arr.length;i++){
            arr[i].style.color = '#000';
            arr[i].style.borderBottom = '0px';
          }
          if(event.target.innerText.indexOf('未回复')>=0){
            this.typeStatus = 0;
          }else if(event.target.innerText.indexOf('已回复')>=0){
            this.typeStatus = 1;
          }else{
            this.typeStatus = 2;
          }
          event.target.style.color = 'rgb(91, 152, 180)';
          event.target.style.borderBottom = '2px solid rgb(91, 152, 180)';
          this.getTable();
        }
      },
      getTable(){
        let api,params;
        params = {
          schoolId:this.$route.query.schoolId,
          type:this.typeStatus,
          pageNum:this.pageNum,
          pageSize:this.pageSize
        }
        if(this.$route.query.title.indexOf('学校反馈')>=0){
          this.type = '学校反馈'
          api = '/api/auth/v1/question/sch'
        }else{
          this.type = '家长反馈'
          api = 'api/auth/v1/question/parent'
        }
        requestYapi.get(api,{params}).then(res=>{
          this.tableData = res.data;
          this.total = res.data.total;
        })
      }
    },
    mounted(){
      this.$route.meta.title = this.$route.query.title;
      this.getTable();
    }
  }
</script>

<style lang="scss">
  .problemLook{
    .title{
      height: 60px;
      background:#fff;
      margin-bottom: 10px;
      padding-left: 20px;
      border-radius: 12px;
      line-height: 60px;
      span{
        display: inline-block;
        line-height: 60px;
        margin-right: 16px;
      }
      span:nth-child(1){
        border-bottom: 2px solid rgb(91, 152, 180);
        color: rgb(91, 152, 180);
      }
    }
    .tabel{
      overflow: hidden;
      border-radius: 14px;
    }
    .page{
      height: 50px;
      padding-top:10px;
      padding-right: 10px;
    }
  }

</style>
