<template>
    <div>
        <div class="container">
            <h4>编辑知识</h4>
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="类别">
              <el-select v-model="form.categoryId" clearable placeholder="请选择">
                <el-option v-for="item in categorys" :label="item.name" :value="item.id" :key="index"></el-option>

                <!-- <el-option label="考试" value="1"></el-option>
                <el-option label="营养" value="2"></el-option>
                <el-option label="安全教育" value="3"></el-option>
                <el-option label="视力保健" value="4"></el-option>
                <el-option label="运动" value="5"></el-option> -->
              </el-select>
            </el-form-item>

            <el-form-item label="运动项目">
              <el-select v-model="form.sportItemId" clearable placeholder="请选择" @change="getSportItem2(form.sportItemId)">
                <el-option v-for="(item, index) in sportitems" :label="item.name" :value="item.id" :key="index"></el-option>
              </el-select>
              <el-select v-model="form.sportItemId2" v-if="showsportitems2" clearable placeholder="请选择" @change="getSportItem3(form.sportItemId2)">
                <el-option v-for="(item, index) in sportitems2" :label="item.name" :value="item.id" :key="index"></el-option>
              </el-select>
              <el-select v-model="form.sportItemId3" v-if="showsportitems3" placeholder="请选择" clearable>
                <el-option v-for="(item, index) in sportitems3" :label="item.name" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="营养">
              <el-select v-model="form.nutritionId" placeholder="请选择" clearable @change="getNutrition2(form.nutritionId)">
                <el-option v-for="(item, index) in nutritions" :label="item.name" :value="item.id" :key="index"></el-option>
              </el-select>
              <el-select v-model="form.nutritionId2" v-if="shownutritions2" placeholder="请选择" clearable @change="getNutrition3(form.nutritionId2)">
                <el-option v-for="(item, index) in nutritions2" :label="item.name" :value="item.id" :key="index"></el-option>
              </el-select>
              <el-select v-model="form.nutritionId3" v-if="shownutritions3" placeholder="请选择" clearable>
                <el-option v-for="(item, index) in nutritions3" :label="item.name" :value="item.id" :key="index"></el-option>
              </el-select>

            </el-form-item>

            <el-form-item label="安全教育">
              <el-select v-model="form.safetyEducationId" placeholder="请选择" clearable @change="getSafety2(form.safetyEducationId)">
                <el-option v-for="(item, index) in safetys" :label="item.name" :value="item.id" :key="index"></el-option>
              </el-select>
              <el-select v-model="form.safetyEducationId2" v-if="showsafetys2" placeholder="请选择" clearable @change="getSafety3(form.safetyEducationId2)">
                <el-option v-for="(item, index) in safetys2" :label="item.name" :value="item.id" :key="index"></el-option>
              </el-select>
              <el-select v-model="form.safetyEducationId3" v-if="showsafetys3" placeholder="请选择" clearable>
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

            <el-form-item label="标题">
              <el-input v-model="form.title"></el-input>
            </el-form-item>

            <el-form-item label="作者">
              <el-input v-model="form.author"></el-input>
            </el-form-item>

            <el-form-item label="标签">
              <el-tag
                :key="tag"
                v-for="tag in form.label"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </el-form-item>
            <el-form-item label="封面图">
              <Upload v-model="form.coverUrl"
                :verifyUrl="'/api/auth/v1/oss/policy?dir=guidancePoint'"
                :tip="'建议上传254×150的图片，大小不超过500kb!'"
                :buttonText="'上传图片'"
                :accept="'image/*'"
                :VerifyFile="VerifyCoverUrl"
                :fileList="form.fileList"
                @coverUrl="onCoverUrl"
              ></Upload>
            </el-form-item>

            <el-form-item label="简介">
              <el-input type="textarea" v-model="form.introduction"></el-input>
            </el-form-item>

            <el-form-item label="内容">
              <el-select v-model="form.contentType">
                <el-option label="视频" value="1"></el-option>
                <el-option label="文章" value="2"></el-option>
              </el-select>
            </el-form-item>

            <div class="content_detail">
              <div v-if="form.contentType==1">
                <el-form-item label="视频">
                  <el-button type="primary" class="item-inline" @click="deleteVideo">删除</el-button>
                  <UploadVideo
                    :verifyUrl="'/api/auth/v1/oss/policy?dir=guidancePoint'"
                    :tip="'请上传大小不超过100M，mp4格式的视频'"
                    :buttonText="'上传视频'"
                    :accept="'video/mp4'"
                    :VerifyFile="VerifyVideo"
                    :dataSrc="form.videoUrl"
                    @uploadUrl="onVideoUrl"
                  ></UploadVideo>
                  <!--<span class="item-inline item-shichang">时长 &nbsp; {{form.videoLength}}</span>-->
                </el-form-item>
              </div>
              <el-form-item label="正文"></el-form-item>
              <Ueditor :content=form.content :config=config3 :id="ue3" ref="ue3"></Ueditor>
            </div>

            <el-form-item class="textCenter">
              <el-button @click="handleExit">取消</el-button>
              <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
    </div>
