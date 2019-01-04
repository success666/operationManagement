<template>
    <div>
      <div class="container">
        <div class="title">
          <h3 class="float-l">版本管理</h3>
          <el-button type="primary" size="medium" class="float-r" @click="addVersion()">新增版本</el-button>
        </div>
        <template>
          <el-table
            :data="listData"
            stripe
            style="width: 100%">
            <el-table-column
              prop="name"
              align="center"
              label="APP名"
              width="250">
              <template slot-scope="scope">
                <span>{{scope.row.name === 1 ? '家长端APP' : '学校端APP'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="platform"
              align="center"
              label="平台"
              width="220">
              <template slot-scope="scope">
                <span>{{scope.row.platform === 1 ? 'iOS' : 'Android' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="versionNum"
              align="center"
              label="版本"
              width="220">
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="220">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="handleDetail(scope.$index, scope.row)">详情</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <Paging :pageNum="pageNum"
                  :pageSize="pageSize"
                  :total="total"
                  @current="getCurrent"
          ></Paging>
        </template>
      </div>
    </div>
</template>

<script>
    import request from '@/utils/request'
    import Paging from '../../components/common/paging'
    export default {
      name: 'versionMange',
      data() {
        return {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          size: '',
          startRow: '',
          endRow: '',
          pages: '',
          listData: []
        }
      },
      methods: {
        getPage() {
          request.get('/api/auth/v1/appVersion', {
            params: {
              pageNum: this.pageNum,
              pageSize: this.pageSize
            }
          }).then((res) => {
            this.listData = res.data.list;
            this.pageSize = res.data.pageSize;
            this.total = res.data.total;
            this.pageNum = res.data.pageNum;
          }).catch((err) => {
            // console.log(err + '获取数据失败')
          })
        },
        handleDetail(index, row) { // 编辑
          this.$router.push({
            path: 'versiondetail',
            // query: { rowData: row }
            query: { rowId: row.id }
          })
        },
        handleDelete(index, row) { // 删除
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            request.delete(`/api/auth/v1/appVersion/${row.id}`).then((res) => {
              this.listData = this.listData.filter((item) => {
                return item.id != row.id
              })
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
        getCurrent(current) {
          if (current.currentPage) {
            this.pageNum = current.currentPage
          }
          if (current.currentSize) {
            this.pageSize = current.currentSize
          }
          this.getList()
        },
        getList() {
          request.get('/api/auth/v1/appVersion', {
            params: {
              pageNum: this.pageNum,
              pageSize: this.pageSize
            }
          }).then((res) => {
            this.listData = res.data.list || [];
            this.total = res.data.total;
            this.pageNum = res.data.pageNum;
            this.pageSize = res.data.pageSize
          })
        },
        addVersion() {
          this.$router.push({
            path: 'versionadd'
          })
        }
      },
      mounted() {
        this.getPage()
      },
      components: {
        Paging
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
    height: 40px;
  }
  .title .float-l{
    float: left;
  }
  .title .float-r{
    float: right;
  }
</style>
