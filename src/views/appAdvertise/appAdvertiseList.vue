<template>
  <div class="appAdvertiseList">
    <el-row class="appAdvertiseList_search">
      <el-col :span="6">
        <span class="appAdvertiseList_search_label">标题</span>
        <el-input size="mini" class="appAdvertiseList_search_value" v-model="search.title"></el-input>
      </el-col>
      <el-col :span="6">
        <span class="appAdvertiseList_search_label1">能否跳转</span>
        <el-select size="mini" class="appAdvertiseList_search_value1" v-model="search.skipState">
          <el-option
            v-for="item in skipStateData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <span class="appAdvertiseList_search_label">状态</span>
        <el-select size="mini" class="appAdvertiseList_search_value" v-model="search.state">
          <el-option
            v-for="item in stateData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" size="mini" @click="searchData" :disabled="loading">查询</el-button>
        <el-button type="primary" size="mini" @click="addData" :disabled="loading">创建</el-button>
      </el-col>
    </el-row>
    <div
      class="appAdvertiseList_content"
      :style="{minHeight:minHeight}"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <div class="appAdvertiseList_table">
        <el-table :data="listData" width="100%" :max-height="maxHeight">
          <el-table-column prop="title" label="标题" min-width="140" align="center"></el-table-column>
          <el-table-column
            prop="skipState"
            label="能否跳转"
            width="120"
            align="center"
            :formatter="formatterSkip"
          ></el-table-column>
          <el-table-column
            prop="state"
            label="状态"
            width="120"
            align="center"
            :formatter="formatterState"
          ></el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="160" align="center"></el-table-column>
          <el-table-column label="操作" width="320" align="center">
            <template slot-scope="scope">
              <el-button size="mini" v-if="scope.row.state==1" @click="updateState(scope.row,0)">上架</el-button>
              <el-button size="mini" v-else @click="updateState(scope.row,1)">下架</el-button>
              <el-button size="mini" @click="checkDetail(scope.row)">查看</el-button>
              <el-button size="mini" @click="editData(scope.row)">编辑</el-button>
              <el-button size="mini" @click="delectData(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="appAdvertiseList_page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  data() {
    return {
      minHeight: "500px",
      maxHeight: 500,
      loading: true,
      search: {
        title: "",
        skipState: "",
        state: ""
      },
      skipStateData: [
        { value: "", label: "全部" },
        { value: 0, label: "跳转" },
        { value: 1, label: "不跳转" }
      ],
      stateData: [
        { value: "", label: "全部" },
        { value: 0, label: "已上架" },
        { value: 1, label: "未上架" }
      ],
      listData: [],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    };
  },
  methods: {
    formatterSkip(row, column, cellValue, index) {
      if (cellValue == 0) {
        return "跳转";
      } else {
        return "不跳转";
      }
    },
    formatterState(row, column, cellValue, index) {
      if (cellValue == 0) {
        return "已上架";
      } else {
        return "未上架";
      }
    },
    getFormData: getFormData,
    searchData: searchData,
    addData: addData,
    updateState: updateState,
    checkDetail: checkDetail,
    editData: editData,
    delectData: delectData,
    handleSizeChange: handleSizeChange,
    handleCurrentChange: handleCurrentChange
  },
  watch: {
    $route(to, form) {
      if (to.name == "AppAdvertiseList" && to.params.type == "update") {
        this.searchData();
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "AppAdvertiseDetail") {
      if (to.params.type == "add") {
        to.meta.title = "新增公告";
      } else if (to.params.type == "edit") {
        to.meta.title = "编辑公告";
      } else {
        to.meta.title = "公告详情";
      }
    }
    next();
  },
  mounted() {
    this.minHeight = document.documentElement.clientHeight - 140 + "px";
    this.maxHeight = document.documentElement.clientHeight - 230;
    let params = this.search;
    this.getFormData(params);
  }
};
function searchData() {
  let params = {};
  if (this.search.title) {
    params.title = this.search.title;
  }
  params.skipState = this.search.skipState;
  params.state = this.search.state;
  this.getFormData(params);
}
function handleSizeChange(val) {
  this.page.pageSize = val;
  this.searchData();
}
function handleCurrentChange(val) {
  this.page.pageNum = val;
  this.searchData();
}
function getFormData(params) {
  params.pageSize = this.page.pageSize;
  params.pageNum = this.page.pageNum;
  this.loading = true;
  request
    .get("/api/auth/v1/notice/findList", {
      params
    })
    .then(res => {
      this.listData = res.data.list;
      this.page.total = res.data.total;
      this.loading = false;
    })
    .catch(res => {
      this.loading = false;
    });
}
function addData() {
  this.$router.push({
    name: "AppAdvertiseDetail",
    params: {
      type: "add"
    }
  });
}
function updateState(row, type) {
  request
    .post("/api/auth/v1/notice/updateState", {
      state: type,
      id: row.id
    })
    .then(res => {
      this.searchData();
    });
}
function checkDetail(row) {
  this.$router.push({
    name: "AppAdvertiseDetail",
    params: {
      type: "detail",
      id: row.id
    }
  });
}
function editData(row) {
  this.$router.push({
    name: "AppAdvertiseDetail",
    params: {
      type: "edit",
      id: row.id
    }
  });
}
function delectData(row) {
  this.$confirm("此操作将永久删除该行数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      request.delete("api/auth/v1/notice/" + row.id).then(res => {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.searchData();
      });
    })
    .catch(() => {
      this.$message({
        type: "info",
        message: "已取消删除"
      });
    });
}
</script>
<style lang="scss" scoped>
.appAdvertiseList {
  .appAdvertiseList_search {
    background: #fff;
    padding: 15px;
    border-radius: 7px;
    margin-bottom: 10px;
    .appAdvertiseList_search_label {
      display: inline-block;
      width: 40px;
      vertical-align: middle;
      padding-left: 5px;
    }
    .appAdvertiseList_search_value {
      width: calc(100% - 50px);
      vertical-align: middle;
    }
    .appAdvertiseList_search_label1 {
      display: inline-block;
      width: 70px;
      vertical-align: middle;
      padding-left: 5px;
    }
    .appAdvertiseList_search_value1 {
      width: calc(100% - 80px);
      vertical-align: middle;
    }
  }
  .appAdvertiseList_content {
    background: #fff;
    padding: 15px;
    border-radius: 7px;
    margin-bottom: 10px;
    .appAdvertiseList_table {
      margin-bottom: 20px;
      padding: 0px 10px;
    }
    .appAdvertiseList_page {
      text-align: right;
      padding-right: 15px;
    }
  }
}
</style>


