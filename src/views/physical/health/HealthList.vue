<template>
  <div>
    <el-radio-group v-model="physicalModel" @change="phyRouter" style="margin-bottom: 30px;" >
      <!-- <el-radio-button label="1">体质统计</el-radio-button> -->
      <el-radio-button label="2">体测管理</el-radio-button>
      <el-radio-button label="3">体检管理</el-radio-button>
    </el-radio-group>
    <div class="search-form">
      <el-form :inline="true" :model="health" class="">
        <el-row>
          <el-col>
            <el-form-item label="学年">
              <el-select v-model="health.schoolYear" placeholder="请选择" size="mini" @change="schoolYearChange">
                <el-option
                  v-for="item in schoolYearOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地区">
              <el-select v-model="health.posProvinceId" placeholder="请选择省" size="mini" @change="provinceChange">
                <el-option
                  v-for="item in provinceOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="health.posCityId" placeholder="请选择市" size="mini" @change="cityChange">
                <el-option
                  v-for="item in cityOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="health.posDistrictId" placeholder="请选择区/县" size="mini" @change="districtChange">
                <el-option
                  v-for="item in districtOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学校类型">
              <el-select v-model="health.schoolTypeId" placeholder="请选择学校类型" size="mini" @change="schoolTypeChange">
                <el-option
                  v-for="item in schoolTypeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="health.schoolId" placeholder="请选择学校" size="mini" @change="getGrade">
                <el-option
                  v-for="item in schoolOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年级">
              <el-select v-model="health.gradeId" placeholder="请选择" @change="getClass" size="mini">
                <el-option
                  v-for="item in gradeOptions"
                  :key="item.gradeId"
                  :label="item.gradeName"
                  :value="item.gradeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级">
              <el-select v-model="health.classId" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in classOptions"
                  :key="item.dictClassId"
                  :label="item.dictClassName"
                  :value="item.dictClassId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="health.name" placeholder="请输入学生姓名" class="text-input" size="mini"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search(health)" class="btn" size="mini">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="reset(health)" class="btn" size="mini">重置</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="add" class="btn" size="mini" v-if="power.saveExaminationRecord">单个添加</el-button>
              <el-button type="primary" @click="healthImport()" class="btn" size="mini" v-if="power.importExaminationRecord">批量导入</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="list">
      <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark" :header-cell-style="{textAlign:'center', color:'#525252', fontSize:'16px'}" :cell-style="{textAlign:'center'}"
        style="width: 100%" @selection-change="selectChange">
        <el-table-column
          prop="id"
          type="selection">
        </el-table-column>
        <el-table-column
          prop="halthExaminationReport"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="bindingStatusValue"
          label="关联状态"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="area"
          label="地区"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="schoolName"
          label="学校"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="className"
          label="班级"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="体测时间"
          prop="healthExamTime">
        </el-table-column>
        <el-table-column
          label="操作" min-width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleView(scope.$index, scope.row)" class="btn" v-if="power.getExaminationRecord">查看</el-button>
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)" class="btn" v-if="power.updateExaminationRecord">编辑</el-button>
            <el-button
              size="mini" v-if="scope.row.shelvesStatus == 1 && power.shelvesExaminationRecord"
              @click="handleOut(scope.$index, scope.row, 0)" class="btn">下架</el-button>
            <el-button
              size="mini" v-if="scope.row.shelvesStatus != 1 && power.shelvesExaminationRecord"
              @click="handleOut(scope.$index, scope.row, 1)" class="btn">上架</el-button>
            <el-button
              size="mini"
              @click="handleDelete(scope.$index, scope.row)" class="btn" v-if="power.deleteExaminationRecord">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="multi-action">
        <el-button type="primary" @click="updateBatch(0)" class="btn" size="mini" v-if="power.shelvesExaminationRecord">批量下架</el-button>
        <el-button type="primary" @click="updateBatch(1)" class="btn" size="mini" v-if="power.shelvesExaminationRecord">批量上架</el-button>
        <el-button type="primary" @click="deleteBatch" class="btn" size="mini" v-if="power.deleteExaminationRecord">批量删除</el-button>
      </div>
      <div class="page">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.pageNum"
          :page-sizes="[10, 20, 30]"
          :page-size="searchForm.pageSize"
          layout="prev, pager, next, sizes, jumper" backgroud=""
          :total="searchForm.totalPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
    import { getSchoolYear } from '@/utils/index'
    import { isHavePermissions } from '@/utils/auth'
    export default { name: 'HealthList',
      methods: {
        add() {
          this.$router.push('addHealthForm')
        },
        // 批量上下架
        updateBatch(status) {
          var msg = ''
          if (status === 1) {
            msg = '上架'
          } else {
            msg = '下架'
          }
          this.$confirm('确认' + msg + '？').then(_ => {
            var health = { 'ids': this.ids, 'shelvesStatus': status }
            this.$store.dispatch('UpdateBatchHealth', health).then(response => {
              if (response.status.code === 200 || response.status.code === 0) {
                this.$message({
                  message: msg + '成功',
                  type: 'success'
                })
              }
              this.doSearch(this.searchForm)
            })
          })
        },
        // 批量删除
        deleteBatch() {
          var ids = { 'ids': this.ids }
          this.$confirm('确认删除体检报告？').then(_ => {
            this.$store.dispatch('DeleteBatchHealth', ids).then(response => {
              this.doSearch(this.searchForm)
            })
          })
        },
        // 分页大小
        handleSizeChange(val) {
          this.searchForm.pageSize = val
          this.doSearch(this.searchForm)
        },
        // 当前页跳转
        handleCurrentChange(val) {
          this.searchForm.pageNum = val
          this.doSearch(this.searchForm)
        },
        // 重置搜索栏
        reset(health) {
          health.schoolYear = ''
          health.gradeId = ''
          health.classId = ''
          health.name = ''
          health.posDistrictId = ''
          health.posCityId = ''
          health.posProvinceId = ''
          health.schoolId = ''
          health.schoolTypeId = ''
          var date = new Date()
          var diff = date.getFullYear() - 2008
          var month = date.getMonth()
          if (month >= 7) {
            diff++
          }
          health.schoolYear = (2007 + diff) + '-' + (2008 + diff)
          const list = health.schoolYear.split('-')
          if (list.length > 0) {
            health.schoolYearStart = list[0]
            health.schoolYearEnd = list[1]
          }
          this.cityOptions = []
          this.districtOptions = []
          this.schoolOptions = []
          this.gradeOptions = []
          this.classOptions = []
        },
        search(testItem) {
          this.searchForm = this.searchForm = JSON.parse(JSON.stringify(testItem))
          this.doSearch(this.searchForm)
        },
        // 查询
        doSearch(health) {
          const search = {}
          if (health.schoolYear !== '') {
            search.schoolYear = health.schoolYear
          }
          if (health.gradeId !== '') {
            search.gradeId = health.gradeId
          }
          if (health.classId !== '') {
            search.classId = health.classId
          }
          if (health.name !== '') {
            search.name = health.name
          }
          if (health.posProvinceId !== '') {
            search.posProvinceId = health.posProvinceId
          }
          if (health.posCityId !== '') {
            search.posCityId = health.posCityId
          }
          if (health.posDistrictId !== '') {
            search.posDistrictId = health.posDistrictId
          }
          if (health.schoolId !== '') {
            search.schoolId = health.schoolId
          }
          search.pageNum = health.pageNum
          search.pageSize = health.pageSize
          this.$store.dispatch('GetHealthList', search).then(response => {
            if (response.data) {
              this.list = response.data.list
              this.searchForm.totalPage = response.data.total
              this.searchForm.pageNum = response.data.pageNum
            } else {
              this.list = []
              this.searchForm.totalPage = 0
            }
          })
        },
        // 列表多选
        selectChange(val) {
          this.ids = ''
          val.forEach((item, index) => {
            this.ids += item.id + ','
          })
          this.ids = this.ids.substring(0, this.ids.length - 1)
        },
        // 删除
        handleDelete(index, row) {
          this.$confirm('确认删除体检报告？').then(_ => {
            this.$store.dispatch('DeleteHeadlthItem', row.id).then(response => {
              this.doSearch(this.searchForm)
            })
          })
        },
        handleEdit(index, row) {
          this.routeLink = {
            path: '/healthForm',
            query: {
              id: row.id
            }
          }
          this.$router.push(this.routeLink)
        },
        // 上下架
        handleOut(index, row, status) {
          var msg = ''
          if (status === 1) {
            msg = '上架'
          } else {
            msg = '下架'
          }
          this.$confirm('确认' + msg + '？').then(_ => {
            var health = { 'id': row.id, 'shelvesStatus': status }
            this.$store.dispatch('UpdateHealthSelves', health).then(response => {
              if (response.status.code === 200 || response.status.code === 0) {
                this.$message({
                  message: msg + '成功',
                  type: 'success'
                })
              }
              this.doSearch(this.searchForm)
            })
          })
        },
        handleView(index, row) {
          this.routeLink = {
            path: '/healthItemDetail',
            query: {
              id: row.id
            }
          }
          this.$router.push(this.routeLink)
        },
        phyRouter() {
          if (this.physicalModel === '2') {
            this.$router.push('examinationRecord_lv2')
          } else if (this.physicalModel === '3') {
            this.$router.push('/healthList')
          }
        },
        getGrade() {
          this.getGradeOptions()
          this.health.gradeId = ''
          this.health.classId = ''
          this.classOptions = []
        },
        getGradeOptions() {
          this.$store.dispatch('GetGrade', { schoolId: this.health.schoolId }).then(response => {
            this.gradeOptions = response.data
          })
        },
        getClass() {
          this.health.classId = ''
          this.getClassOptions()
        },
        getClassOptions() {
          var data = {}
          data.schoolTypeGradeId = this.health.gradeId
          var list = this.health.schoolYear.split('-')
          if (list.length > 0) {
            data.schoolYearStart = list[0]
            data.schoolYearEnd = list[1]
          }
          data.schoolTypeId = this.health.schoolTypeId
          data.schoolId = this.health.schoolId
          this.$store.dispatch('GetClass', data).then(response => {
            if (response.data) {
              this.classOptions = response.data
            } else {
              this.classOptions = []
            }
          })
        },
        schoolYearChange() {
          this.health.classId = ''
          if (this.health.gradeId !== '') {
            this.getClass()
          }
        },
        // 批量导入
        healthImport() {
          this.$router.push({ path: '/healthImport' })
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
          this.health.posDistrictId = ''
          this.health.schoolId = ''
          this.health.gradeId = ''
          this.health.classId = ''
          this.schoolOptions = []
          this.gradeOptions = []
          this.classOptions = []
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
          this.health.schoolId = ''
          this.health.gradeId = ''
          this.health.classId = ''
          this.schoolOptions = []
          this.gradeOptions = []
          this.classOptions = []
          this.schoolTypeChange()
        },
        schoolTypeChange() {
          this.getSchoolOptions()
          this.health.schoolId = ''
          this.health.gradeId = ''
          this.health.classId = ''
          this.gradeOptions = []
          this.classOptions = []
        },
        getSchoolOptions() {
          this.$store.dispatch('GetSchoolList', this.health).then(response => {
            this.schoolOptions = response.data
          })
        }
      },
      mounted() {
        this.schoolYearOptions = getSchoolYear()
        // this.health.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value
        this.health.schoolYear = this.schoolYearOptions[0].value
        this.search(this.health)
        this.getProvince()
        this.getSchoolType()
        setTimeout(() => {
          this.getCityOptions(this.health.posProvinceId)
        }, 200)
        setTimeout(() => {
          this.getDistrictOptions(this.health.posCityId)
        }, 500)
        this.getSchoolOptions()
        if (this.health.schoolId) {
          this.getGradeOptions()
          setTimeout(() => {
            this.getClassOptions()
          }, 300)
        }
        this.powerArr.forEach(val => {
          this.power[val] = isHavePermissions(val)
        })
      },
      beforeRouteLeave(to, from, next) {
        if (to.name === 'HealthForm' || to.name === 'HealthItemDetail' || to.name === 'AddHealthForm') {
          var condition = JSON.stringify(this.searchForm)
          localStorage.setItem('healthCondition', condition)
        } else {
          localStorage.removeItem('healthCondition')
        }
        next()
      },
      created() {
        var condition = localStorage.getItem('healthCondition')
        if (condition != null) {
          this.health = JSON.parse(condition)
        }
      },
      data() {
        return {
          power: {
            saveExaminationRecord: false,
            deleteExaminationRecord: false,
            updateExaminationRecord: false,
            importExaminationRecord: false,
            shelvesExaminationRecord: false,
            getExaminationRecord: false
          },
          powerArr: ['saveExaminationRecord', 'deleteExaminationRecord', 'updateExaminationRecord', 'importExaminationRecord', 'shelvesExaminationRecord', 'getExaminationRecord'],
          ids: '',
          multiLine: [],
          schoolYearOptions: [],
          gradeOptions: [],
          classOptions: [],
          provinceOptions: [],
          cityOptions: [],
          districtOptions: [],
          schoolTypeOptions: [],
          schoolOptions: [],
          searchForm: {},
          health: {
            schoolYear: '',
            gradeId: '',
            classId: '',
            name: '',
            pageSize: 10,
            pageNum: 1,
            totalPage: 0,
            posProvinceId: '',
            posProvinceName: '',
            posCityId: '',
            posCityName: '',
            posDistrictId: '',
            posDistrictName: '',
            schoolTypeId: '',
            schoolId: ''
          },
          physicalModel: 3,
          list: [],
          multipleSelection: []
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
