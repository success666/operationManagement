<template>
  <div>
    <div class="container">
      <h4>批量导入设备</h4>
      <br>
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        label-width="100px"
        class="demo-form-inline"
        method="post"
        enctype="multipart/form-data"
      >
        <div class="upload-tip">
          <div class="tip">提示：</div>
          <div class="text">
            <div>第一步，下载批量导入设备基本信息模板，用下载的模板填写信息；</div>
            <div>第二步，选择产品名称和批次号；(注意顺序：选择产品名称 -> 选择批次号 -> 选取文件导入Excel)</div>
            <div>第三步，点击按钮浏览找到填写完毕的信息模板，上传完毕即可；</div>
          </div>
        </div>
        <el-form-item label="产品名称" class="item-dispIb">
          <el-select
            v-model="formInline.productId"
            @change="productNameChange(formInline.productId)"
            clearable
            @clear="clearProductId"
            placeholder="请选择产品"
            style="width: 200px;display: inline-block"
          >
            <el-option
              v-for="(item,index) in productNames"
              :label="item.name"
              :value="item.id"
              :key="index"
              :disabled="item.status === 0"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="批次号" class="item-dispIb">
          <el-select
            v-model="formInline.productBatchId"
            clearable
            placeholder="请选择批次号"
            style="width: 200px;display: inline-block"
          >
            <el-option
              v-for="(item,index) in productBatchIds"
              :label="item.sn"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备列表" class="item-dispB">
          <el-upload
            :action="formUrl"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :headers="header"
            name="files"
            :data="uploadParams"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :show-file-list="false"
            :disabled="formInline.productBatchId===''"
          >
            <el-button size="small" type="primary" @click="importData">导入Excel</el-button>
            <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
            <a :href="downloadUrl" class="item-download">下载模板</a>
            <!--<span>{{ response }}</span>-->
          </el-upload>
        </el-form-item>
        <br>
        <el-form-item class="item-sub">
          <el-button size="medium" class="demonstration" @click="handleExit('formInline')">取消</el-button>
          <!--<el-button type="submit" size="medium" class="demonstration" @click="handleSubmit('formInline')">保存</el-button>-->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<!--action="/api/auth/v1/deviceMgmt/device/batchUpload"-->
<script>
import request from "@/utils/request";

export default {
  created() {
    this.ossHost = process.env.BASE_API;
    if (typeof this.$route.params.deviceGroupId != "undefined") {
      this.formUrl =
        this.ossHost + "/api/auth/v1/deviceMgmt/deviceGroup/batchUpload";
    } else {
      this.formUrl =
        this.ossHost + "/api/auth/v1/deviceMgmt/device/batchUpload";
    }
  },
  data() {
    return {
      ossHost: "",
      formUrl:
        "http://s.op.dev.xiaotitong.com/api/auth/v1/deviceMgmt/device/batchUpload",
      fileList: [],
      productNames: [],
      productBatchIds: [],
      downloadUrl: "",
      formInline: {
        productBatchId: "", // 批次号ID
        productId: "", // 产品id
        files: ""
      },
      id: "",
      uploadParams: {},
      header: {},
      response: "",
      uploadFile: ""
    };
  },
  methods: {
    getProductBatchId() {
      // 请求批次号
      request
        .get("/api/auth/v1/deviceMgmt/product/batch", {
          params: {
            productId: this.formInline.productId
          }
        })
        .then(res => {
          this.productBatchIds = res.data;
          if (res.data.length === 0) {
            alert("该产品名称没有对应的批次号,请重新选择");
          }
        });
    },
    productNameChange(id) {
      if (id !== "") {
        this.getProductBatchId();
      }
    },
    clearProductId() {
      this.productBatchIds = [];
      this.formInline.productBatchId = "";
    },
    getProductName() {
      // 产品名称列表
      request.get("/api/auth/v1/deviceMgmt/product/list").then(res => {
        this.productNames = res.data;
      });
      if (typeof this.$route.params.deviceGroupId != "undefined") {
        request.get("/api/auth/v1/deviceMgmt/deviceGroup/downTemplate").then(res => {
          this.downloadUrl = res.data;
        });
      } else {
        request.get("/api/auth/v1/deviceMgmt/device/downTemplate").then(res => {
          this.downloadUrl = res.data;
        });
      }
    },
    handleExit(formName) {
      // this.$refs[formName].resetFields();
      setTimeout(() => {
        this.$router.go(-1);
      }, 1500);
    },
    beforeUpload(file) {
      // this.uploadParams.files = file.type;
      this.uploadFile = file.name;
      this.uploadParams.productId = this.formInline.productId;
      this.uploadParams.productBatchId = this.formInline.productBatchId;
      if (typeof this.$route.params.deviceGroupId != "undefined") {
        this.uploadParams.deviceGroupId = this.$route.params.deviceGroupId;
      }
      // this.formInline.files = file.type;
    },
    uploadSuccess(response, file, fileList) {
      this.response = response.status;
      console.log(response, file, fileList);
      if (response.status.code === 0) {
        this.$message({
          type: "success",
          message: "上传成功,即将跳转！"
        });
        setTimeout(this.handleExit(), 1000);
      } else {
        this.$message({
          type: "info",
          message: "上传失败,code:" + response.status.code + response.status.msg
        });
      }
    },
    uploadError(err, file, fileList) {
      this.$message({
        type: "info",
        message: "上传失败:" + err
      });
    },
    submitUpload() {
      this.$refs.upload.submit();
    }
    // handleChange(file, fileList) {
    //   this.formInline.files = file;
    //   this.fileList = fileList;
    // },
    // uploadFile: function(e) { // 点击导入按钮
    //   this.formInline.files = e.file;
    // }
  },
  mounted() {
    this.getProductName();
    // this.imFile = document.getElementById('imFile');
    const token = window.localStorage.getItem("access_token");
    this.header.authorization = token;
  }
};
</script>

<style scoped>
.container {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 5px 0 5px 15px;
  margin-top: 15px;
  font-size: 15px;
}
.demonstration {
  margin: 5px 30px 5px 0;
  display: inline-block;
}
.item-dispIb {
  display: inline-block;
  margin: 10px 50px 10px 5px;
}
.item-dispB {
  display: block;
  margin: 10px 5px;
}
.item-sub {
  text-align: center;
  width: 620px;
  margin: 50px 5px 50px 5px;
}
.item-download {
  display: inline-block;
  color: deepskyblue;
  text-decoration: underline;
  margin-left: 30px;
}
.upload-tip {
  margin-bottom: 20px;
}
.upload-tip .tip {
  display: inline-block;
  width: 50px;
  vertical-align: top;
}
.upload-tip .text {
  display: inline-block;
  vertical-align: top;
}
.upload-tip div {
  margin-bottom: 5px;
}
</style>
