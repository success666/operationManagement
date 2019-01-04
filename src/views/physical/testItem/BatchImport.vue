<template>
  <div class="content">
    <div style="font-weight: bold; margin: 15px 0px 30px 35px">批量导入学生</div>
    <el-form :model="testItem" ref="testItem" :rules="rules" label-width="100px" class="" :label-position="labelPosition">
      <el-form-item prop="schoolYear" :rules="{required: true, message: '请选择学年', trigger: 'blur'}" label="学年：">
        <el-col :span="4">
          <!--<el-select v-model="testItem.schoolYear" placeholder="请选择" size="mini" :disabled="disabledFlag" @change="schoolYearChange">-->
          <el-select v-model="testItem.schoolYear" placeholder="请选择" size="mini" :disabled="disabledFlag">
            <el-option
              v-for="item in schoolYearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>

      <el-form-item required label="地址：">
        <!--<el-col :span="2">-->
        <el-form-item label="" prop="posProvinceId" :rules="{required: true, message: '请选择省份', trigger: 'blur'}" style="float: left;width: 150px;">
          <el-select style="width: 100%;" v-model="testItem.posProvinceId" placeholder="请选择省" size="mini" @change="provinceChange" :disabled="disabledFlag">
            <el-option
              v-for="item in provinceOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--</el-col>-->
        <!--<el-col :span="2">-->
        <el-form-item label-width="10px" prop="posCityId" :rules="{required: true, message: '请选择城市', trigger: 'blur'}" style="float: left;width: 150px;">
          <el-select style="width: 100%;" v-model="testItem.posCityId" placeholder="请选择市" size="mini" @change="cityChange" :disabled="disabledFlag">
            <el-option
              v-for="item in cityOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--</el-col>-->
        <!--<el-col :span="3">-->
        <el-form-item label-width="10px" label="" prop="posDistrictId" :rules="{required: true, message: '请选择区/县', trigger: 'blur'}" style="float: left;width: 150px;">
          <el-select style="width: 100%;" v-model="testItem.posDistrictId" placeholder="请选择区/县" size="mini" @change="districtChange" :disabled="disabledFlag">
            <el-option
              v-for="item in districtOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--</el-col>-->
      </el-form-item>

      <el-form-item required label="学校类型：">

        <el-col :span="3">
          <el-form-item prop="schoolTypeId" :rules="{required: true, message: '请选择学校类型', trigger: 'blur'}">
            <el-select style="width: 100%;" v-model="testItem.schoolTypeId" placeholder="请选择学校类型" size="mini" :disabled="disabledFlag"
                       @change="schoolTypeChange">
              <el-option
                v-for="item in schoolTypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item label-width="10px" prop="schoolId" :rules="{required: true, message: '请选择学校', trigger: 'blur'}">
            <!--<el-select style="width: 100%" v-model="testItem.schoolId" placeholder="请选择学校" size="mini" :disabled="disabledFlag" @change="getGrade">-->
            <el-select style="width: 294px" v-model="testItem.schoolId" placeholder="请选择学校" size="mini" :disabled="disabledFlag">
              <el-option
                v-for="item in schoolOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!--<el-col :span="4">-->
          <!--<el-form-item prop="gradeId" :rules="{required: true, message: '请选择年级', trigger: 'blur'}" label="年级:">-->
            <!--<el-select style="width: 100%;" v-model="testItem.gradeId" placeholder="请选择" size="mini" :disabled="disabledFlag"-->
                       <!--@change="getClass">-->
              <!--<el-option-->
                <!--v-for="item in gradeOptions"-->
                <!--:key="item.gradeId"-->
                <!--:label="item.gradeName"-->
                <!--:value="item.gradeId">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</el-col>-->

        <!--<el-col :span="4">-->
          <!--<el-form-item prop="classId" :rules="{required: true, message: '请选择班级', trigger: 'blur'}" label="班级：">-->
            <!--<el-select style="width: 100%;" v-model="testItem.classId" placeholder="请选择" prop="class" size="mini" :disabled="disabledFlag"-->
                       <!--@change="getClassName">-->
              <!--<el-option-->
                <!--v-for="item in classOptions"-->
                <!--:key="item.dictClassId"-->
                <!--:label="item.dictClassName"-->
                <!--:value="item.dictClassId">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      </el-form-item>

      <el-form-item label="提示：" v-model="testItem.tips">
        <el-col :span="20">
          <span class="tips">第一步，下载体测信息模板，用下载的模板填写体测基本信息；</span> <a :href="downTemplateUrl" style="color: dodgerblue;text-decoration: underline">下载模板</a>
          <br>
          <span class="tips">第二步，点击导入按钮上传已填写完毕的信息模板即可；</span>
        </el-col>

      </el-form-item>

      <el-form-item style="text-align: center;margin-left: 370px">
        <el-col :span="3">
          <el-button @click="goback" size="mini">返回</el-button>
        </el-col>
        <el-col :span="3">
          <el-upload :disabled="disabledFlag"
                     v-model="testItem.files"
                     class="upload-demo"
                     :action=url
                     name="files"
                     :file-list="fileList1"
                     :auto-upload="true"
                     :show-file-list="false"
                     :on-change="handleChange"
                     :http-request="myUpload"
                     :data="p_data"
                     :multiple="true"
                     accept=".xls, .xlsx"
                     :headers="headers"
                     ref="upload">
            <el-button type="primary" size="mini" :disabled="disabledFlag" @click="resetProgress">导入</el-button>
          </el-upload>
        </el-col>
      </el-form-item>

      <div style="width: 280px;margin: 0 auto;">
        <div style="width: 280px;" v-show="showProgress">
          <div v-if="res.importState==1" class="progressdiv bgcg">✔</div>
          <div v-else-if="res.importState==2" class="progressdiv bgcy">！</div>
          <div v-else-if="res.importState>2 || prostarts==0" class="progressdiv bgcr">×</div>
          <el-progress v-else :percentage="progressing" :text-inside="true" :stroke-width="45" class="progress"
                       :color=progressColor
                       :show-text="false"></el-progress>
          <!--<div style="left: 10px; bottom: 14px" class="progress-inner-text"-->
               <!--:class=progressTextColor>-->
            <!--<img class="icon_style" :src=statusIcon />{{uploadStatus}}-->
          <!--</div>-->
          <!--<div style="right: 40px; bottom: 14px; padding-right: 5px;" class="progress-inner-text"-->
               <!--:class=progressTextColor>{{uploadResult}}-->
          <!--</div>-->
          <!--<div style="right: 20px; bottom: 14px; padding-right: 12px; font-weight: bold; font-size: 16px"-->
               <!--class="progress-inner-text" :class=progressTextColor>-->
            <!--{{resultDisplay}}-->
          <!--</div>-->
          <!--<div style="right: 10px; bottom: 8px" class="progress-inner-text"-->
               <!--:class=progressTextColor>{{totalNum}}-->
          <!--</div>-->
        </div>
      </div>
      <div v-show="showProgress" style="text-align: center; padding: 20px 100px"
           class="progress-inner-color-red">
        <p v-if="res.importState==0" style="text-align:center;color: red;">系统出现错误，请联系系统管理员！</p>
        <p v-if="res.importState==1" style="text-align:center;color: green;">全部导入成功{{res.successNum}}条</p>
        <p v-if="res.importState==2" style="text-align:center;color: #1f2d3d;">成功{{res.successNum}}条，失败{{res.failureNum}}条！</p>
        <p v-if="res.importState==3" style="text-align:center;color: #FF0000;">文件格式异常</p>
        <p v-if="res.importState==4" style="text-align:center;color: #FF0000;">文件为空</p>
        <p v-show="res.url!==null"><a :href="res.url" download="" style="text-align:center;color: #4139ff;text-decoration:underline;">下载失败文件</a></p>
      </div>
    </el-form>

  </div>