</template>

<script>
  import Ueditor from '@/components/ueditor/ueditor'
  import request from '@/utils/request'
  import Upload from '@/components/common/upload'
  import UploadVideo from '@/components/common/uploadVideo'
  export default {
    data() {
      return {
        inputVisible: false,
        inputValue: '',
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
          id: '',
          categoryId: '',
          sportItemId: '',
          sportItemId2: '',
          sportItemId3: '',
          nutritionId: '',
          nutritionId2: '',
          nutritionId3: '',
          safetyEducationId: '',
          safetyEducationId2: '',
          safetyEducationId3: '',
          funId: 1,
          funId2: '',
          funId3: '',
          title: '',
          author: '',
          label: [],
          inputVisible: false,
          inputValue: '',
          coverUrl: '',
          introduction: '',
          content: '',
          videoLength: '',
          videoUrl: '',
          contentType: '',
          fileList: [],
          fileVideoList: []
        },
        config3: {
          initialFrameHeight: 350,
          autoHeight: false,
          wordCount: false
        },
        ueContent: '',
        ue3: 'ue3' // 不同编辑器必须不同的id
      }
    },
    methods: {
      onSubmit() {
        const userId = this.$route.query.userId;
        this.getUEContent3();
        this.sportItemCategoryIds[0] = this.form.sportItemId;
        if (this.form.sportItemId2 !== '') {
          this.sportItemCategoryIds[1] = this.form.sportItemId2;
          if (this.form.sportItemId3 !== '') {
            this.sportItemCategoryIds[2] = this.form.sportItemId3;
          }
        }
        this.nutritionIds[0] = this.form.nutritionId;
        if (this.form.nutritionId2 !== '') {
          this.nutritionIds[1] = this.form.nutritionId2;
          if (this.form.nutritionId3 !== '') {
            this.nutritionIds[2] = this.form.nutritionId3;
          }
        }
        this.safetyEducationIds[0] = this.form.safetyEducationId;
        if (this.form.safetyEducationId2 !== '') {
          this.safetyEducationIds[1] = this.form.safetyEducationId2;
          if (this.form.safetyEducationId3 !== '') {
            this.safetyEducationIds[2] = this.form.safetyEducationId3;
          }
        }
        this.funIds[0] = this.form.funId;
        if (this.form.funId2 !== '') {
          this.funIds[1] = this.form.funId2;
          if (this.form.funId3 !== '') {
            this.funIds[2] = this.form.funId3;
          }
        }
        request.post('/api/auth/v1/knowledge/' + userId, {
          id: userId,
          categoryId: this.form.categoryId,
          sportItemCategoryIds: this.sportItemCategoryIds,
          nutritionIds: this.nutritionIds,
          safetyEducationIds: this.safetyEducationIds,
          funIds: this.funIds,
          title: this.form.title,
          author: this.form.author,
          label: this.form.label,
          coverUrl: this.form.coverUrl,
          introduction: this.form.introduction,
          videoUrl: this.form.videoUrl,
          videoLength: this.form.videoLength,
          contentType: this.form.contentType,
          content: this.form.content
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
          this.$router.push({
            path: 'knowledgedetails',
            query: { userId: userId }
          })
        }).catch((err) => {
          this.$message({
            type: 'warning',
            message: '修改失败!'
          });
        })
      },
      init() {
        const userId = this.$route.query.userId;
        request.get('/api/auth/v1/knowledge/' + userId).then((res) => {
          // this.form = res.data;
          for (let name in res.data) {
            if (typeof this.form[name] !== 'undefined') {
              this.form[name] = res.data[name]
            }
          }
          this.form.categoryId = res.data.categoryId;
          this.form.contentType = res.data.contentType + '';

          if (res.data.sportItemCategorys.length > 0) {
            this.form.sportItemId = res.data.sportItemCategorys[0].id;
            if (res.data.sportItemCategorys.length > 1) {
              this.getSportItem2(this.form.sportItemId);
              this.showsportitems2 = true;
              this.form.sportItemId2 = res.data.sportItemCategorys[1].id;
              if (res.data.sportItemCategorys.length > 2) {
                this.getSportItem3(this.form.sportItemId2);
                this.showsportitems2 = true;
                this.form.sportItemId3 = res.data.sportItemCategorys[2].id;
              }
            }
          }

          if (res.data.nutritions.length > 0) {
            this.form.nutritionId = res.data.nutritions[0].id;
            if (res.data.nutritions.length > 1) {
              this.getNutrition2(this.form.nutritionId);
              this.shownutritions2 = true;
              this.form.nutritionId2 = res.data.nutritions[1].id;
              if (res.data.nutritions.length > 2) {
                this.getNutrition3(this.form.nutritionId2);
                this.shownutritions3 = true;
                this.form.nutritionId3 = res.data.nutritions[2].id;
              }
            }
          }

          if (res.data.safetyEducations.length > 0) {
            this.form.safetyEducationId = res.data.safetyEducations[0].id;
            if (res.data.safetyEducations.length > 1) {
              this.getSafety2(this.form.safetyEducationId);
              this.showsafetys2 = true;
              this.form.safetyEducationId2 = res.data.safetyEducations[1].id;
              if (res.data.safetyEducations.length > 2) {
                this.getSafety3(this.form.safetyEducationId2);
                this.showsafetys3 = true;
                this.form.safetyEducationId3 = res.data.safetyEducations[2].id;
              }
            }
          }

          if (res.data.funs.length > 0) {
            this.form.funId = res.data.funs[0].id;
            if (res.data.funs.length > 1) {
              this.getFun2(this.form.funId);
              this.showfuns2 = true;
              this.form.funId2 = res.data.funs[1].id;
              if (res.data.funs.length > 2) {
                this.getFun3(this.form.funId2);
                this.showfuns3 = true;
                this.form.funId3 = res.data.funs[2].id
              }
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      VerifyVideo(file) {
        const isLimit = file.size / 1024 / 1024 < 100;
        return new Promise((resolve, reject) => {
          if (!isLimit) {
            this.$message({
              type: 'error',
              message: '请上传大小不超过100M，mp4格式的视频!'
            })
            reject(false)
          } else {
            resolve(true)
          }
        })
      },
      VerifyCoverUrl(file) {
        const imgFile = file;
        const _URL = window.URL || window.webkitURL;
        const _self = this;
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = _URL.createObjectURL(imgFile);
          img.onload = function() {
            if (imgFile.size / 1024 < 500) {
              resolve(true)
            } else {
              _self.$message({
                type: 'error',
                message: '建议上传254×150的图片，大小不超过500kb!'
              })
              reject(false)
            }
          }
        })
      },
      onVideoUrl(data) {
        this.form.videoUrl = data;
      },
      onCoverUrl(data) {
        this.form.coverUrl = data;
      },
      getUEContent3() {
        // 获取ueditor值
        let content = this.$refs.ue3.getContent();
        this.form.content = content;
      },
      // 跳转回上一页
      handleExit() {
        this.$router.go(-1)
      },
      // 删除视频
      deleteVideo() {
        this.$message({
          type: 'error',
          message: '暂时没有删除视频的接口和功能'
        })
      },
      // 删除标签
      handleClose(tag) {
        this.form.label.splice(this.form.label.indexOf(tag), 1);
      },
      // 显示编辑标签的输入框
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      // 新增标签
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.form.label.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      // 获取类别
      getCategory() {
        request.get('/api/auth/v1/knowledge/category').then((res) => {
          // console.log(res.data);
          this.categorys = res.data;
        })
      },
      // 通过 分类id/父类id   查询运动项目/分类
      getSportItem() {
        request.get('/api/auth/v1/sportItemCategory', {
          params: {
            parentId: '0'
          }
        }).then((res) => {
          this.sportitems = res.data;
        }).catch((err) => {
          console.log(err);
        })
      },
      // 通过 分类id/父类id   查询运动项目/分类2
      getSportItem2(id) {
        if (id !== '') {
          this.sportitems2 = [];
          this.form.sportItemId2 = '';
          request.get('/api/auth/v1/sportItemCategory', {
            params: {
              parentId: id
            }
          }).then((res) => {
            res.data.length === 0 ? this.showsportitems2 = false : (this.showsportitems2 = true, this.sportitems2 = res.data)
          }).catch((err) => {
            console.log(err)
          })
        } else {
          this.showsportitems3 = false;
          this.form.sportItemId2 = '';
          this.form.sportItemId3 = ''
        }
      },
      getSportItem3(id) {
        this.form.sportItemId2 = '';
        if (id !== '') {
          this.sportitems3 = [];
          this.form.sportItemId3 = '';
          request.get('/api/auth/v1/sportItemCategory', {
            params: {
              parentId: id
            }
          }).then((res) => {
            res.data.length === 0 ? this.showsportitems3 = false : (this.showsportitems3 = true, this.sportitems3 = res.data)
          }).catch((err) => {
            console.log(err);
          })
        } else {
          this.showsportitems3 = false;
          this.form.sportItemId3 = ''
        }
        this.form.sportItemId2 = id
      },

      // 营养分类列表
      getNutrition() {
        request.get('/api/auth/v1/nutritionCategory', {
          params: {
            parentId: '0',
          }
        }).then((res) => {
          // console.log(res.data);
          this.nutritions = res.data;
        }).catch((err) => {
          console.log(err);
        })
      },
      // 营养分类列表2
      getNutrition2(id) {
        if (id !== '') {
          this.nutritions2 = [];
          this.form.nutritionId2 = '';
          request.get('/api/auth/v1/nutritionCategory', {
            params: {
              parentId: id
            }
          }).then((res) => {
            this.nutritions2 = res.data;
            res.data.length === 0 ? this.shownutritions2 = false : this.shownutritions2 = true
          }).catch((err) => {
            console.log(err);
          })
        } else {
          this.shownutritions2 = false;
          this.form.nutritionId2 = ''
        }
      },
      getNutrition3(id) {
        if (id !== '') {
          this.nutritions3 = [];
          this.form.nutritionId3 = '';
          request.get('/api/auth/v1/nutritionCategory', {
            params: {
              parentId: id
            }
          }).then((res) => {
            this.nutritions3 = res.data;
            res.data.length === 0 ? this.shownutritions3 = false : this.shownutritions3 = true
          }).catch((err) => {
            console.log(err);
          })
        } else {
          this.shownutritions3 = false;
          this.form.nutritionId3 = ''
        }
      },
      // 安全教育分类
      getSafety() {
        request.get('/api/auth/v1/safetyEducationCategory', {
          params: {
            parentId: '0'
          }
        }).then((res) => {
          // console.log(res);
          this.safetys = res.data;
        }).catch((err) => {
          console.log(err);
        })
      },
      // 安全教育分类2
      getSafety2(id) {
        if (id !== '') {
          this.safetys2 = [];
          request.get('/api/auth/v1/safetyEducationCategory', {
            params: {
              parentId: id
            }
          }).then((res) => {
            this.safetys2 = res.data;
            res.data.length === 0 ? this.showsafetys2 = false : this.showsafetys2 = true
          }).catch((err) => {
            console.log(err);
          })
        } else {
          this.showsafetys2 = false;
          this.form.safetyEducationId2 = ''
        }
      },
      getSafety3(id) {
        if (id !== '') {
          this.safetys3 = [];
          request.get('/api/auth/v1/safetyEducationCategory', {
            params: {
              parentId: id
            }
          }).then((res) => {
            this.safetys3 = res.data;
            res.data.length === 0 ? this.showsafetys3 = false : this.showsafetys3 = true
          }).catch((err) => {
            console.log(err);
          })
        } else {
          this.showsafetys3 = false;
          this.form.safetyEducationId3 = ''
        }
      },
      // 乐趣分类列表
      getFun() {
        request.get('/api/auth/v1/funCategory', {
          params: {
            parentId: '0'
          }
        }).then((res) => {
          this.funs = res.data;
        }).catch((err) => {
          console.log(err);
        })
      },
      // 乐趣分类列表2
      getFun2(id) {
        if (id !== '') {
          this.funs2 = [];
          request.get('/api/auth/v1/funCategory', {
            params: {
              parentId: id
            }
          }).then((res) => {
            this.funs2 = res.data;
            res.data.length === 0 ? this.showfuns2 = false : this.showfuns2 = true
          }).catch((err) => {
            console.log(err)
          })
        } else {
          this.showfuns2 = false;
          this.form.funId2 = ''
        }
      },
      getFun3(id) {
        if (id !== '') {
          this.funs3 = [];
          request.get('/api/auth/v1/funCategory', {
            params: {
              parentId: id
            }
          }).then((res) => {
            this.funs3 = res.data;
            res.data.length === 0 ? this.showfuns3 = false : this.showfuns3 = true
          }).catch((err) => {
            console.log(err)
          })
        } else {
          this.showfuns3 = false;
          this.form.funId3 = ''
        }
      }
    },

    mounted() {
      // this.init();
      this.getCategory();
      this.getSportItem();
      this.getNutrition();
      this.getSafety();
      this.getFun();
      var t2 = window.setTimeout(this.init(), 500); // 使用字符串执行方法
      window.clearTimeout(t2); // 去掉定时器
    },
    components: {
      Ueditor,
      Upload,
      UploadVideo
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
    }
    .w200{
      width: 200px;
    }
    .content_detail{
      width: 96%;
      margin: 0 5px 20px 40px;
      padding: 15px 20px;
      min-height: 200px;
      border: 1px solid #dcdcdc;
      border-radius: 10px;
    }
    .item-inline{
      display: inline-block;
      margin: 5px 0;
    }
    .item-shichang{
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 0 10px;margin-left: 10px;
    }
    .item-video{
      height: 200px;
      width: 350px;
      vertical-align: top;
    }
    .textCenter{
      text-align: center;
      margin-bottom: 20px;
    }
    .tag-border{
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
    .color_red{
      color: #ff0000;
    }
    .item-dispIb{
      display: inline-block;
      margin: 5px;
    }
</style>
