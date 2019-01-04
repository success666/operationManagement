<template>
  <div>
    <div class="container">
      <h4>新增知识</h4><br>
      <el-form ref="form" :rules="formRules" :model="form" label-width="80px" class="demo-ruleForm">
        <el-form-item label="类别" prop="categoryId">
          <el-select v-model="form.categoryId" clearable placeholder="请选择">
            <el-option v-for="(item, index) in categorys" :label="item.name" :value="item.id" :key="index"></el-option>

            <!-- <el-option label="考试" value="1"></el-option>
                  <el-option label="营养" value="2"></el-option>
                  <el-option label="安全教育" value="3"></el-option>
                  <el-option label="视力保健" value="4"></el-option>
                  <el-option label="运动" value="5"></el-option> -->
          </el-select>
        </el-form-item>

        <el-form-item label="运动项目">
          <el-select prop="sportItem" v-model="form.sportItemId" clearable placeholder="请选择" @change="getSportItem2(form.sportItemId)">
            <el-option v-for="(item, index) in sportitems" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
          <el-select v-model="form.sportItemId2" v-if="showsportitems2" clearable placeholder="请选择" @change="getSportItem3(form.sportItemId2)">
            <el-option v-for="(item, index) in sportitems2" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
          <el-select v-model="form.sportItemId3" v-if="showsportitems3" clearable placeholder="请选择">
            <el-option v-for="(item, index) in sportitems3" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="营养">
          <el-select v-model="form.nutritionId" clearable placeholder="请选择" @change="getNutrition2(form.nutritionId)">
            <el-option v-for="(item, index) in nutritions" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
          <el-select v-model="form.nutritionId2" v-if="shownutritions2" clearable placeholder="请选择" @change="getNutrition3(form.nutritionId2)">
            <el-option v-for="(item, index) in nutritions2" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
          <el-select v-model="form.nutritionId3" v-if="shownutritions3" clearable placeholder="请选择">
            <el-option v-for="(item, index) in nutritions3" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="安全教育">
          <el-select v-model="form.safetyEducationId" clearable placeholder="请选择" @change="getSafety2(form.safetyEducationId)">
            <el-option v-for="(item, index) in safetys" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
          <el-select v-model="form.safetyEducationId2" v-if="showsafetys2" clearable placeholder="请选择" @change="getSafety3(form.safetyEducationId2)">
            <el-option v-for="(item, index) in safetys2" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
          <el-select v-model="form.safetyEducationId3" v-if="showsafetys3" clearable placeholder="请选择">
            <el-option v-for="(item, index) in safetys3" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="视力保健">
          <el-select v-model="form.funId" clearable placeholder="请选择" @change="getFun2(form.funId)">
            <el-option v-for="(item, index) in funs" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
          <el-select v-model="form.funId2" v-if="showfuns2" clearable placeholder="请选择" @change="getFun3(form.funId2)">
            <el-option v-for="(item, index) in funs2" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
          <el-select v-model="form.funId3" v-if="showfuns3" clearable placeholder="请选择">
            <el-option v-for="(item, index) in funs3" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请填写标题"></el-input>
        </el-form-item>

        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请填写作者"></el-input>
        </el-form-item>

        <el-form-item label="标签">
          <div class="tag-border">
            <el-tag :key="tag" v-for="tag in form.label" closable :disable-transitions="false" @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input class="input-new-tag" v-if="form.inputVisible" v-model="form.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加新标签</el-button>
            <div slot="tip" class="el-upload__tip dispIb color_red">（输入文字后，按enter键或鼠标点击输入框外形成标签）</div>
          </div>

        </el-form-item>

        <!-- 上传图片 -->
        <!--<el-form-item label="封面图" prop="coverUrl">-->
        <el-form-item label="封面图">
          <Upload :verifyUrl="'/api/auth/v1/oss/policy?dir=guidancePoint'" :tip="'建议上传320×240的图片，大小不超过500kb'" :buttonText="'上传图片'" :accept="'image/*'" :VerifyFile="VerifyCoverUrl" :fileList="form.fileList" @coverUrl="onCoverUrl"></Upload>
        </el-form-item>

        <el-form-item label="简介" prop="introduction">
          <el-input type="textarea" v-model="form.introduction" placeholder="请输入简介"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="contentType">
          <el-select v-model="form.contentType">
            <el-option label="视频" value="1"></el-option>
            <el-option label="文章" value="2"></el-option>
          </el-select>
        </el-form-item>

        <div class="content_detail">
          <p v-show="form.contentType == 1">
            <el-form-item label="视频">
              <UploadVideo :verifyUrl="'/api/auth/v1/oss/policy?dir=guidancePoint'" :tip="'请上传大小不超过100M，mp4格式的视频'" :buttonText="'上传视频'" :accept="'video/mp4'" :VerifyFile="VerifyVideo" :dataSrc="form.videoUrl" @uploadUrl="onVideoUrl"></UploadVideo>
            </el-form-item>
          </p>
          <el-form-item label="正文" v-if="form.contentType == 1"></el-form-item>
          <el-form-item label="文章" v-else></el-form-item>
          <Ueditor :content=ueContent :config=config1 :id="ue1" ref="ue1"></Ueditor>
        </div>
        <el-form-item class="textCenter">
          <el-button @click="handleExit()">取消</el-button>
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Ueditor from "@/components/ueditor/ueditor";
import request from "@/utils/request";
import Upload from "@/components/common/upload";
import UploadVideo from "@/components/common/uploadVideo";

