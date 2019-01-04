<template>
  <div>
    <div class="search-add">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" class="ke-ruleForm" size="mini">
        <el-form-item label="名称">
          <el-input v-model="ruleForm.name" placeholder="请输入..." clearable></el-input>
        </el-form-item>
        <el-form-item label="身体部位" >
          <div @mouseenter="mouseenter('bodyPart')" @mouseleave="mouseleave('bodyPart','bodySelect')">
              <el-select v-if="sign.bodySelect.show"
                v-model="ruleForm.bodyPart"
                style="width: 120px;"
              >
                <el-option
                  v-for="(value, key,index) in bodyPart"
                  :key="key"
                  :label="value"
                  :value="key"
                >

                </el-option>
              </el-select>
              <el-input v-else clearable v-model="sign.bodySelect.value" @clear="clealSignValue('bodyPart','bodySelect')"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="年级">
          <div @mouseenter="mouseenter('gradeId')" @mouseleave="mouseleave('gradeId','gradeIdSelect')">
              <el-select v-if="sign.gradeIdSelect.show"
                v-model="ruleForm.gradeId"
                style="width: 120px;"
              >
                <el-option
                  v-for="item in gradeId"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >

                </el-option>
              </el-select>
              <el-input v-else clearable v-model="sign.gradeIdSelect.value" @clear="clealSignValue('gradeId','gradeIdSelect')"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="性别">
          <div @mouseenter="mouseenter('sex')" @mouseleave="mouseleave('sex','sexSelect')">
              <el-select
                v-if="sign.sexSelect.show"
                v-model="ruleForm.sex"
                style="width: 120px;"
              >
                <el-option
                  v-for="(value, key,index) in sexArr"
                  :key="key"
                  :label="value"
                  :value="key"
                >
                </el-option>
              </el-select>
              <el-input  v-else clearable v-model="sign.sexSelect.value" @clear="clealSignValue('sex','sexSelect')"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="难度">
          <div @mouseenter="mouseenter('difficulty')" @mouseleave="mouseleave('difficulty','difficultySelect')">
              <el-select
                v-if="sign.difficultySelect.show"
                v-model="ruleForm.difficulty"
                style="width: 120px;"
              >
                <el-option
                  v-for="(value, key,index) in difficulty"
                  :key="key"
                  :label="value"
                  :value="key"
                >
                </el-option>
              </el-select>
              <el-input v-else clearable v-model="sign.difficultySelect.value" @clear="clealSignValue('difficulty','difficultySelect')"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" size="mini" @click="importData" v-show="powerBtn.appenBtn">导入</el-button>
        <el-button type="primary" size="mini" @click="addData" v-show="powerBtn.addBtn">新增</el-button>
        <el-button type="primary" size="mini" @click="searchData">查询</el-button>
      </div>
    </div>
    <div class="contain-vessel">
      <el-table
        :data="tableList"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
        v-loading="loading"
        element-loading-text="拼命加载中"
      >
        <el-table-column
          prop="name"
          label="名称"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="bodyPart"
          label="身体部位"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">{{ bodyPart[scope.row.bodyPart] }}</template>
        </el-table-column>
        <el-table-column
          prop="gradeIds"
          label="年级"
          align="center"
          header-align="center"
          :formatter="formatter"
        >
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">{{ scope.row.sex === 1 ? '男' : scope.row.sex === 2 ? '女' : '男;女' }}</template>
        </el-table-column>
        <el-table-column
          prop="difficulty"
          label="难度"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">{{ difficulty[scope.row.difficulty] }}</template>
        </el-table-column>
        <el-table-column
          v-show="powerBtn.detailsBtn || powerBtn.alertBtn ||powerBtn.deleteBtn"
          label="操作"
          align="center"
          header-align="center"
          width="250"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="checkList(scope.row)" v-show="powerBtn.detailsBtn">查看</el-button>
            <el-button type="primary" size="small" @click="modifyList(scope.row)" v-show="powerBtn.alertBtn">编辑</el-button>
            <el-button type="primary" size="small" @click="deleteList(scope.row)" v-show="powerBtn.deleteBtn">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Paging :pageNum="pageNum"
              :pageSize="pageSize"
              :total="total"
              @current="getCurrent"
      >
      </Paging>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import parseBase from '@/utils/parseBase';
import store from '@/utils/store';
import Paging from "../../components/common/paging";
import { BODYPART, SEXARR, DIFFICULTY } from "@/utils/comData";

