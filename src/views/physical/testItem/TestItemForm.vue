<template>
  <div class="content">
    <el-form ref="testItem" :model="testItem" :rules="rules" label-width="80px" size="mini" class="form-tab">
      <el-row>
        <el-col>
          <el-form-item label="学年" prop="schoolYear">
            <el-select v-model="testItem.schoolYear" placeholder="请选择" @change="schoolYearChange" style="width: 180px;">
              <el-option
                v-for="item in schoolYearOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="地区">
            <el-select v-model="testItem.posProvinceId" placeholder="请选择省" size="mini" style="width: 180px;float: left;margin-right: 10px" @change="provinceChange">
              <el-option
                v-for="item in provinceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="testItem.posCityId" placeholder="请选择市" style="width: 180px;float: left;margin-right: 10px" size="mini" @change="cityChange">
              <el-option
                v-for="item in cityOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="testItem.posDistrictId" placeholder="请选择区/县" style="width: 180px;float: left;margin-right: 10px" size="mini" @change="districtChange">
              <el-option
                v-for="item in districtOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="学校类型">
            <el-select v-model="testItem.schoolTypeId" placeholder="请选择学校类型" style="width: 180px;float: left;margin-right: 10px" size="mini" @change="schoolTypeChange">
              <el-option
                v-for="item in schoolTypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="testItem.schoolId" placeholder="请选择学校" size="mini" style="width: 200px;float: left;margin-right: 10px" @change="getGrade">
              <el-option
                v-for="item in schoolOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="姓名" style="width: 250px;float: left" prop="name">
            <el-input v-model="testItem.name" placeholder="请输入姓名" class="text-input"></el-input>
          </el-form-item>
          <el-form-item label="性别" style="width: 250px;float: left" prop="sex">
            <el-radio v-model="testItem.sex" label=1>男</el-radio>
            <el-radio v-model="testItem.sex" label=2>女</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="年级" prop="gradeId" style="float: left">
            <el-select v-model="testItem.gradeId" placeholder="请选择" style="width: 130px;" @change="getTestItems">
              <el-option
                v-for="item in gradeOptions"
                :key="item.gradeId"
                :label="item.gradeName"
                :value="item.gradeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级" prop="classId" style="float: left">
            <el-select v-model="testItem.classId" placeholder="请选择" @change="getClassName" style="width: 130px;">
              <el-option
                v-for="item in classOptions"
                :key="item.dictClassId"
                :label="item.dictClassName"
                :value="item.dictClassId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="border-bottom: 1px solid #e6e6e6;">
        <el-col>
          <el-form-item label="身份证/国外护照" label-width="160px" prop="identityType" style="width: 350px;float: left">

            <el-select v-model="testItem.identityType" placeholder="请选择" @change="identityTypeChange">
              <el-option
                v-for="item in identityTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0px" prop="identityNo" style="width: 250px;float: left">
            <el-input v-model="testItem.identityNo" style="width: 250px;" placeholder="请输入证件号码" class="text-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isShowDate">
        <el-col>
          <el-form-item label="出生日期" label-width="105px" class="born-date" prop="bornDate" :rules="{ required: true, message: '请选出生日期', trigger: 'change' }">
            <el-date-picker
              v-model="testItem.bornDate" :picker-options="pickerDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="体测时间" label-width="110px" prop="healthTestTime">
            <el-date-picker
              v-model="testItem.healthTestTime" :picker-options="pickerDate"
              type="date"
              placeholder="请选择体测日期"
              >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-collapse v-model="activeArr">
            <el-collapse-item class="collapse" v-for="(ins, index) of itemList " :key="index" :name="index+1+''">
              <template slot="title">
                <span class="collapse-title-left">{{ ins.categoryName }}</span>
              </template>
              <table class="table" style="width: 100%">
                <tbody>
                <tr>
                  <th v-for="val in tableHeaderArray">{{val}}</th>
                </tr>
                <tr v-for="(obj, ind) of ins.physicalTestItemListResponseBeanList">
                  <td style="width: 33%;text-align: center">
                    <span v-if="obj.name != null && obj.name != ''">{{obj.name}}</span>
                    <span v-else>-</span>
                  </td>
                  <td style="width: 33%;text-align: center" v-if="obj.attrType==1">
                    <el-input style="width: 100px"  v-if="testItem.id !== ''"  v-model="items[index].item[ind].value" v-bind:id="obj.code" v-bind:name="obj.code" @blur="checkAndBind(obj.validRegex, obj.containBoundary, obj.resultRangeStart, obj.resultRangeEnd)"></el-input>
                    <el-input style="width: 100px"  v-if="testItem.id === ''"    v-bind:id="obj.code" v-bind:name="obj.code"  @blur="checkAndBind(obj.validRegex, obj.containBoundary, obj.resultRangeStart, obj.resultRangeEnd)"></el-input>
                    <span style="width: 80px;color: red;" v-if="items[index].item[ind].flag">请输入正确信息！</span>
                  </td>
                  <td style="width: 33%;text-align: center" v-if="obj.attrType==2">
                    <!--<el-input v-model="items[index].item[ind].value" style=""></el-input>-->
                    <!--第一个输入框-->
                    <el-input style="width: 80px" v-if="testItem.id !== ''" v-model="minValue" v-bind:id="obj.code" :disabled="obj.code=='bodyMassIndex' ? true : false" v-bind:name="obj.code" @blur="checkAndBind(obj.validRegex, obj.containBoundary, obj.resultRangeStart, obj.resultRangeEnd)"></el-input><span v-if="obj.name=='体重指数（BMI）'">zhishi</span>
                    <b v-if="testItem.id !== ''">′</b>
                    <el-input style="width: 50px" v-if="testItem.id === ''" v-model="minValue" v-bind:id="obj.code" v-bind:name="obj.code" @blur="checkAndBind(obj.validRegex, obj.containBoundary, obj.resultRangeStart, obj.resultRangeEnd)"></el-input><b v-if="testItem.id === ''">′</b>
                    <!--第二个输入框-->
                    <el-input style="width: 80px" v-if="testItem.id !== ''" v-model="secondValue"  v-bind:id="obj.code" v-bind:name="obj.code"  @blur="checkAndBindSecond(obj.validRegex, obj.containBoundary, obj.resultRangeStart, obj.resultRangeEnd)"></el-input>
                    <b v-if="testItem.id !== ''">″</b>
                    <el-input style="width: 50px" v-if="testItem.id === ''" v-model="secondValue" v-bind:id="obj.code" v-bind:name="obj.code" @blur="checkAndBindSecond(obj.validRegex, obj.containBoundary, obj.resultRangeStart, obj.resultRangeEnd)"></el-input><b v-if="testItem.id === ''">″</b>
                    <span style="width: 80px;color: red;" v-if="items[index].item[ind].flag">请输入正确信息！</span>
                  </td>
                  <td style="width: 33%;text-align: center">
                    <span v-if="obj.unit != null && obj.unit != ''">{{obj.unit}}</span>
                  </td>
                </tr>
                </tbody>
              </table>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item size="large" style="text-align: center;" class="form-action">
            <el-button @click="goBack">取消</el-button>
            <el-button type="primary" :disabled="submitFlag" @click="onSubmit('testItem')">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import '@/styles/common.scss'
  import { formatDate, getSchoolYear } from '@/utils/index'

  export default {
    name: 'TestItemForm',
    methods: {
      isNumber(event, regular, boundary, start, end) {
        var indexs = '';
        var innerIndex = '';
        this.items.forEach((val, index) => {
          val.item.forEach((v, i) => {
            if (v.id === event.target.id) {
              indexs = index;
              innerIndex = i
            }
          })
        })
        if (event.target.value !== '') {
          let re;
          if (regular) {
            re = new RegExp(regular);
          } else {
            re = /^[0-9]+(.[0-9]{1})?$/;
          }
          const rsCheck = re.test(event.target.value);
          if (!rsCheck) {
            this.$set(this.items[indexs].item[innerIndex], 'flag', true)
          } else {
            const value = parseFloat(event.target.value);
            if (boundary === 1) {
              if (start == null) {
                if (end == null) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                } else {
                  if (value < end) {
                    this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                  } else {
                    this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                  }
                }
              } else if (end == null) {
                if (value >= start) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                } else {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                }
              } else {
                if (value >= start && value < end) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                } else {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                }
              }
            } else if (boundary === 2) {
              if (start == null) {
                if (end == null) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                } else {
                  if (value <= end) {
                    this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                  } else {
                    this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                  }
                }
              } else if (end == null) {
                if (value > start) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                } else {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                }
              } else {
                if (value > start && value <= end) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                } else {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                }
              }
            } else if (boundary === 3) {
              if (start == null) {
                if (end == null) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                } else {
                  if (value < end) {
                    this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                  } else {
                    this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                  }
                }
              } else if (end == null) {
                if (value > start) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                } else {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                }
              } else {
                if (value >= start && value <= end) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                } else {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                }
              }
            } else if (boundary === 4) {
              if (start == null) {
                if (end == null) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                } else {
                  if (value < end) {
                    this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                  } else {
                    this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                  }
                }
              } else if (end == null) {
                if (value > start) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                } else {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                }
              } else {
                if (value > start && value < end) {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', false)
                } else {
                  this.$set(this.items[indexs].item[innerIndex], 'flag', true)
                }
              }
            } else {
              this.$set(this.items[indexs].item[innerIndex], 'flag', true)
            }
          }
        } else {
          this.$set(this.items[indexs].item[innerIndex], 'flag', false)
        }
      },
      goBack() {
        this.$router.push('examinationRecord_lv2')
      },
      indexes() {
        var item = this.items[this.indexTag].value
        this.indexTag = this.indexTag + 1
        return item
      },
      identityTypeChange() {
        if (this.testItem.identityType !== 1) {
          this.isShowDate = true
        } else {
          this.isShowDate = false
        }
      },
      schoolYearChange() {
        this.testItem.classId = ''
        if (this.testItem.gradeId !== '') {
          this.getClass()
        }
      },
      getTestItems(value) {
        this.$store.dispatch('GetTestItem', { 'sex': this.testItem.sex, 'gradeId': this.testItem.gradeId }).then(response => {
          this.itemList = response.data
          this.items = []
          this.itemList.forEach((val, index) => {
            var arr = []
            val.physicalTestItemListResponseBeanList.forEach((v, i) => {
              var value = { 'value': v.result, flag: false, id: v.code }
              arr.push(value)
            })
            var i = { 'item': arr }
            this.items.push(i)
          })
        })
        this.getClass()
        let obj = {}
        obj = this.gradeOptions.find((item) => {
          return item.gradeId === value
        })
        this.testItem.schoolGradeName = obj.gradeName
      },
      getClass() {
        this.getClassOptions()
        this.testItem.classId = ''
      },
      getClassOptions() {
        var data = {}
        this.gradeOptions.forEach((v, i) => {
          if (v.gradeId == this.testItem.gradeId) {
            data.schoolTypeGradeId = v.id;
          }
        })
        // data.schoolTypeGradeId = this.testItem.gradeId;
        var list = this.testItem.schoolYear.split('-');
        if (list.length > 0) {
          data.schoolYearStart = list[0]
          data.schoolYearEnd = list[1]
        }
        data.schoolTypeId = this.testItem.schoolTypeId;
        data.schoolId = this.testItem.schoolId;
        this.$store.dispatch('GetClass', data).then(response => {
          this.classOptions = response.data
        })
      },
      getClassName(value) {
        let obj = {}
        obj = this.classOptions.find((item) => {
          return item.dictClassId === value
        })
        this.testItem.schoolClassName = obj.dictClassName
      },
      getGrade() {
        this.getGradeOptions()
        this.testItem.gradeId = ''
        this.testItem.classId = ''
        this.classOptions = []
        this.getSchoolName(this.testItem.schoolId)
      },
      getGradeOptions() {
        this.$store.dispatch('GetGrade', { schoolId: this.testItem.schoolId }).then(response => {
          this.gradeOptions = response.data
        })
      },
      changeSecend: function(event) {
        return event.replace("″", '').split('′')
      },
      checkAndBind: function(regular, boundary, start, end) {
        this.isNumber(event, regular, boundary, start, end);
        this.$set(this.testItem, event.target.id, event.target.value)
      },
      checkAndBindSecond: function(regular, boundary, start, end) {
        this.isNumber(event, regular, 1, start, 60);
        this.$set(this.testItem, event.target.id, event.target.value)
      },
      onSubmit(formName) {
        this.submitFlag = true;
        var flag = true;
        this.items.forEach((val, index) => {
          val.item.forEach((v, i) => {
            if (v.flag) {
              flag = false;
              return
            }
          })
        })
        this.$refs[formName].validate((valid) => {
          if (valid && flag) {
            var list = this.testItem.schoolYear.split('-')
            if (list.length > 0) {
              this.testItem.schoolYearStart = list[0];
              this.testItem.schoolYearEnd = list[1]
            }
            var user = JSON.parse(window.localStorage.getItem('ydl_user'));
            this.testItem.userId = user.userId;
            this.testItem.healthTestTime = formatDate(this.testItem.healthTestTime, 'yyyy-MM-dd');
            let value = Number(this.minValue) * 60 + Number(this.secondValue);
            this.itemList.forEach((item, index) => {
              item.physicalTestItemListResponseBeanList.forEach((v, i) => {
                if (v.attrType==2) {
                  this.fieldName = v.code;
                }
              })
            });
            this.testItem[this.fieldName] = value;
            if (this.testItem.fiftyMeterRun) {
              this.testItem.fiftyMeterRun = this.testItem.fiftyMeterRun.replace("″", '');
            }
            this.$store.dispatch('AddTestItem', this.testItem).then(response => {
              this.$alert('保存成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$router.push('examinationRecord_lv2')
                }
              })
            })
          } else {
            this.$alert('请完成必填/选项!', '提示', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
          }
        })
        this.submitFlag = false
      },
      detailRequest() {
        var id = this.$route.query.id;
        if (typeof id !== 'undefined' && id !== '') {
          var testItem = {
            id: id
          }
          this.$store.dispatch('GetTestItemDetail', testItem).then(response => {
            var time = response.data.healthTestTime.replace('T', ' ')
            setTimeout(() => {
              var b = formatDate(time, 'yyyy-MM-dd')
              // this.testItem = response.data
              for (let name in response.data) {
                if (typeof this.testItem[name] !== 'undefined') {
                  this.testItem[name] = response.data[name]
                }
              }
              this.testItem.schoolYear = this.testItem.schoolYearStart + '-' + this.testItem.schoolYearEnd
              this.getCityOptions(this.testItem.posProvinceId)
              setTimeout(() => {
                this.getDistrictOptions(this.testItem.posCityId)
              }, 500)
              this.getSchoolOptions()
              this.getGradeOptions()
              setTimeout(() => {
                this.getClassOptions()
              }, 200)
              response.data.healthTestTime = b
              this.testItem.healthTestTime = b
              this.testItem.sex = this.testItem.sex + ''
              this.testItem.id = id
              this.itemList = response.data.physicalTestItemCategoryResponseBeanList
              this.itemList.forEach((item, index) => {
                var arr = []
                item.physicalTestItemListResponseBeanList.forEach((v, i) => {
                  var value = { 'value': v.result, flag: false, id: v.code }
                  arr.push(value);
                  if (v.attrType==2) {
                    this.fieldName = v.code;
                    let value = this.changeSecend(v.result);
                    if (value.length > 1) {
                      this.minValue = value[0];
                      this.secondValue = value[1];
                    } else {
                      this.minValue = 0;
                      this.secondValue = value[0];
                    }
                  }
                })
                var i = { 'item': arr }
                this.items.push(i)
              }, 1000)
            })
            this.testItem.id = id
          })
        }
      },
      getOptions(arr, value) {
        let obj = {}
        obj = arr.find((item) => {
          return item.name === value
        })
        return obj
      },
      getSchoolType() {
        this.$store.dispatch('GetSchoolType').then(response => {
          this.schoolTypeOptions = response.data
        })
      },
      getProvince() {
        this.$store.dispatch('GetArea', 0).then(response => {
          this.provinceOptions = response.data
        })
      },
      provinceChange(value) {
        this.getCityOptions(value)
        this.testItem.posCityId = ''
        this.testItem.posDistrictId = ''
        this.testItem.schoolId = ''
        this.testItem.gradeId = ''
        this.testItem.classId = ''
        this.districtOptions = []
        this.schoolOptions = []
        this.gradeOptions = []
        this.classOptions = []
        this.getProvinceName(this.testItem.posProvinceId)
      },
      getCityOptions(value) {
        let obj = {}
        obj = this.provinceOptions.find((item) => {
          return item.id === value
        })
        var param = obj.code
        this.$store.dispatch('GetArea', param).then(response => {
          this.cityOptions = response.data
        })
      },
      cityChange(value) {
        this.getDistrictOptions(value)
        this.testItem.posDistrictId = ''
        this.testItem.schoolId = ''
        this.testItem.gradeId = ''
        this.testItem.classId = ''
        this.schoolOptions = []
        this.gradeOptions = []
        this.classOptions = []
        this.getCityName(this.testItem.posCityId)
      },
      getDistrictOptions(value) {
        let obj = {}
        obj = this.cityOptions.find((item) => {
          return item.id === value
        })
        var param = obj.code
        this.$store.dispatch('GetArea', param).then(response => {
          this.districtOptions = response.data
        })
      },
      districtChange() {
        this.testItem.schoolId = ''
        this.testItem.gradeId = ''
        this.testItem.classId = ''
        this.schoolOptions = []
        this.gradeOptions = []
        this.classOptions = []
        this.schoolTypeChange()
        this.getDistrictName(this.testItem.posDistrictId)
      },
      schoolTypeChange() {
        this.getSchoolOptions()
        this.testItem.schoolId = ''
        this.testItem.gradeId = ''
        this.testItem.classId = ''
        this.gradeOptions = []
        this.classOptions = []
      },
      getSchoolOptions() {
        var param = {
          posProvinceId: this.testItem.posProvinceId,
          posCityId: this.testItem.posCityId,
          posDistrictId: this.testItem.posDistrictId,
          schoolTypeId: this.testItem.schoolTypeId
        }
        this.$store.dispatch('GetSchoolList', param).then(response => {
          this.schoolOptions = response.data
        })
      },
      getSchoolName(value) {
        let obj = {}
        obj = this.schoolOptions.find((item) => {
          return item.id === value
        })
        this.testItem.schoolName = obj.name
      },
      getProvinceName(value) {
        let obj = {}
        obj = this.provinceOptions.find((item) => {
          return item.id === value
        })
        this.testItem.posProvinceName = obj.name
      },
      getCityName(value) {
        let obj = {}
        obj = this.cityOptions.find((item) => {
          return item.id === value
        })
        this.testItem.posCityName = obj.name
      },
      getDistrictName(value) {
        let obj = {}
        obj = this.districtOptions.find((item) => {
          return item.id === value
        })
        this.testItem.posDistrictName = obj.name
      }
    },
    data() {
      var checkIdentityNo = (rule, value, callback) => {
        if (typeof value !== 'string') return callback(new Error('非法身份证'))
        if (value.length === 0) return callback(new Error('身份证号码必填'))
        var city = {
          11: '北京',
          12: '天津',
          13: '河北',
          14: '山西',
          15: '内蒙古',
          21: '辽宁',
          22: '吉林',
          23: '黑龙江 ',
          31: '上海',
          32: '江苏',
          33: '浙江',
          34: '安徽',
          35: '福建',
          36: '江西',
          37: '山东',
          41: '河南',
          42: '湖北 ',
          43: '湖南',
          44: '广东',
          45: '广西',
          46: '海南',
          50: '重庆',
          51: '四川',
          52: '贵州',
          53: '云南',
          54: '西藏 ',
          61: '陕西',
          62: '甘肃',
          63: '青海',
          64: '宁夏',
          65: '新疆',
          71: '台湾',
          81: '香港',
          82: '澳门',
          91: '国外'
        }
        var birthday = value.substr(6, 4) + '/' + Number(value.substr(10, 2)) + '/' + Number(value.substr(12, 2))
        var d = new Date(birthday)
        var newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate())
        var currentTime = new Date().getTime()
        var time = d.getTime()
        var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
        var sum = 0, i, residue
        if (this.testItem.identityType === 4 && !/^[a-zA-Z][0-9]{9}$/.test(value)) return callback(new Error('非法台湾身份证'))
        if (this.testItem.identityType === 2 && !/^((\s?[A-Za-z])|([A-Za-z]{2}))\d{6}\(([0−9aA][0−9aA])|([0-9aA])\)$/i.test(value)) return callback(new Error('非法香港身份证'))
        if (this.testItem.identityType === 3 && !/^[1|5|7][0-9]{6}\([0-9Aa]\)/i.test(value)) return callback(new Error('非法澳门身份证'))
        if (this.testItem.identityType === 5 && !/^[a-zA-Z][0-9]{9}$/i.test(value)) return callback(new Error('非法身份证'))
        if (this.testItem.identityType === 1) {
          if (!/^\d{17}(\d|x)$/i.test(value)) return callback(new Error('非法身份证'))
          if (city[value.substr(0, 2)] === undefined) return callback(new Error('非法身份证'))
          if (time >= currentTime || birthday !== newBirthday) {
            return callback(new Error('非法身份证'))
          } else {
            for (i = 0; i < 17; i++) {
              sum += value.substr(i, 1) * arrInt[i]
            }
            residue = arrCh[sum % 11]
            if (residue !== value.substr(17, 1)) return callback(new Error('非法身份证'))
          }
        }
        return callback()
      }
      return {
        pickerDate: {
          disabledDate: (time) => {
            var date = new Date()
            return time.getTime() > date
          }
        },
        fieldName: '',
        minValue: '',
        secondValue: '',
        submitFlag: false,
        isShowDate: false,
        itemList: [],
        items: [],
        rules: {
          schoolYear: [
            { required: true, message: '请选择学年', trigger: 'change' }
          ],
          gradeId: [
            { required: true, message: '请选择年级', trigger: 'change' }
          ],
          classId: [
            { required: true, message: '请选择班级', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '请选性别', trigger: 'change' }
          ],
          identityType: [
            { required: true, message: '请选择证件类型', trigger: 'change' }
          ],
          identityNo: [
            { validator: checkIdentityNo, tigger: 'blur' }
          ],
          healthTestTime: [
            { required: true, message: '请选择体测时间', trigger: 'change' }
          ]
        },
        testItem: {
          'id': '',
          'userId': '',
          'name': '', // 学生姓名
          'schoolYear': '',
          'bornDate': '', // 出生日期
          'schoolYearStart': '', // 学年度开始年份
          'schoolYearEnd': '', // 学年度结束年份
          'classId': '', // 班级Id
          'schoolClassName': '', // 班级名
          'gradeId': '', // 年级Id
          'schoolGradeName': '', // 年级名称
          'sex': '1', // 性别 1-男；2-女
          'identityType': '', // 身份证类型
          'identityNo': '', // 身份证id
          'healthTestTime': '', // 体测时间
          posProvinceId: '',
          posProvinceName: '',
          posCityId: '',
          posCityName: '',
          posDistrictId: '',
          posDistrictName: '',
          schoolTypeId: '',
          schoolId: ''
        },
        schoolYearOptions: [],
        gradeOptions: [],
        classOptions: [],
        provinceOptions: [],
        cityOptions: [],
        districtOptions: [],
        schoolTypeOptions: [],
        schoolOptions: [],
        identityTypeOptions: [
          {
            value: 1,
            label: '中国大陆身份证'
          },
          {
            value: 2,
            label: '中国香港身份证'
          },
          {
            value: 3,
            label: '中国澳门身份证'
          },
          {
            value: 4,
            label: '中国台湾身份证'
          },
          {
            value: 5,
            label: '国外护照'
          }
        ],
        activeArr: ['1', '2', '3', '4', '5'],
        tableHeaderArray: ['项目', '结果', '单位']
      }
    },
    mounted: function() {
      this.schoolYearOptions = getSchoolYear();
      this.testItem.schoolYear = this.schoolYearOptions[0].value;
      this.getProvince();
      this.getSchoolType();
      this.detailRequest()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .content {
    background-color: white;
    border-radius: 10px;
    min-height: 200px;
    padding: 25px;
  }
  .tab-cell{
    text-align: center;
  }

</style>
