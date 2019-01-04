<template>
  <div
    class="appAdvertiseDetail"
    :style="{minHeight:minHeight}"
    v-loading="loading"
    element-loading-text="拼命加载中"
  >
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      class="ke-ruleForm"
    >
      <el-form-item label="标题" prop="title">
        <el-input size="small" v-model="ruleForm.title" v-if="$route.params.type!='detail'"></el-input>
        <span v-else>{{ruleForm.title}}</span>
      </el-form-item>
      <el-form-item label="公告图" prop="logoUrl">
        <Upload
          v-if="$route.params.type!='detail'"
          :verifyUrl="'/api/auth/v1/oss/policy?dir=guidancePoint'"
          :tip="'请上传750x154的图片'"
          :buttonText="'上传图片'"
          :accept="'image/*'"
          :VerifyFile="VerifyCoverUrl"
          :fileList="ruleForm.coverUrl"
          @coverUrl="onCoverUrl"
        ></Upload>
        <img v-else :src="ruleForm.logoUrl" class="imgStyle">
      </el-form-item>
      <el-form-item label="能否跳转" prop="skipState">
        <div v-if="$route.params.type!='detail'">
          <el-radio v-model="ruleForm.skipState" :label="0">是</el-radio>
          <el-input v-model="ruleForm.linkUrl"></el-input>
          <el-radio v-model="ruleForm.skipState" :label="1">否</el-radio>
        </div>
        <div v-else>
          <span class="skipState_value">{{ruleForm.skipState | skipStateData}}</span>
          <span class="skipState_url">{{ruleForm.linkUrl}}</span>
        </div>
      </el-form-item>
    </el-form>
    <el-row class="appAdvertiseDetail_btn">
      <el-col :span="24">
        <el-button type="primary" @click="goback">返回</el-button>
        <el-button type="primary" v-if="$route.params.type!='detail'" @click="saveFormData">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import request from "@/utils/request";
import Upload from "@/components/common/upload";
export default {
  components: {
    Upload
  },
  data() {
    const validateCoverUrl = (rule, value, callback) => {
      this.ruleForm.logoUrl
        ? callback()
        : callback(new Error("请上传公告图片"));
    };
    const validatorSkipState = (rule, value, callback) => {
      if (!value) {
        if (value.toString() == "0" && this.ruleForm.linkUrl == "") {
          callback(new Error("请填写URL"));
        } else if (value.toString() == "0" && this.ruleForm.linkUrl != "") {
          callback();
        } else {
          callback(new Error("请选择是否能跳转"));
        }
      } else {
        callback();
      }
    };
    return {
      minHeight: "500px",
      loading: false,
      ruleForm: {
        title: "", //公告标题
        skipState: "", //跳转状态，0：跳转，1：不跳转
        state: 1, //上架状态，0：已上架，1：未上架
        coverUrl: [],
        logoUrl: "", //公告图片
        linkUrl: ""
      },
      rules: {
        title: { required: true, message: "请输入标题名称", trigger: "blur" },
        logoUrl: [{ required: true, validator: validateCoverUrl }],
        skipState: [{ required: true, validator: validatorSkipState }]
      }
    };
  },
  filters: {
    skipStateData(val) {
      if (val == 0) {
        return "是";
      } else {
        return "否";
      }
    }
  },
  methods: {
    VerifyCoverUrl(file) {
      const imgFile = file;
      const _URL = window.URL || window.webkitURL;
      const _self = this;
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    },
    onCoverUrl(data) {
      this.ruleForm.logoUrl = data;
    },
    goback() {
      this.$router.push("/notice");
    },
    getFormData: getFormData,
    saveFormData: saveFormData
  },
  mounted() {
    this.minHeight = document.documentElement.clientHeight - 100 + "px";
    if (this.$route.params.type != "add") {
      this.getFormData(this.$route.params.id);
    }
  }
};
function getFormData(id) {
  request.get("/api/auth/v1/notice/" + id).then(res => {
    let data = res.data;
    for (name in this.ruleForm) {
      if (typeof data[name] != "undefined") {
        this.ruleForm[name] = data[name];
      }
    }
    this.ruleForm.coverUrl.push({ url: this.ruleForm.logoUrl });
  });
}
function saveFormData() {
  let data = {};
  data.title = this.ruleForm.title;
  data.skipState = this.ruleForm.skipState;
  data.state = this.ruleForm.state;
  data.logoUrl = this.ruleForm.logoUrl;
  data.linkUrl = this.ruleForm.linkUrl;
  let api = "/api/auth/v1/notice";
  if (this.$route.params.type == "edit") {
    data.id = this.$route.params.id;
    api = "/api/auth/v1/notice/" + this.$route.params.id;
  }
  request.post(api, data).then(res => {
    this.$message({
      message: "保存成功，3秒后返回列表页",
      type: "success"
    });
    setTimeout(()=>{
        this.$router.push({
            name:"AppAdvertiseList",
            params:{
                type:"update"
            }
        })
    }, 3000)
  });
}
</script>
<style lang="scss" scoped>
.appAdvertiseDetail {
  background: #fff;
  padding: 15px;
  border-radius: 7px;
  margin-bottom: 10px;
  .imgStyle {
    max-width: 200px;
  }
  .skipState_value {
    padding-right: 5px;
    vertical-align: middle;
  }
  .skipState_url {
    vertical-align: middle;
  }
  .appAdvertiseDetail_btn {
    text-align: center;
  }
}
</style>


