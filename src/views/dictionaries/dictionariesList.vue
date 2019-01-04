<template>
  <div class="dictionaries">
    <el-row class="title">
      <el-col :span="14">
        <h3 class="title_name">字典管理</h3>
      </el-col>
      <el-col :span="10" class="title_btn">
        <el-button icon="el-icon-arrow-down" size="small" v-if="isSelect" @click="isSelect=false">查询</el-button>
        <el-button icon="el-icon-arrow-up" size="small" v-else @click="isSelect=true">隐藏</el-button>
        <el-button icon="el-icon-plus" size="small" @click="addDictionariesType">新增</el-button>
      </el-col>
    </el-row>
    <el-row class="dis_select" v-if="!isSelect">
      <el-col :span="6">
        <label class="dis_select_label">字典名称</label>
        <el-input size="small" class="dis-select_value" v-model="search.description"></el-input>
      </el-col>
      <el-col :span="6">
        <label class="dis_select_label">字典类型</label>
        <el-select class="dis-select_value" v-model="search.type" placeholder="请选择" size="small">
          <el-option v-for="(item,index) in typeData" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <label class="dis_select_label">字典状态</label>
        <el-select class="dis-select_value" v-model="search.delFlag" placeholder="请选择" size="small">
          <el-option
            v-for="item in delFlagData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4" class="dic_btn">
        <el-button type="primary" size="mini" @click="selectData">查询</el-button>
        <el-button type="primary" size="mini" @click="clearData">重置</el-button>
      </el-col>
    </el-row>
    <el-row class="dis_table" :style="{'min-height':tableHeight}">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        stripe
        :max-height="tableHeight"
        @cell-click="cellClick"
      >
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <el-table-column
          property="description"
          label="字典名称"
          width="120"
          align="center"
          class-name="columnName"
        ></el-table-column>
        <el-table-column
          property="type"
          label="字典类型"
          width="120"
          align="center"
          class-name="columnName"
        ></el-table-column>
        <el-table-column property="updateTime" label="更新时间" min-width="120" align="center"></el-table-column>
        <el-table-column property="remarks" label="备注信息" width="120" align="center"></el-table-column>
        <el-table-column
          property="delFlag"
          label="字典状态"
          width="120"
          align="center"
          :formatter="formatter"
        ></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <i
              class="el-icon-edit dis_icon_edit"
              title="编辑字典类型"
              @click="handleEdit(scope.$index, scope.row)"
            ></i>
            <i
              class="el-icon-menu dis_icon_menu"
              title="字段数据"
              @click="handleMenu(scope.$index, scope.row)"
            ></i>
            <i
              class="el-icon-delete dis_icon_stop"
              title="删除字典"
              @click="handleDelete(scope.$index, scope.row)"
            ></i>
            <i
              class="el-icon-success dis_icon_edit"
              title="启用字典类型"
              @click="handleStart(scope.$index, scope.row)"
              v-if="scope.row.delFlag==1"
            ></i>
            <i
              v-else
              class="el-icon-circle-close dis_icon_stop"
              title="停用字典类型"
              @click="handleStop(scope.$index, scope.row)"
            ></i>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="dis_pagination">
      <el-col :span="24">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="[10,20,50,100]"
            :page-size="page.pageSize"
            layout="prev, pager, next, jumper,sizes"
            :total="page.total"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  created() {
    this.dictDataHeight = document.body.clientHeight - 50 + "px";
    this.tableHeight = document.body.clientHeight - 180;
  },
  data() {
    return {
      tableData: [{}, {}],
      isSelect: false,
      search: {
        delFlag: "",
        type: "",
        description: ""
      },
      typeData: [],
      dictDataHeight: "600px",
      tableHeight: 300,
      delFlagData: [
        { value: "", label: "" },
        { value: 0, label: "正常" },
        { value: 1, label: "停用" }
      ],
      page: {
        currentPage: 1,
        total: 4000,
        pageSize: 10
      }
    };
  },
  methods: {
    clearData() {
      for (name in this.search) {
        this.search[name] = "";
      }
    },
    selectData: selectData,
    getFormData: getFormData,
    getFieldType: getFieldType,
    formatter(row, column, cellValue, index) {
      if (cellValue == 0) {
        return "正常";
      } else {
        return "停用";
      }
    },
    addDictionariesType() {
      this.$router.push({
        name: "AddDictionaries",
        params: {
          type: "add",
          formName: "DictionariesList"
        }
      });
    },
    handleSizeChange(value) {
      this.page.pageSize = value;
      this.page.currentPage = 1;
      this.selectData();
    },
    handleCurrentChange(value) {
      this.page.currentPage = value;
      this.selectData();
    },
    cellClick(row, column, cell, event) {
      if (column.property == "description" || column.property == "type") {
        this.$router.push({
          name: "Dictionaries",
          params: {
            type: "update",
            formType: row.type
          }
        });
      }
    },
    handleEdit(index, row) {
      this.$router.push({
        name: "EditDictionaries",
        params: {
          type: "editListType",
          id: row.id,
          formName: "DictionariesList"
        }
      });
    },
    handleMenu(index, row) {},
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          request
            .delete("/api/auth/v1/dict/deleteDictType/" + row.id)
            .then(res => {
              this.selectData();
              this.getFieldType();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleStart(index, row) {
      request
        .post("/api/auth/v1/dict/discontinueDictType/" + row.id, {
          delFlag: 0
        })
        .then(res => {
          this.selectData();
        });
    },
    handleStop(index, row) {
      request
        .post("/api/auth/v1/dict/discontinueDictType/" + row.id, {
          delFlag: 1
        })
        .then(res => {
          this.selectData();
        });
    }
  },
  watch: {
    $route(to, form) {
      if (to.name == "DictionariesList" && to.params.type == "update") {
        this.selectData();
        this.getFieldType();
      }
    }
  },
  mounted() {
    this.getFormData({ pageNum: 1, pageSize: 10 });
    this.getFieldType();
  }
};
function selectData() {
  let params = {};
  for (name in this.search) {
    if (this.search[name]) {
      params[name] = this.search[name];
    }
  }
  if (JSON.stringify(this.search.delFlag) == "0") {
    params.delFlag = this.search.delFlag;
  }
  params.pageSize = this.page.pageSize;
  params.pageNum = this.page.currentPage;
  this.getFormData(params);
}
function getFormData(params) {
  request
    .get("/api/auth/v1/dict/getDictByGroup", {
      params
    })
    .then(res => {
      this.tableData = res.data.list;
      this.page.total = res.data.total;
    });
}
function getFieldType() {
  request.get("/api/auth/v1/dict/findTypeList", {}).then(res => {
    this.typeData = [""].concat(res.data);
  });
}
</script>
<style lang="scss" scoped>
.title {
  border-bottom: 1px solid #cccccc;
  padding: 10px 15px;
  .el-col {
    vertical-align: middle;
  }
  .title_name {
    margin: 0px;
    line-height: 32px;
  }
  .title_btn {
    text-align: right;
  }
  .el-button + .el-button {
    margin-left: 0px;
  }
}
.dis_select {
  padding: 0px 15px;
  .el-col + .el-col {
    margin-left: 5px;
  }
  .dis_select_label {
    width: 65px;
    display: inline-block;
    text-align: right;
    margin-right: 5px;
  }
  .dis-select_value {
    width: calc(100% - 75px);
  }
  .dic_btn {
    line-height: 32px;
    height: 32px;
    margin-left: 20px;
  }
}

.dis_table {
  padding: 0px 10px 5px 10px;
  .el-table {
    .el-table__body {
      td {
        border: 1px solid #ebeef5;
        i {
          width: 20px;
          cursor: pointer;
          text-align: center;
          font-size: 18px;
        }
        i + i {
          margin-left: 5px;
        }
        .dis_icon_stop,
        .dis_icon_del {
          color: #f56c6c;
        }
        .dis_icon_edit {
          color: #67c23a;
        }
      }
    }
  }
}
.dis_pagination {
  margin-top: 10px;
  padding-bottom: 20px;
  text-align: right;
  .btn-prev,
  .btn-next {
    border: 1px solid #cccccc;
  }
  .btn-prev {
    border-radius: 5px 0px 0px 5px;
  }
  .btn-next {
    border-radius: 0px 5px 5px 0px;
  }
}
</style>
<style lang="scss">
.dis_table {
  .el-table {
    td,
    th.is-leaf {
      border: 1px solid #ebeef5;
      border-top: 0px;
      border-left: 0px;
      padding: 5px 0px;
    }
  }
  .el-table__body {
    tr.el-table__row {
      &::hover {
        background: #ebeef5;
      }
    }
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #e3e7ea;
    color: #606266;
  }
  td.columnName {
    cursor: pointer;
    color: #3c8dbc !important;
  }
}
.dis_pagination {
  .btn-prev,
  .btn-next {
    border: 1px solid #cccccc;
    height: 30px;
  }
  .btn-prev {
    border-radius: 5px 0px 0px 5px;
  }
  .btn-next {
    border-radius: 0px 5px 5px 0px;
  }
  .el-pager {
    border: 1px solid #cccccc;
    border-left: 0px;
    border-right: 0px;
    li + li {
      border-left: 1px solid #cccccc;
    }
    li.active {
      background-color: #d0cdcd;
    }
  }
}
</style>



