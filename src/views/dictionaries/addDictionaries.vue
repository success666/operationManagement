<template>
  <div class="dictionaries_edit">
    <h3>{{titleName}}</h3>
    <label class="dis-label">基本信息</label>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="dic-form">
      <el-form-item label="字典名称" prop="description">
        <el-input
          v-model="ruleForm.description"
          class="dis-form-value"
          size="mini"
          :disabled="formType=='editList'"
        ></el-input>
      </el-form-item>
      <el-form-item label="字典类型" prop="type">
        <el-input
          v-model="ruleForm.type"
          class="dis-form-value"
          size="mini"
          :disabled="formType=='editList'"
        ></el-input>
      </el-form-item>
      <el-form-item label="字典键值" prop="value">
        <el-input
          v-model="ruleForm.value"
          class="dis-form-value"
          size="mini"
          :disabled="formType=='editListType'"
        ></el-input>
      </el-form-item>
      <el-form-item label="字典标签" prop="label">
        <el-input
          v-model="ruleForm.label"
          class="dis-form-value"
          size="mini"
          :disabled="formType=='editListType'"
        ></el-input>
      </el-form-item>
      <el-form-item label="字典排序" prop="sort">
        <el-input
          v-model="ruleForm.sort"
          class="dis-form-value"
          size="mini"
          :disabled="formType=='editListType'"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input
          v-model="ruleForm.remarks"
          type="textarea"
          class="dis-form-value1"
          size="mini"
          :disabled="formType=='editListType'"
        ></el-input>
      </el-form-item>
      <el-form-item label="字典状态" prop="delFlag">
        <el-select
          v-model="ruleForm.delFlag"
          placeholder="请选择"
          class="dis-form-value"
          size="mini"
          :disabled="formType=='editListType'"
        >
          <el-option
            v-for="item in delFlagData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-row class="dis-form-btn">
      <el-col :span="24">
        <el-button type="primary" size="medium" @click="saveData">保存</el-button>
        <el-button size="medium" @click="$router.go(-1)">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  data() {
    let checkSort = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("排序不能为空"));
      } else if (isNaN(value)) {
        return callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };
    let checkType=(rule, value, callback) => {
      if (!value) {
        return callback(new Error("字典类型不能为空"));
      } else{
        let isBoolean=this.typeData.every(type=>{
          return type!=value
        })
        if(isBoolean){
          callback();
        }else{
          return callback(new Error("已存在为"+value+"的字典类型"));
        }
        
      }
    };
    return {
      titleName: "新增字典类型",
      formType: "add",
      typeData: [],
      ruleForm: {
        description: "",
        type: "",
        value: "",
        label: "",
        remarks: "",
        sort: "",
        delFlag: ""
      },
      delFlagData: [{ value: 0, label: "正常" }, { value: 1, label: "停用" }],
      rules: {
        description: [
          { required: true, message: "请输入字典名称", trigger: "blur" }
        ],
        sort: [{ required: true, validator: checkSort, trigger: "blur" }],
        type: [{ required: true,validator: checkType, trigger: "blur" }],
        value: [{ required: true, message: "请输入字典键值", trigger: "blur" }],
        label: [{ required: true, message: "请输入字典标签", trigger: "blur" }],
        delFlag: [
          { required: true, message: "请选择字典状态", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    saveData() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let api = "";
          if (this.formType == "add") {
            api = "/api/auth/v1/dict";
          } else {
            if (this.$route.params.type == "editListType") {
              api = "/api/auth/v1/dict/updateDictType/" + this.$route.params.id;
            } else {
              api = "/api/auth/v1/dict/" + this.$route.params.id;
            }
          }
          let dictRequestBean = {};
          for (name in this.ruleForm) {
            dictRequestBean[name] = this.ruleForm[name];
          }
          let name = this.$route.params.formName;
          request.post(api, dictRequestBean).then(res => {
            let params = {
              type: "update"
            };
            if (this.$route.params.formName == "Dictionaries") {
              params.formType = this.ruleForm.type;
            }
            this.$router.push({
              name: name,
              params
            });
          });
        } else {
          return false;
        }
      });
    },
    getFormData() {
      request.get("/api/auth/v1/dict/" + this.$route.params.id).then(res => {
        for (name in this.ruleForm) {
          if (typeof res.data[name] != "undefined") {
            this.ruleForm[name] = res.data[name];
          }
        }
      });
    },
    getFieldType: getFieldType
  },
  mounted() {
    if (
      this.$route.params.type == "editListType" ||
      this.$route.params.type == "editList"
    ) {
      this.titleName = "编辑字典类型";
      this.formType = this.$route.params.type;
      this.getFormData();
    } else {
      this.getFieldType();
    }
  }
};

function getFieldType() {
  request.get("/api/auth/v1/dict/findTypeList", {}).then(res => {
    this.typeData = res.data;
  });
}
</script>
<style lang="scss" scoped>
h3 {
  margin: 0px;
  padding: 20px;
}
.dis-label {
  display: block;
  padding: 5px 30px;
}
.dic-form {
  padding: 10px;
  .el-form-item {
    margin-bottom: 15px;
  }
  .dis-form-value {
    width: 300px;
  }
  .dis-form-value1 {
    width: 500px;
  }
}
.dis-form-btn {
  text-align: center;
}
</style>


