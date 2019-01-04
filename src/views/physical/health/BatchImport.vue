<template>
  <div class="content">
    <div style="font-weight: bold; margin: 15px 0px 30px 35px">批量导入</div>
    <el-form :model="health" ref="health" :rules="rules" label-width="100px" class="" :label-position="labelPosition">
      <el-form-item prop="schoolYear" :rules="{required: true, message: '请选择学年', trigger: 'blur'}" label="学年：">
        <el-col :span="4">
          <el-select v-model="health.schoolYear" placeholder="请选择" size="mini" :disabled="disabledFlag"
                     @change="schoolYearChange">
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
        <el-col :span="2">
          <el-form-item label="" prop="posProvinceId" :rules="{required: true, message: '请选择省份', trigger: 'blur'}">
            <el-select style="width: 100%;" v-model="health.posProvinceId" placeholder="请选择省" size="mini" @change="provinceChange" :disabled="disabledFlag">
              <el-option
                v-for="item in provinceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label-width="10px" label="" prop="posCityId" :rules="{required: true, message: '请选择城市', trigger: 'blur'}">
            <el-select style="width: 100%;" v-model="health.posCityId" placeholder="请选择市" size="mini" @change="cityChange" :disabled="disabledFlag">
              <el-option
                v-for="item in cityOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label-width="10px" label="" prop="posDistrictId" :rules="{required: true, message: '请选择区/县', trigger: 'blur'}">
            <el-select style="width: 100%;" v-model="health.posDistrictId" placeholder="请选择区/县" size="mini" @change="districtChange" :disabled="disabledFlag">
              <el-option
                v-for="item in districtOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item required label="学校类型：">

        <el-col :span="3">
          <el-form-item prop="schoolTypeId" :rules="{required: true, message: '请选择学校类型', trigger: 'blur'}">
            <el-select style="width: 100%;" v-model="health.schoolTypeId" placeholder="请选择学校类型" size="mini" :disabled="disabledFlag"
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
            <el-select style="width: 100%" v-model="health.schoolId" placeholder="请选择学校" size="mini" :disabled="disabledFlag"
                       @change="getGrade">
              <el-option
                v-for="item in schoolOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item prop="gradeId" :rules="{required: true, message: '请选择年级', trigger: 'blur'}" label="年级:">
            <el-select style="width: 100%;" v-model="health.gradeId" placeholder="请选择" size="mini" :disabled="disabledFlag"
                       @change="getClass">
              <el-option
                v-for="item in gradeOptions"
                :key="item.gradeId"
                :label="item.gradeName"
                :value="item.gradeId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item prop="classId" :rules="{required: true, message: '请选择班级', trigger: 'blur'}" label="班级：">
            <el-select style="width: 100%;" v-model="health.classId" placeholder="请选择" prop="class" size="mini" :disabled="disabledFlag"
                       @change="getClassName">
              <el-option
                v-for="item in classOptions"
                :key="item.dictClassId"
                :label="item.dictClassName"
                :value="item.dictClassId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="提示：" v-model="health.tips">
        <el-col :span="20">
          <span class="tips">第一步，下载体检信息模板，用下载的模板填写体检基本信息；</span> <a :href="downTemplateUrl"
                                                                    style="color: dodgerblue;text-decoration: underline">下载模板</a>
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
                     v-model="health.files"
                     class="upload-demo"
                     :action=url
                     name="files"
                     :file-list="fileList1"
                     :auto-upload="true"
                     :http-request="myUpload"
                     :show-file-list="false"
                     :on-change="handleChange"
                     :data="p_data"
                     :headers="headers"
                     :multiple="true"
                     accept=".xls, .xlsx"
                     ref="upload">
            <el-button type="primary" size="mini" :disabled="disabledFlag" @click="resetProgress">导入</el-button>
          </el-upload>
        </el-col>
      </el-form-item>

      <div style="margin-left: 410px">
        <div style="position: relative; width: 280px;" v-show="showProgress">

          <el-progress :percentage="progressing" :text-inside="true" :stroke-width="45"
                       class="progress"
                       :show-text="false"></el-progress>
          <div style="left: 10px; bottom: 14px" class="progress-inner-text"
               :class=progressTextColor>
            <img class="icon_style" :src=statusIcon />{{uploadStatus}}
          </div>
          <div style="right: 40px; bottom: 14px; padding-right: 5px;" class="progress-inner-text"
               :class=progressTextColor>{{uploadResult}}
          </div>
          <div style="right: 20px; bottom: 14px; padding-right: 12px; font-weight: bold; font-size: 16px"
               class="progress-inner-text" :class=progressTextColor>
            {{resultDisplay}}
          </div>
          <div style="right: 10px; bottom: 8px" class="progress-inner-text"
               :class=progressTextColor>{{totalNum}}
          </div>
        </div>
      </div>
      <div v-show="showProgress" v-if="failReason !== ''" style="text-align: center; padding: 20px 100px"
           class="progress-inner-color-red">
        <p v-html="failReason"></p>
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
        // 进度条左边上传状态
        uploadStatus: '上传中...',
        // 进度条右边上传结果
        uploadResult: '已上传: ',
        // 上传成功且校验成功数量
        successNum: 0,
        // 上传失败数量
        failNum: 0,
        // 文件选择数量
        fileSize: 0,
        // 上传服务器成功数量（含校验不成功）
        uploadNum: 0,
        // 上传结果显示（进度条左边数字）
        resultDisplay: 0,
        // 是否显示进度条状态
        showProgress: false,
        // 进度多少
        progressing: 0,
        // 上传总数量
        totalNum: 0,
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
        health: {
          schoolYear: '', // 学年
          gradeId: '', // 年级
          classId: '', // 班级
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
          schoolGradeName: '',
          schoolClassName: ''
        },
        fileList1: [],
        p_data: {
          schoolYearStart: '',
          schoolYearEnd: '',
          userId: '',
          gradeId: '',
          schoolGradeName: '',
          classId: '',
          schoolClassName: '',
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
      // 获取userId
      var user = JSON.parse(window.localStorage.getItem('ydl_user'))
      this.p_data.userId = user.userId
      this.schoolYearOptions = getSchoolYear()
      // 拼接上传地址
      this.url = (this.baseApi).replace(/"/g, '') + '/api/auth/v1/physical/health/batchUpload'
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
        this.$store.dispatch('downTemplate', 2).then(response => {
          console.log(response)
          this.downTemplateUrl = response.data
        })
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
      // 学年选择后，判断是否需要重新获取班级
      schoolYearChange() {
        this.health.classId = ''
        if (this.health.gradeId !== '') {
          this.getClass(this.health.gradeId)
        }
      },
      provinceChange(value) {
        let obj = {}
        obj = this.provinceOptions.find((item) => {
          return item.id === value
        })
        var param = obj.code
        this.health.posProvinceName = obj.name
        this.$store.dispatch('GetArea', param).then(response => {
          this.cityOptions = response.data
        })
        this.health.posCityId = ''
        this.health.posDistrictId = ''
        this.health.schoolId = ''
        this.health.gradeId = ''
        this.health.classId = ''
        this.districtOptions = []
        this.schoolOptions = []
        this.gradeOptions = []
        this.classOptions = []
      },
      cityChange(value) {
        let obj = {}
        obj = this.cityOptions.find((item) => {
          console.log(item)
          return item.id === value
        })
        var param = obj.code
        this.health.posCityName = obj.name
        this.$store.dispatch('GetArea', param).then(response => {
          this.districtOptions = response.data
        })
        this.health.posDistrictId = ''
        this.health.schoolId = ''
        this.health.gradeId = ''
        this.health.classId = ''
        this.schoolOptions = []
        this.gradeOptions = []
        this.classOptions = []
      },
      districtChange(value) {
        let obj = {}
        obj = this.districtOptions.find((item) => {
          console.log(item)
          return item.id === value
        })
        this.health.posDistrictName = obj.name
        this.health.schoolId = ''
        this.health.gradeId = ''
        this.health.classId = ''
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
        this.health.schoolType = obj.name
        this.$store.dispatch('GetSchoolList', this.health).then(response => {
          this.schoolOptions = response.data
        })
        this.health.schoolId = ''
        this.health.gradeId = ''
        this.health.classId = ''
        this.gradeOptions = []
        this.classOptions = []
      },
      // 获取年级
      getGrade(value) {
        let obj = {}
        obj = this.schoolOptions.find((item) => {
          return item.id === value
        })
        this.health.schoolName = obj.name
        this.$store.dispatch('GetGrade', { schoolId: this.health.schoolId }).then(response => {
          this.gradeOptions = response.data
        })
        this.health.gradeId = ''
        this.health.classId = ''
        this.classOptions = []
      },
      // 获取班级，同时获取年级label
      getClass(value) {
        this.health.classId = ''
        var data = {}
        data.schoolTypeGradeId = this.health.gradeId
        var list = this.health.schoolYear.split('-')
        if (list.length > 0) {
          data.schoolYearStart = list[0]
          data.schoolYearEnd = list[1]
          this.p_data.schoolYearStart = list[0]
          this.p_data.schoolYearEnd = list[1]
        }
        data.schoolTypeId = this.health.schoolTypeId
        data.schoolId = this.health.schoolId
        this.$store.dispatch('GetClass', data).then(response => {
          this.classOptions = response.data
        })
        let obj = {};
        obj = this.gradeOptions.find((item) => {
          return item.gradeId === value
        });
        this.health.schoolGradeName = obj.gradeName
      },
      // 获取班级label
      getClassName(value) {
        let obj = {}
        obj = this.classOptions.find((item) => {
          return item.id === value
        })
        this.health.schoolClassName = obj.dictClassName
      },
      // 自定义上传方法
      myUpload(content) {
        console.log(content)
        var formData = new FormData
        formData.append('files', content.file)
        formData.append('posProvinceId', this.health.posProvinceId)
        formData.append('posProvinceName', this.health.posProvinceName.toString())
        formData.append('posCityId', this.health.posCityId)
        formData.append('posCityName', this.health.posCityName.toString())
        formData.append('posDistrictId', this.health.posDistrictId)
        formData.append('posDistrictName', this.health.posDistrictName.toString())
        formData.append('schoolTypeId', this.health.schoolTypeId)
        formData.append('schoolId', this.health.schoolId)
        formData.append('schoolName', this.health.schoolName.toString())
        formData.append('gradeId', this.health.gradeId)
        formData.append('schoolGradeName', this.health.schoolGradeName.toString())
        formData.append('classId', this.health.classId)
        formData.append('schoolClassName', this.health.schoolClassName.toString())
        formData.append('schoolYearStart', this.p_data.schoolYearStart)
        formData.append('schoolYearEnd', this.p_data.schoolYearEnd)
        superagent
          .post(this.url)
          .set('Authorization', getToken())
          .send(formData)
          .end((res, rep) => {
            console.log(res, rep)
            content.onSuccess(JSON.parse(rep.text))
          })
      },
      handleChange(file, fileList) {
        var _this = this
        // 只要点击了上传按钮，就需要等上传完成才能再次编辑表单
        _this.disabledFlag = true
        if (_this.valFlag) {
          this.$refs.health.validate((valid) => {
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
        _this.failNum = 0
        // 上传成功且校验成功数量
        _this.successNum = 0
        // 上传服务器成功数量（含校验不成功）
        _this.uploadNum = 0
        // 输入框编辑状态
        _this.disabledFlag = false
        // 进度条左边上传状态
        _this.uploadStatus = '上传中...'
        // 进度条右边上传结果
        _this.uploadResult = '已上传: '
        // 上传结果显示（进度条左边数字）
        _this.resultDisplay = 0
        // 是否显示进度条状态
        _this.showProgress = false
        // 进度多少
        _this.progressing = 0
        // 上传总数量
        _this.totalNum = 0
        // 上传失败原因
        _this.failReason = ''
        // 进度条文本颜色
        _this.progressTextColor = 'progress-inner-color'
        // 文件选择数量
        _this.fileSize = 0
      },
      // 计算上传成功／失败数，且组织失败原因
      countAndFormatData(file, fileList) {
        if (fileList.length > 0) {
          var _this = this
          // console.info(file.response)
          // 统计上传成功和失败的数量
          if (file.status === 'ready') {
            console.info(' file response ----' + file.name + ' -- file status --- ' + file.status)
            _this.fileSize = _this.fileSize + 1
          }
          // 检查文件大小,超过限制，直接提示上传失败
          if (!_this.isLessThan1M(file) && file.status === 'ready') {
            // _this.$refs.upload.abort()
            _this.failNum = _this.failNum + 1// 组织导入上传失败原因
            _this.failReason = _this.failReason + _this.failNum + '. ' + file.name + ': 文件不能大于1MB' + ' <br/> <br/> '
          } else if (_this.isLessThan1M(file) && file.status === 'success' && file.response.status.code === 0) {
            // 上传服务器成功且校验成功
            _this.successNum = _this.successNum + 1
            _this.uploadNum = _this.uploadNum + 1
          } else if (_this.isLessThan1M(file) && file.status === 'fail') {
            // 上传服务器失败
            _this.failNum = _this.failNum + 1// 组织导入上传失败原因
            _this.failReason = _this.failReason + _this.failNum + '. ' + file.name + ': 上传失败' + ' <br/> <br/> '
          } else if (_this.isLessThan1M(file) && file.status === 'success' && file.response.status.code !== 0) {
            // 上传服务器成功，但校验不成功
            _this.failNum = _this.failNum + 1
            _this.uploadNum = _this.uploadNum + 1
            // 组织导入上传失败原因
            if (file.response.status.msg !== null && file.response.status.msg !== '') {
              _this.failReason = _this.failReason + _this.failNum + '. ' + file.name + ': ' + file.response.status.msg + ' <br/> <br/> '
            } else {
              _this.failReason = _this.failReason + _this.failNum + '. ' + file.name + ': 校验不通过' + ' <br/> <br/> '
            }
          }
          // 更新显示结果
          this.showResult(file, fileList)
        }
      },
      // 更新显示数据
      showResult(file, fileList) {
        var _this = this
        // 延时更新进度条
        setTimeout(function() {
          // 更新进度条为可见，且更新其进度
          _this.showProgress = true
          _this.progressing = Math.round(_this.uploadNum / _this.fileSize * 100)
          _this.resultDisplay = _this.successNum
          _this.uploadResult = '已上传: '
          console.info(' fileList >>>>> ' + JSON.stringify(fileList))
          // _this.totalNum = ' /' + fileList.length
          _this.totalNum = ' /' + _this.fileSize
          // 将最终结果显示界面
          if ((_this.successNum + _this.failNum) === _this.fileSize) {
            if (_this.failNum === 0) {
              _this.uploadStatus = '上传成功'
              // 更新上传状态图标
              _this.statusIcon = _this.icTick
              // 进度条文本颜色
              _this.progressTextColor = 'progress-inner-color'
              // 上传成功，跳转列表
              setTimeout(function() {
                _this.$router.push('/healthList')
              }, 1000)
            } else {
              _this.uploadStatus = '上传失败'
              // 更新上传状态图标
              _this.statusIcon = _this.icErr
              _this.uploadResult = '失败数: '
              _this.resultDisplay = _this.failNum
              // 进度条文本颜色
              _this.progressTextColor = 'progress-inner-color-red'
            }
            _this.disabledFlag = false
          }

          console.info(' > fileList.length  > ' + fileList.length + ' > fileSize ' + _this.fileSize + ' >> filename ' + file.name + ' >> success ' + _this.successNum + ' fail > ' + _this.failNum + ' fail reason > ' + _this.failReason)
        }, 500)
      },
      // 检查文件大小
      isLessThan1M(file) {
        const isLt1M = Math.ceil(file.size / 1024 / 1024) <= 1
        console.info(' >>> file ' + file.name + ' > size less than 1MB > ' + isLt1M + ' > size: ' + file.size + ' response： ' + JSON.stringify(file.response))
        return isLt1M
      }
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
</style>