</template>

<script>
  import { getToken } from '@/utils/auth'
  import superagent from 'superagent'
  import { getSchoolYear } from '@/utils/index'
  // 图片资源
  import icIng from '@/assets/imgs/icon_uploading.png'
  import icTick from '@/assets/imgs/icon_tick.png'
  import icErr from '@/assets/imgs/icon_err.png'

  export default {
    data() {
      return {
        // 下载模版链接
        downTemplateUrl: '',
        // 上传中图标
        icIng: icIng,
        // 上传成功图标
        icTick: icTick,
        // 上传失败图标
        icErr: icErr,
        // 上传状态图标
        statusIcon: '',
        // 服务器前缀
        baseApi: process.env.BASE_API,
        // 上传地址
        url: '',
        // 文件上传中时，表单不能编辑
        disabledFlag: false,
        // 判断是否做表单校验
        valFlag: true,
        // 文件选择数量
        fileSize: 0,
        // 上传服务器成功数量（含校验不成功）
        uploadNum: 0,
        // 上传返回的response.data
        res: {
          // 上传服务器不成功数量
          failureNum: 0,
          importMsg: '', // 返回的提示语
          importState: '', // 上传状态 0 失败  1 成功
          successNum: 0, // 成功的数量
          url: '' // 失败的下载链接
        },
        // 是否显示进度条状态
        showProgress: false,
        // 进度条颜色
        progressColor: '',
        prostarts: '',
        // 进度多少
        progressing: 0,
        // 上传失败原因
        failReason: '',
        // 进度条文本颜色
        progressTextColor: 'progress-inner-color',
        // 整个表单的label对齐方式
        labelPosition: 'right',
        rules: {},
        schoolYearOptions: [],
        gradeOptions: [],
        classOptions: [],
        provinceOptions: [],
        cityOptions: [],
        countyOptions: [],
        schoolTypeOptions: [],
        schoolNameOptions: [],
        districtOptions: [],
        schoolOptions: [],
        testItem: {
          schoolYear: '', // 学年
          // gradeId: '', // 年级
          // classId: '', // 班级
          province: '', // 省份
          city: '', // 城市
          county: '', // 县区
          schoolType: '', // 学校类型
          schoolName: '', // 学校名称
          files: [],
          tips: '',
          posProvinceId: '',
          posProvinceName: '',
          posCityId: '',
          posCityName: '',
          posDistrictId: '',
          posDistrictName: '',
          schoolTypeId: '',
          schoolId: '',
          // schoolGradeName: '',
          // schoolClassName: ''
        },
        fileList1: [],
        p_data: {
          schoolYearStart: '',
          schoolYearEnd: '',
          schoolYear: '', // 学年
          gradeId: '',
          // schoolGradeName: '',
          // classId: '',
          // schoolClassName: '',
          posProvinceId: '',
          posProvinceName: '',
          posCityId: '',
          posCityName: '',
          posDistrictId: '',
          posDistrictName: '',
          schoolTypeId: '',
          schoolId: ''
        },
        headers: {
          Authorization: getToken()
        }
      }
    },
    mounted() {
      var usertoken = getToken()
      this.headers.Authorized = usertoken
      this.schoolYearOptions = getSchoolYear()
      // 拼接上传地址
      this.url = (this.baseApi).replace(/"/g, '') + '/api/auth/v1/physical/testItem/batchUpload'
      // 初始化上传状态图标
      this.statusIcon = this.icIng
      this.getDownloadDemo()
      this.getProvince()
      this.getSchoolType()
    },
    methods: {
      goback() {
        history.go(-1)
      },
      // 获取下载模版
      getDownloadDemo() {
        this.$store.dispatch('downTemplate', 1).then(response => {
          // console.log(response)
          this.downTemplateUrl = response.data
        })
      },
      myUpload(content) {
        var formData = new FormData;
        var list = this.testItem.schoolYear.split('-');
        if (list.length > 0) {
          this.p_data.schoolYearStart = list[0];
          this.p_data.schoolYearEnd = list[1]
        }
        formData.append('files', content.file);
        // formData.append('posProvinceId', this.testItem.posProvinceId);
        // formData.append('posProvinceName', this.testItem.posProvinceName.toString());
        // formData.append('posCityId', this.testItem.posCityId);
        // formData.append('posCityName', this.testItem.posCityName.toString());
        // formData.append('posDistrictId', this.testItem.posDistrictId);
        // formData.append('posDistrictName', this.testItem.posDistrictName.toString());
        // formData.append('schoolTypeId', this.testItem.schoolTypeId);
        formData.append('schoolId', this.testItem.schoolId);
        // formData.append('schoolName', this.testItem.schoolName.toString());
        // formData.append('gradeId', this.testItem.gradeId);
        // formData.append('schoolGradeName', this.testItem.schoolGradeName.toString());
        // formData.append('classId', this.testItem.classId);
        // formData.append('schoolClassName', this.testItem.schoolClassName.toString());
        formData.append('schoolYear', this.testItem.schoolYear);
        // formData.append('schoolYearStart', this.p_data.schoolYearStart);
        // formData.append('schoolYearEnd', this.p_data.schoolYearEnd);
        superagent
          .post(this.url)
          .set('Authorization', getToken())
          .send(formData)
          .end((res, rep) => {
            console.log('res======>', res, rep)
            content.onSuccess(JSON.parse(rep.text))
          })
      },
      handleChange(file, fileList) {
        var _this = this
        // 只要点击了上传按钮，就需要等上传完成才能再次编辑表单
        _this.disabledFlag = true
        if (_this.valFlag) {
          this.$refs.testItem.validate((valid) => {
            // 检验必填项
            if (valid) {
              // 计算上传成功／失败数，且组织失败原因
              _this.countAndFormatData(file, fileList)
            } else {
              // 更新valFlag 为 false，当用户不点击确认按钮，就不继续验证
              _this.valFlag = false
              this.$confirm('请完成必填/选项!').then(
                _this.valFlag = true
              )
              // 如果在表单校验不通过之前已选择文件，则先将所有数据还原设置
              _this.resetProgress()
              return false
            }
          })
        }
      },
      // 重置上传状态
      resetProgress() {
        var _this = this
        // 如果在表单校验不通过之前已选择文件，则先将所有数据还原设置
        _this.$refs.upload.clearFiles()
        console.info(' >>>>> clear files ')
        // 初始化上传状态图标
        _this.statusIcon = _this.icIng
        // 上传失败数量
        _this.failureNum = 0
        // 上传成功且校验成功数量
        _this.successNum = 0
        // 上传服务器成功数量（含校验不成功）
        _this.uploadNum = 0
        // 输入框编辑状态
        _this.disabledFlag = false
        // 是否显示进度条状态
        _this.showProgress = false
        // 进度多少
        _this.progressing = 0
        // 进度条文本颜色
        _this.progressTextColor = 'progress-inner-color'
        // 文件选择数量
        _this.fileSize = 0
      },
      // 计算上传成功／失败数，且组织失败原因
      countAndFormatData(file, fileList) {
        if (fileList.length > 0) {
          setTimeout(function() {
            this.prostarts = file.response.data.importState;
            if (file.response.data.importState == 0) {
              console.log('异常')
              this.progressColor = '#ff5b51';
            } else if (file.response.data.importState == 1) {
              console.log('成功');
            } else if (file.response.data.importState == 2) {
              console.log('存在导入失败记录')
              this.progressColor = '#ffe341';
            } else if (file.response.data.importState == 3) {
              console.log('文件格式异常')
              this.progressColor = '#fd151b';
            } else if (file.response.data.importState == 4) {
              console.log('文件为空')
              this.progressColor = '#ff2e2e';
            }
          }, 800);
          // 更新显示结果
          this.showResult(file, fileList)
        }
      },
      // 更新显示数据
      showResult(file, fileList) {
        var _this = this;
        // 延时更新进度条
        setTimeout(function() {
          // 更新进度条为可见，且更新其进度
          const res = file.response;
          _this.res.failureNum = res.data.failureNum;
          _this.res.importMsg = res.data.importMsg;
          _this.res.importState = res.data.importState;
          _this.res.successNum = res.data.successNum;
          _this.res.url = res.data.url;
          _this.showProgress = true;
          _this.progressing = Math.round(_this.uploadNum / _this.fileSize * 100);
          _this.resultDisplay = _this.successNum;
          _this.uploadResult = '已上传: ';
          if (_this.res.importState == 1) {
            setTimeout(function() {
              _this.$router.push('/examinationRecord_lv2/testItemList')
            }, 1000)
          }
          _this.disabledFlag = false
        }, 500)
      },
      getProvince() {
        this.$store.dispatch('GetArea', 0).then(response => {
          this.provinceOptions = response.data
        })
      },
      getSchoolType() {
        this.$store.dispatch('GetSchoolType').then(response => {
          this.schoolTypeOptions = response.data
        })
      },
      provinceChange(value) {
        let obj = {}
        obj = this.provinceOptions.find((item) => {
          return item.id === value
        })
        var param = obj.code
        this.testItem.posProvinceName = obj.name
        this.$store.dispatch('GetArea', param).then(response => {
          this.cityOptions = response.data
        })
        this.testItem.posCityId = ''
        this.testItem.posDistrictId = ''
        this.testItem.schoolId = ''
        this.testItem.gradeId = ''
        this.testItem.classId = ''
        this.districtOptions = []
        this.schoolOptions = []
        this.gradeOptions = []
        this.classOptions = []
      },
      cityChange(value) {
        let obj = {}
        obj = this.cityOptions.find((item) => {
          return item.id === value
        })
        var param = obj.code
        this.testItem.posCityName = obj.name
        this.$store.dispatch('GetArea', param).then(response => {
          this.districtOptions = response.data
        })
        this.testItem.posDistrictId = ''
        this.testItem.schoolId = ''
        this.testItem.gradeId = ''
        this.testItem.classId = ''
        this.schoolOptions = []
        this.gradeOptions = []
        this.classOptions = []
      },
      districtChange(value) {
        let obj = {}
        obj = this.districtOptions.find((item) => {
          return item.id === value
        })
        this.testItem.posDistrictName = obj.name
        this.testItem.schoolId = ''
        this.testItem.gradeId = ''
        this.testItem.classId = ''
        this.schoolOptions = []
        this.gradeOptions = []
        this.classOptions = []
        // this.schoolTypeChange()
      },
      schoolTypeChange(value) {
        let obj = {}
        obj = this.schoolTypeOptions.find((item) => {
          return item.id === value
        })
        this.testItem.schoolType = obj.name
        this.$store.dispatch('GetSchoolList', this.testItem).then(response => {
          this.schoolOptions = response.data
        })
        this.testItem.schoolId = ''
        this.testItem.gradeId = ''
        this.testItem.classId = ''
        this.gradeOptions = []
        this.classOptions = []
      },
      // 检查文件大小
      isLessThan1M(file) {
        const isLt1M = Math.ceil(file.size / 1024 / 1024) <= 1
        console.info(' >>> file ' + file.name + ' > size less than 1MB > ' + isLt1M + ' > size: ' + file.size + ' response： ' + JSON.stringify(file.response))
        return isLt1M
      }
      // 学年选择后，判断是否需要重新获取班级
      // schoolYearChange() {
      //   this.testItem.classId = ''
      //   if (this.testItem.gradeId !== '') {
      //     this.getClass(this.testItem.gradeId)
      //   }
      // },
      // 获取年级
      // getGrade(value) {
      //   let obj = {}
      //   obj = this.schoolOptions.find((item) => {
      //     console.log(item)
      //     return item.id === value
      //   })
      //   this.testItem.schoolName = obj.name
      //   this.$store.dispatch('GetGrade', { schoolId: this.testItem.schoolId }).then(response => {
      //     this.gradeOptions = response.data
      //   })
      //   this.testItem.gradeId = ''
      //   this.testItem.classId = ''
      //   this.classOptions = []
      // },
      // 获取班级，同时获取年级label
      // getClass(value) {
      //   this.testItem.classId = ''
      //   var data = {}
      //   data.schoolTypeGradeId = this.testItem.gradeId
      //   var list = this.testItem.schoolYear.split('-')
      //   if (list.length > 0) {
      //     data.schoolYearStart = list[0]
      //     data.schoolYearEnd = list[1]
      //     this.p_data.schoolYearStart = list[0]
      //     this.p_data.schoolYearEnd = list[1]
      //   }
      //   data.schoolTypeId = this.testItem.schoolTypeId
      //   data.schoolId = this.testItem.schoolId
      //   this.$store.dispatch('GetClass', data).then(response => {
      //     this.classOptions = response.data
      //   })
      //   let obj = {}
      //   obj = this.gradeOptions.find((item) => {
      //     return item.gradeId === value
      //   })
      //   this.testItem.schoolGradeName = obj.gradeName
      // },
      // 获取班级label
      // getClassName(value) {
      //   let obj = {}
      //   obj = this.classOptions.find((item) => {
      //     return item.dictClassId === value
      //   })
      //   this.testItem.schoolClassName = obj.dictClassName
      // },
      // 自定义上传方法
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .content {
    margin-top: 30px;
    width: 100%;
    background-color: white;
    padding: 10px;
    border-radius: 8px;
  }
  .el-select{
    width: 120px;
  }

  .icon_style{
    padding-right: 3px;
  }
  .progressdiv{
    width: 280px;
    height: 45px;
    font-size: 32px;
    border-radius: 30px;
    text-align: center;
    line-height: 45px;
    color: #fff;
  }
  .bgcy{
    background-color: #ffd522;
  }
  .bgcr{
    background-color: #fa510e;
  }
  .bgcg{
    background-color: #61ff21;
  }
</style>
