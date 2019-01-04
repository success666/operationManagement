<template>
  <div>
    <div class="search-add selectList">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" class="ke-ruleForm" size="mini">
        <el-form-item label="名称">
          <el-input v-model="ruleForm.name" placeholder="请输入..." clearable></el-input>
        </el-form-item>
        <el-form-item label="运动项目" class="moreSelect">
              <el-select 
                v-model="ruleForm.sportItemNames"
                style="width: 240px;"
                multiple
              >
                <el-option
                  v-for="item in sportItemNamesData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
              <!-- <el-input v-else clearable v-model="sign.sportItemNames.value" @clear="clealSignValue('sportItemNames','sportItemNamesSelect')"></el-input> -->
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
                  v-for="(value, key) in sexArr"
                  :key="key"
                  :label="value"
                  :value="key"
                >
                </el-option>
              </el-select>
              <el-input v-else clearable v-model="sign.sexSelect.value" @clear="clealSignValue('sex','sexSelect')"></el-input>
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
                  v-for="(value, key) in difficulty"
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
        <!--<el-button type="primary" size="mini" @click="importData">导入</el-button>-->
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
        @row-click="rowClick"
        highlight-current-row
        fit
      >
        <el-table-column
          prop="name"
          label="作业点名称"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="sportItemNames"
          label="运动项目"
          align="center"
          header-align="center"
          :formatter="formatter"
        >
        </el-table-column>
        <el-table-column
          prop="gradeNames"
          label="年级"
          align="center"
          header-align="center"
          :formatter="formatter"
        >
        </el-table-column>
        <el-table-column
          prop="sexName"
          label="性别"
          align="center"
          header-align="center"
          :formatter="formatter"
        >
        </el-table-column>
        <el-table-column
          prop="difficultyName"
          label="难度"
          align="center"
          header-align="center"
        >
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
  import request from '@/utils/request'
  import Paging from '../../components/common/paging'
  import parseBase from '@/utils/parseBase';
  import store from '@/utils/store';
  import { BODYPART, SEXARR, DIFFICULTY } from '@/utils/comData'

  export default {
    created() {
      this.getList();
      this.getGradeUnion();
      this.getSportItem();
      this.difficulty[4]="全部";
      this.sexArr[3]="全部";
      let power=store.local.get("access_token").split(".")[1];
      power=parseBase.decode(power);
      if(power.indexOf("addHomeworkLib")<0) this.powerBtn.addBtn=false;
      if(power.indexOf("getHomeworkLib")<0) this.powerBtn.detailsBtn=false;
      if(power.indexOf("deleteHomeworkLib")<0) this.powerBtn.deleteBtn=false;
      if(power.indexOf("updateHomeworkLib")<0) this.powerBtn.alertBtn=false;
    },
    data() {
      return {
        gradeList: [],
        tableList: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        ruleForm: {
          name: '',
          sportItemNames: [],
          sex: '',
          difficulty: '',
          gradeId: ''
        },
        sportItemNamesData:[],
        bodyPart: BODYPART,
        sexArr: SEXARR,
        difficulty: DIFFICULTY,
        gradeId: [],
        multipleSelection: [],
        sign:{
          sportItemNamesSelect:{show:true,value:""},
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
      }
    },
    methods: {
      getList() {
        let sex=this.ruleForm.sex;
        if(sex=="3"){
          sex="";
        }
        let difficulty=this.ruleForm.difficulty;
        if(difficulty=="4") difficulty="";
        let gradeId=this.ruleForm.gradeId;
        if(gradeId=="all") gradeId="";
        this.loading=true;
        var sportItemNames=this.ruleForm.sportItemNames.join(",");
        request.get('/api/auth/v1/homeworkLib', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            name: this.ruleForm.name,
            sportItemNames: sportItemNames,
            sex: sex,
            difficulty: difficulty,
            gradeIds: gradeId,
          }
        }).then((res) => {
          this.loading=false;
          this.tableList = res.data.list || [];
          this.total = res.data.total;
          this.pageNum = res.data.pageNum;
          this.pageSize = res.data.pageSize;
        }).catch((err) => {
          this.loading=false;
        })
      },
      getGradeUnion() {
        request.get('/api/auth/v1/gradeUnion').then((res) => {
          this.gradeId = res.data;
          this.gradeId.push({code:"all",name:"全部"})
        })
      },

      getSportItem() {
        request.get('/api/auth/v1/sportItem/category').then((res) => {
          this.sportItemNamesData=res.data;
        })
      },
      getCurrent(current) {
        if (current.currentPage) {
          this.pageNum = current.currentPage;
        }
        if (current.currentSize) {
          this.pageSize = current.currentSize
        }
        this.getList()
      },
      searchData() {
        this.getList();
      },
      importData() {
        this.$router.push({
          path: `/homeworkLib/homeworkimport`,
        })
      },
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      },
      modifyList(row) {
        this.$router.push({
          path: `/homeworkLib/homeworkedit`,
          query: {id: row.id}
        })
      },
      checkList(row) {
        this.$router.push({
          path: `/homeworkLib/homeworkdetail`,
          query: {id: row.id}
        })
      },
      deleteList(row) {
        console.log(row.id);
        this.$confirm('此操作将删除无法恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.delete(`/api/auth/v1/homeworkLib/${row.id}`).then((res) => {
            this.tableList = this.tableList.filter((item) => {
              return item.id != row.id
            })
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(() => {

        });
      },
      addData() {
        this.$router.push({
          path: `/homeworkLib/homeworkadd`
        })
      },
      mouseenter(fieldName) {
        switch(fieldName){
          case "sportItemNames":
              if(this.ruleForm.sportItemNames.length>0){
                this.sign.sportItemNamesSelect.show=false;
                let value=JSON.parse(JSON.stringify(this.ruleForm.sportItemNames));
                this.sign.sportItemNamesSelect.value=value.join(";");
                console.log(this.ruleForm.sportItemNames);
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
          if(fieldName=="sportItemNames"){
            this.ruleForm[fieldName]=[];
          }else{
            this.ruleForm[fieldName]="";
          }
          this.sign[inputName].value="";
          
          this.sign[inputName].show=true;
      },
      formatter(row, column, cellValue, index){
        let value=cellValue
        if(cellValue.indexOf(",")>=0){
          cellValue=cellValue.split(",");
          value=cellValue.join(";")
        }
        return value;
        
      },
      rowClick(row){
        console.log(row);
      }
    },
    components: {
      Paging
    }
  }
</script>

<style  rel="stylesheet/scss" lang="scss"  >
.selectList{
  .el-input {
    width: 120px;
  }
  .moreSelect{
    height: 28px;
    .el-input {
      width: 100%;
    }
    .el-select__tags{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
  
</style>