export default {
  created() {
    this.difficulty[4]="全部";
    this.sexArr[3]="全部";
    this.bodyPart[5]="全部"
    this.getList();
    this.getGradeUnion();
    var power=store.local.get("access_token").split(".")[1];
    power=parseBase.decode(power);
    if(power.indexOf("addGuidancePoint")<0) this.powerBtn.addBtn=false;
    if(power.indexOf("getGuidancePoint")<0) this.powerBtn.detailsBtn=false;
    if(power.indexOf("deleteGuidancePoint")<0) this.powerBtn.deleteBtn=false;
    if(power.indexOf("updateGuidancePoint")<0) this.powerBtn.alertBtn=false;
    if(power.indexOf("batchImportGuidancePoint")<0) this.powerBtn.appenBtn=false;

  },
  data() {
    return {
      gradeList: [],
      tableList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      ruleForm: {
        name: "",
        bodyPart: "",
        sex: "",
        difficulty: "",
        gradeId: ""
      },
      bodyPart: BODYPART,
      sexArr: SEXARR,
      difficulty: DIFFICULTY,
      gradeId: [],
      multipleSelection: [],
      sign:{
        bodySelect:{show:true,value:""},
        gradeIdSelect:{show:true,value:""},
        sexSelect:{show:true,value:""},
        difficultySelect:{show:true,value:""},
      },
      loading:false,
      powerBtn:{
        addBtn:true,
        appenBtn:true,
        detailsBtn:true,
        alertBtn:true,
        deleteBtn:true
      }
    };
  },
  methods: {
    getList() {
      this.loading=true;
      let difficulty=this.ruleForm.difficulty;
      if(difficulty=="4") difficulty="";
      let sex=this.ruleForm.sex;
      if(sex=="3" ) sex="";
      let bodyPart=this.ruleForm.bodyPart;
      if(bodyPart=="5") bodyPart="";

      let gradeId=this.ruleForm.gradeId;
      if(gradeId=="all") gradeId="";
      request
        .get("/api/auth/v1/guidancePoint", {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            name: this.ruleForm.name,
            bodyPart: bodyPart,
            sex: sex,
            difficulty: difficulty,
            gradeId: gradeId
          }
        })
        .then(res => {
          this.tableList = res.data.list || [];
          this.total = res.data.total;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
          this.loading=false;
        })
        .catch(err => {
          this.loading=false;
        });
    },
    getGradeUnion() {
      request.get("/api/auth/v1/gradeUnion").then(res => {
        this.gradeId = res.data;
        this.gradeId.push({code:"all",name:"全部"})
      });
    },
    getCurrent(current) {
      if (current.currentPage) {
        this.pageNum = current.currentPage;
      }
      if (current.currentSize) {
        this.pageSize = current.currentSize;
      }
      this.getList();
    },
    searchData() {
      this.getList();
    },
    importData() {
      this.$router.push({
        path: `/guidancePoint/guidanceimport`
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    modifyList(row) {
      this.$router.push({
        path: `/guidancePoint/guidanceedit`,
        query: { id: row.id }
      });
    },
    checkList(row) {
      this.$router.push({
        path: `/guidancePoint/guidancedetail`,
        query: { id: row.id }
      });
    },
    deleteList(row) {
      this.$confirm("此操作将删除无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          request.delete(`/api/auth/v1/guidancePoint/${row.id}`).then(res => {
            this.tableList = this.tableList.filter(item => {
              return item.id != row.id;
            });
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {});
    },
    addData() {
      this.$router.push({
        path: `/guidancePoint/guidanceadd`
      });
    },
    mouseenter(fieldName) {
      switch(fieldName){
        case "bodyPart":
            if(this.ruleForm.bodyPart){
              this.sign.bodySelect.show=false;
              this.sign.bodySelect.value=this.bodyPart[this.ruleForm.bodyPart];
            }
        break;
        case "gradeId":
            if(this.ruleForm.gradeId){
              this.sign.gradeIdSelect.show=false;
              this.gradeId.forEach((item,index)=>{
                if(this.ruleForm.gradeId==item.code){
                  this.sign.gradeIdSelect.value=item.name;
                  return;
                }
              })
            }
        break;
        case "sex" :
          if(this.ruleForm.sex){
            this.sign.sexSelect.show=false;
            this.sign.sexSelect.value=this.sexArr[this.ruleForm.sex];
          }
        break;
        case "difficulty":
          if(this.ruleForm.difficulty){
            this.sign.difficultySelect.show=false;
            this.sign.difficultySelect.value=this.difficulty[this.ruleForm.difficulty];
          }
        break;
      }
    },
    mouseleave(fieldName,inputName) {
      if(!this.sign[inputName].show){
        this.sign[inputName].show=true;

      }
    },
    clealSignValue(fieldName,inputName){

        this.sign[inputName].value="";
        this.ruleForm[fieldName]="";
        this.sign[inputName].show=true;
    },
    formatter(row, column, cellValue, index){
      const gradeIdValue=[];
      const gradeIdValue1="1,2,3";
      const gradeIdValue2="4,5,6";
      const gradeIdValue3="7,8,9";
      const gradeIdValue4="10,11,12";
      if(cellValue.indexOf(gradeIdValue1)>=0){
        this.gradeId.forEach((item)=>{
          if(item.code==gradeIdValue1){
              gradeIdValue.push(item.name);
              return
          }
        })
      }
      if(cellValue.indexOf(gradeIdValue2)>=0){
        this.gradeId.forEach((item)=>{
          if(item.code==gradeIdValue2){
              gradeIdValue.push(item.name);
              return;
          }
        })
      }
      if(cellValue.indexOf(gradeIdValue3)>=0){
        this.gradeId.forEach((item)=>{
          if(item.code==gradeIdValue3){
              gradeIdValue.push(item.name);
              return;
          }
        })
      }
      if(cellValue.indexOf(gradeIdValue4)>=0){
        this.gradeId.forEach((item)=>{
          if(item.code==gradeIdValue4){
              gradeIdValue.push(item.name);
              return;
          }
        })
      }
      if(gradeIdValue.length>0){
        var energy=gradeIdValue.join(";");
      }else{
        var energy="";
      }
      return energy;

    }
  },
  components: {
    Paging
  }
};
</script>

<style scoped>
.el-input {
  width: 120px !important;
}
</style>
