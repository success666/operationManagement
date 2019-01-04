<template>
    <div>
      <div class="container">
        <el-row>
          <div class="demonstration">
            <span>未发布 </span><el-button type="text" @click="getList(0)">( {{num2}} )</el-button>
          </div>
          <div class="demonstration">
            <span>已发布</span><el-button type="text" @click="getList(1)">( {{num}} )</el-button>
          </div>
          <div class="demonstration float_r">
            <el-button type="primary" size="small" v-if="powerBtn.addBtn" @click="addKnowledge()">新增知识</el-button>
          </div>
        </el-row>
      </div>
      <div class="container">
        <el-form ref="form" :inline="true" :model="form" label-width="50px">
          <el-form-item label="时间" class="item-dispIb">
            <el-date-picker type="date" size="small" placeholder="选择开始日期" v-model="form.createTime" value-format="yyyy-MM-dd" style="width: 150px;"></el-date-picker>
            <span>至</span>
            <el-date-picker type="date" size="small" placeholder="选择最后日期" v-model="form.updateTime" value-format="yyyy-MM-dd" style="width: 150px;"></el-date-picker>
          </el-form-item>
          <el-form-item label="标题" class="item-dispIb">
            <el-input v-model="form.title" size="small" placeholder="请输入标题" style="width: 200px;display: inline-block"></el-input>
          </el-form-item>
          <el-form-item label="作者" class="item-dispIb">
            <el-input v-model="form.author" size="small" placeholder="请输入作者名称" style="width: 200px;display: inline-block"></el-input>
          </el-form-item>
          <el-form-item label="类别" class="item-dispIb">
            <el-select v-model="form.categoryId" size="small" clearable placeholder="请选择">
              <el-option v-for="(item, index) in categorys" :label="item.name" :value="item.id" :key="index"></el-option>


              <!--<el-option label="考试" value="1"></el-option>-->
              <!--<el-option label="营养" value="2"></el-option>-->
              <!--<el-option label="安全教育" value="3"></el-option>-->
              <!--<el-option label="视力保健" value="4"></el-option>-->
              <!--<el-option label="运动" value="5"></el-option>-->
            </el-select>
          </el-form-item>
          <el-form-item label="内容" class="item-dispIb">
            <el-select v-model="form.contentType" size="small" clearable placeholder="请选择">
              <!--<el-option label="全部" value=""></el-option>-->
              <el-option label="视频" value="1"></el-option>
              <el-option label="文章" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" class="item-dispIb">
            <el-select v-model="form.status" size="small" clearable placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="未发布" value="1"></el-option>
              <el-option label="已发布" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="item-sub float_r">
            <el-button type="primary" size="small" class="demonstration" @click="searchData(1)">查询</el-button>
            <el-button type="primary" size="small" class="demonstration" @click="formReset('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="container">
        <el-table
          :data="tableData"
          class="rowheight"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="title"
            align="center"
            label="标题"
            show-overflow-tooltip
            width="200">
            <template slot-scope="scope">
              <span class="item-a" @click="toDetail(scope.row)">{{scope.row.title}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="author"
            align="center"
            label="作者"
            width="100">
          </el-table-column>
          <el-table-column
            prop="categoryName"
            align="center"
            label="类别"
            width="100">
          </el-table-column>
          <el-table-column
            prop="contentType"
            align="center"
            label="内容"
            show-overflow-tooltip
            width="70">
            <template slot-scope="scope">{{scope.row.contentType === 1 ? '视频' : '文章'}}</template>

          </el-table-column>
          <el-table-column
            prop="createTime"
            align="center"
            label="上传时间"
            sortable
            width="160">
          </el-table-column>
          <!--<el-table-column-->
            <!--prop="browseCount"-->
            <!--align="center"-->
            <!--label="浏览数"-->
            <!--width="60">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="delFlag"-->
            <!--align="center"-->
            <!--label="点赞数"-->
            <!--width="60">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="zip"-->
            <!--align="center"-->
            <!--label="收藏数"-->
            <!--width="60">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="zip"-->
            <!--align="center"-->
            <!--label="转发数"-->
            <!--width="60">-->
          <!--</el-table-column>-->
          <el-table-column
            prop="status"
            align="center"
            label="状态"
            width="80">
            <template slot-scope="scope">{{scope.row.status === 0 ? '未发布' : '已发布'}}</template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            v-if="powerBtn.statusBtn ||powerBtn.updateBtn || powerBtn.deleteBtn"
            min-width="220">
            <template slot-scope="scope">
              <el-button
                size="mini"
                v-if="powerBtn.statusBtn"
                @click="handleSub(scope.$index, scope.row)">{{ scope.row.status == 1 ? '下架' : '发布' }}</el-button>
              <el-button
                size="mini"
                type="primary"
                plain
                v-if="powerBtn.updateBtn"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                v-if="powerBtn.deleteBtn"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Paging :pageNum="pageNum"
                :pageSize="pageSize"
                :total="total"
                @current="getCurrent"
        ></Paging>
      </div>
    </div>
</template>

<script>
  import request from '@/utils/request'
  import Paging from '../../components/common/paging'
  import parseBase from '@/utils/parseBase'
  import store from '@/utils/store'
  export default {
    components: {
      Paging
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        categorys: [],
        powerBtn: {
          addBtn: true,
          listBtn: true,
          getBtn: true,
          updateBtn: true,
          deleteBtn: true,
          statusBtn: true
        },
        form: {
          createTime: '', // 开始时间
          updateTime: '', // 结束时间
          status: '', // 状态
          contentType: '', // 内容
          categoryId: '', // 类别
          title: '', // 标题
          author: '' // 作者
        },
        num: '点击查看',
        num2: '点击查看',
        sub: true,
        tableData: []
      }
    },
    created() {
      this.getList(0);
      let power = store.local.get('access_token').split('.')[1];
      power = parseBase.decode(power);
      if (power.indexOf('addKnowledge') < 0) this.powerBtn.addBtn = false;
      if (power.indexOf('listKnowledge') < 0) this.powerBtn.listBtn = false;
      if (power.indexOf('getKnowledge') < 0) this.powerBtn.getBtn = false;
      if (power.indexOf('updateKnowledge') < 0) this.powerBtn.updateBtn = false;
      if (power.indexOf('deleteKnowledge') < 0) this.powerBtn.deleteBtn = false;
      if (power.indexOf('UpdateKnowledgeStatus') < 0) this.powerBtn.statusBtn = false;
    },
    methods: {
      searchData(pageNum) {
        let startTime, endTime;
        if (this.form.createTime !== '') {
          startTime = this.form.createTime + ' ' +  '00:00:00';
          if (this.form.createTime == null) {
            startTime = null
          }
        } else {
          startTime = null
        }
        if (this.form.updateTime !== '') {
          endTime = this.form.updateTime + ' ' +  '23:59:59';
          if (this.form.updateTime == null) {
            endTime = null
          }
        } else {
          endTime = null
        }
        request.get('/api/auth/v1/knowledge', {
          params: {
            pageNum: pageNum || this.pageNum,
            pageSize: this.pageSize,
            startTime: startTime,
            endTime: endTime,
            title: this.form.title || null,
            author: this.form.author || null,
            status: this.form.status || null,
            categoryId: this.form.categoryId || null,
            contentType: this.form.contentType || null
          }
        }).then((res) => {
          console.log(res.data);
          this.tableData = res.data.list;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.$message({
            type: 'success',
            message: '搜索成功!'
          })
        }).catch((err) => {
          console.log('请求失败' + err);
        })
      },
      formReset(formName) {
        // this.$refs[formName].resetFields()
        this.form.createTime = '';
        this.form.updateTime = '';
        this.form.status = '';
        this.form.contentType = '';
        this.form.title = '';
        this.form.categoryId = '';
        this.form.author = ''
      },
      handleEdit(index, row) { // 编辑
        this.$router.push({
          path: 'knowledgeedit',
          query: { userId: row.id }
        })
      },
      handleSub(index, row) { // 发布
        this.$confirm('确定修改状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let status;
          if (row.status === 1) {
            status = 0
          } else {
            status = 1
          }
          request.post(`/api/auth/v1/knowledge/updateStatus`, {
            id: row.id,
            status: status
          }).then((res) => {
            this.$message({
              type: 'success',
              message: '状态修改成功!'
            });
            this.searchData()
          }).catch((err) => {
            this.$message({
              type: 'info',
              message: '状态修改失败!'
            });
          })
          // this.tableData.splice(index, 1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消更改'
          })
        })
      },
      // handleDown(index, row) { // 下架
      //   this.$confirm('确定修改状态?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     request.post(`/api/auth/v1/knowledge/updateStatus`, {
      //       id: row.id,
      //       status: row.status
      //     }).then((res) => {
      //       this.tableData = this.tableData.filter((item) => {
      //         return item.status != row.status
      //       })
      //       this.row.status = 1;
      //       this.$message({
      //         type: 'success',
      //         message: '状态修改成功!'
      //       });
      //     })
      //   }).catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消更改'
      //     })
      //   })
      // },
      handleDelete(index, row) { // 删除知识库
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.delete(`/api/auth/v1/knowledge/${row.id}`).then((res) => {
            // this.listData = this.listData.filter((item) => {
            //   return item.id != row.id
            // })
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
          this.tableData.splice(index, 1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      addKnowledge() { // 添加知识
        this.$router.push({
          path: 'knowledgeadd'
        })
      },
      toDetail(row) { // 知识详情
        if (this.powerBtn.getBtn) {
          this.$router.push({
            path: 'knowledgedetails',
            query: { userId: row.id }
          })
        }
      },
      getList(num) {
        request.get('/api/auth/v1/knowledge', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            status: num
          }
        }).then((res) => {
          // console.log(res.data);
          this.tableData = res.data.list;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          if (num === 0) {
            this.num2 = res.data.total
          } else if (num === 1) {
            this.num = res.data.total
          }
        })
      },
      getCategory() {
        request.get('/api/auth/v1/knowledge/category').then((res) => {
          // console.log(res.data);
          this.categorys = res.data;
        })
      },
      getCurrent(current) {
        if (current.currentPage) {
          this.pageNum = current.currentPage
        }
        if (current.currentSize) {
          this.pageSize = current.currentSize
        }
        this.searchData()
      }
    },
    mounted() {
      this.getCategory()
    }
  }
</script>

<style scoped>
  .container{
    background-color: #ffffff;
    border-radius: 10px;
    min-width: 1010px;
    padding: 5px 0px 5px 15px;
    margin-top: 15px;
    font-size: 15px;
  }
  .float_r{
    float: right;
  }
  .demonstration{
    margin: 5px 30px 5px 0px;
    display: inline-block;
  }
  .item-dispIb{
    display: inline-block;
    margin: 5px;
  }
  .item-a{
    color: #3c79e8;
    cursor: pointer;
  }
  .rowheight .el-table__row td{max-height: 35px !important;overflow: auto !important;}
</style>