export default {
  data() {
    const validateCoverUrl = (rule, value, callback) => {
      this.form.coverUrl ? callback() : callback(new Error("请输入缩略图"));
    };
    // const validateVideoUrl = (rule, value, callback) => {
    //   this.form.videoUrl ? callback() : callback(new Error('请输入视频'))
    // };
    return {
      id: "1",
      categorys: [],
      sportitems: [],
      sportitems2: [],
      sportitems3: [],
      nutritions: [],
      nutritions2: [],
      nutritions3: [],
      safetys: [],
      safetys2: [],
      safetys3: [],
      funs: [],
      funs2: [],
      funs3: [],
      showsportitems2: false,
      showsportitems3: false,
      shownutritions2: false,
      shownutritions3: false,
      showsafetys2: false,
      showsafetys3: false,
      showfuns2: false,
      showfuns3: false,
      sportItemCategoryIds: [],
      nutritionIds: [],
      safetyEducationIds: [],
      funIds: [],
      form: {
        id: "1",
        categoryId: "",
        sportItemId: "",
        sportItemId2: "",
        sportItemId3: "",
        nutritionId: "",
        nutritionId2: "",
        nutritionId3: "",
        safetyEducationId: "",
        safetyEducationId2: "",
        safetyEducationId3: "",
        funId: "",
        funId2: "",
        funId3: "",
        title: "",
        author: "",
        label: [],
        inputVisible: false,
        inputValue: "",
        coverUrl: "",
        introduction: "",
        // content1: '请在此处输入内容123',
        videoLength: "",
        videoUrl: "",
        contentType: "",
        fileList: [],
        fileVideoList: []
      },
      formRules: {
        categoryId: [
          // 类别select 验证
          { required: true, message: "请选择类别", trigger: "change" }
        ],
        contentType: [
          // 内容select 验证
          { required: true, message: "请选择内容", trigger: "change" }
        ],
        title: [
          // 标题输入框验证
          { required: true, message: "请填写标题", trigger: "blur" },
          { min: 3, max: 25, message: "长度在 3 到 25 个字符", trigger: "blur" }
        ],
        author: [
          // 作者输入框验证
          { required: true, message: "请输入作者名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        coverUrl: [
          // 封面图输入框验证
          { required: true, message: "请上传封面图片", trigger: "blur" },
          { required: true, validator: validateCoverUrl }
        ],
        // videoUrl: [
        //   { required: true, validator: validateVideoUrl }
        // ],
        introduction: [
          // 简介文本框验证
          { required: true, message: "请填写简介", trigger: "blur" }
        ]
      },
      ueContent: "请在此处输入内容",
      config1: {
        // initialFrameWidth: 1200, // 固定宽高时使用  也可以设置成null
        initialFrameHeight: 200,
        autoHeight: false,
        wordCount: false
      },
      ue1: "ue1" // 不同编辑器必须不同的id
    };
  },
  mounted() {
    this.getCategory();
    this.getSportItem();
    this.getNutrition();
    this.getSafety();
    this.getFun();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        this.sportItemCategoryIds[0] = this.form.sportItemId;
        if (this.form.sportItemId2 !== "") {
          this.sportItemCategoryIds[1] = this.form.sportItemId2;
          if (this.form.sportItemId3 !== "") {
            this.sportItemCategoryIds[2] = this.form.sportItemId3;
          }
        }
        this.nutritionIds[0] = this.form.nutritionId;
        if (this.form.nutritionId2 !== "") {
          this.nutritionIds[1] = this.form.nutritionId2;
          if (this.form.nutritionId3 !== "") {
            this.nutritionIds[2] = this.form.nutritionId3;
          }
        }
        this.safetyEducationIds[0] = this.form.safetyEducationId;
        if (this.form.safetyEducationId2 !== "") {
          this.safetyEducationIds[1] = this.form.safetyEducationId2;
          if (this.form.safetyEducationId3 !== "") {
            this.safetyEducationIds[2] = this.form.safetyEducationId3;
          }
        }
        this.funIds[0] = this.form.funId;
        if (this.form.funId2 !== "") {
          this.funIds[1] = this.form.funId2;
          if (this.form.funId3 !== "") {
            this.funIds[2] = this.form.funId3;
          }
        }
        if (valid) {
          this.getUEContent();
          request
            .post("/api/auth/v1/knowledge", {
              sportItemCategoryIds: this.sportItemCategoryIds,
              nutritionIds: this.nutritionIds,
              safetyEducationIds: this.safetyEducationIds,
              funIds: this.funIds,
              categoryId: this.form.categoryId,
              title: this.form.title,
              author: this.form.author,
              label: this.form.label,
              coverUrl: this.form.coverUrl,
              introduction: this.form.introduction,
              videoUrl: this.form.videoUrl,
              videoLength: this.form.videoLength,
              contentType: this.form.contentType,
              content: this.ueContent
            })
            .then(res => {
              this.$message({
                type: "success",
                message: "提交成功!"
              });
              this.$router.go(-1);
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    onCoverUrl(data) {
      // console.log(data);
      this.form.coverUrl = data;
    },
    VerifyCoverUrl(file) {
      const imgFile = file;
      const _URL = window.URL || window.webkitURL;
      const _self = this;
      return new Promise((resolve, reject) => {
        const img = new Image();
        console.log(imgFile);
        img.src = _URL.createObjectURL(imgFile);
        img.onload = function() {
          if (imgFile.size / 1024 < 500) {
            resolve(true);
          } else {
            _self.$message({
              type: "error",
              message: "建议上传320×240的图片，大小不超过500kb!"
            });
            reject(false);
          }
        };
      });
    },
    VerifyVideo(file) {
      const isLimit = file.size / 1024 / 1024 < 100;
      return new Promise((resolve, reject) => {
        if (!isLimit) {
          this.$message({
            type: "error",
            message: "请上传大小不超过100M，mp4格式的视频!"
          });
          reject(false);
        } else {
          resolve(true);
        }
      });
    },
    onVideoUrl(data) {
      console.log(data);
      this.form.videoUrl = data;
    },
    handleExit() {
      this.$router.go(-1);
    },
    getUEContent() {
      // 获取ueditor值
      let contentDetail = this.$refs.ue1.getContent();
      this.ueContent = contentDetail;
    },
    // 删除标签
    handleClose(tag) {
      this.form.label.splice(this.form.label.indexOf(tag), 1);
    },
    showInput() {
      this.form.inputVisible = true;
      this.form.inputValue = "";
      this.$nextTick(_ => {
        // this.$refs.saveTagInput.focus();
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.form.inputValue;
      if (inputValue) {
        this.form.label.push(inputValue);
      }
      this.form.inputVisible = false;
      this.form.inputValue = "";
    },
    // 获取类别
    getCategory() {
      request.get("/api/auth/v1/knowledge/category").then(res => {
        // console.log(res.data);
        this.categorys = res.data;
      });
    },
    // 通过 分类id/父类id   查询运动项目/分类
    getSportItem() {
      request
        .get("/api/auth/v1/sportItemCategory", {
          params: {
            parentId: "0"
          }
        })
        .then(res => {
          this.sportitems = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 通过 分类id/父类id   查询运动项目/分类
    getSportItem2(id) {
      if (id !== "") {
        this.sportitems2 = [];
        this.form.sportItemId2 = "";
        request
          .get("/api/auth/v1/sportItemCategory", {
            params: {
              parentId: id
            }
          })
          .then(res => {
            this.sportitems2 = res.data;
            res.data.length === 0
              ? (this.showsportitems2 = false)
              : (this.showsportitems2 = true);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.showsportitems2 = false;
        this.form.sportItemId2 = "";
      }
    },
    getSportItem3(id) {
      if (id !== "") {
        this.sportitems3 = [];
        this.form.sportItemId3 = "";
        request
          .get("/api/auth/v1/sportItemCategory", {
            params: {
              parentId: id
            }
          })
          .then(res => {
            this.sportitems3 = res.data;
            res.data.length === 0
              ? (this.showsportitems3 = false)
              : (this.showsportitems3 = true);
          });
      } else {
        this.showsportitems3 = false;
        this.form.sportItemId3 = "";
      }
    },
    // 营养分类列表
    getNutrition() {
      request
        .get("/api/auth/v1/nutritionCategory", {
          params: {
            parentId: "0"
          }
        })
        .then(res => {
          this.nutritions = res.data;
        });
    },
    // 营养分类列表
    getNutrition2(id) {
      if (id !== "") {
        this.nutritions2 = [];
        this.form.nutritionId2 = "";
        request
          .get("/api/auth/v1/nutritionCategory", {
            params: {
              parentId: id
            }
          })
          .then(res => {
            this.nutritions2 = res.data;
            res.data.length === 0
              ? (this.shownutritions2 = false)
              : (this.shownutritions2 = true);
          });
      } else {
        this.shownutritions2 = false;
        this.form.nutritionId2 = "";
      }
    },
    getNutrition3(id) {
      if (id !== "") {
        this.nutritions3 = [];
        this.form.nutritionId3 = "";
        request
          .get("/api/auth/v1/nutritionCategory", {
            params: {
              parentId: id
            }
          })
          .then(res => {
            this.nutritions3 = res.data;
            res.data.length === 0
              ? (this.shownutritions3 = false)
              : (this.shownutritions3 = true);
          });
      } else {
        this.shownutritions3 = false;
        this.form.nutritionId3 = "";
      }
    },
    // 安全教育分类
    getSafety() {
      request
        .get("/api/auth/v1/safetyEducationCategory", {
          params: {
            parentId: "0"
          }
        })
        .then(res => {
          this.safetys = res.data;
        });
    },
    // 安全教育分类2
    getSafety2(id) {
      if (id !== "") {
        this.safetys2 = [];
        request
          .get("/api/auth/v1/safetyEducationCategory", {
            params: {
              parentId: id
            }
          })
          .then(res => {
            this.safetys2 = res.data;
            res.data.length === 0
              ? (this.showsafetys2 = false)
              : (this.showsafetys2 = true);
          });
      } else {
        this.showsafetys2 = false;
        this.form.safetyEducationId2 = "";
      }
    },
    getSafety3(id) {
      if (id !== "") {
        this.safetys3 = [];
        request
          .get("/api/auth/v1/safetyEducationCategory", {
            params: {
              parentId: id
            }
          })
          .then(res => {
            this.safetys3 = res.data;
            res.data.length === 0
              ? (this.showsafetys3 = false)
              : (this.showsafetys3 = true);
          });
      } else {
        this.showsafetys3 = false;
        this.form.safetyEducationId3 = "";
      }
    },
    // 乐趣分类列表
    getFun() {
      request
        .get("/api/auth/v1/funCategory", {
          params: {
            parentId: "0"
          }
        })
        .then(res => {
          this.funs = res.data;
        });
    },
    // 乐趣分类列表
    getFun2(id) {
      if (id !== "") {
        this.funs2 = [];
        request
          .get("/api/auth/v1/funCategory", {
            params: {
              parentId: id
            }
          })
          .then(res => {
            this.funs2 = res.data;
            res.data.length === 0
              ? (this.showfuns2 = false)
              : (this.showfuns2 = true);
          });
      } else {
        this.showfuns2 = false;
        this.form.funId2 = "";
      }
    },
    getFun3(id) {
      if (id !== "") {
        this.funs3 = [];
        request
          .get("/api/auth/v1/funCategory", {
            params: {
              parentId: id
            }
          })
          .then(res => {
            this.funs3 = res.data;
            res.data.length === 0
              ? (this.showfuns3 = false)
              : (this.showfuns3 = true);
          });
      } else {
        this.showfuns3 = false;
        this.form.funId3 = "";
      }
    }
  },
  components: {
    Ueditor,
    Upload,
    UploadVideo
  }
};
</script>

<style scoped>
.container {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 10px;
  margin-top: 15px;
  font-size: 15px;
}
.content_detail {
  width: 96%;
  margin: 0 5px 20px 40px;
  padding: 15px 20px;
  min-height: 200px;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
}
.item-inline {
  display: inline-block;
  margin: 5px 0;
}
.item-shichang {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;
  margin-left: 10px;
}
.dispIb {
  display: inline-block;
}
.textCenter {
  text-align: center;
  margin-bottom: 20px;
}
.color_red {
  color: #ff0000;
}
.tag-border {
  border: 1px solid #eeeeee;
  border-radius: 5px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
