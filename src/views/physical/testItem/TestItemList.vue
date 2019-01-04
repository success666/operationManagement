<template>
  <div>
    <el-radio-group v-model="physicalModel" style="margin-bottom: 30px;" @change="phyRouter">
      <!-- <el-radio-button label="1">体质统计</el-radio-button> -->
      <el-radio-button label="2">体测管理</el-radio-button>
      <el-radio-button label="3">体检管理</el-radio-button>
    </el-radio-group>
    <div class="search-form">
      <el-form :inline="true" :model="testItem" class="">
        <el-row>
          <el-col>
            <el-form-item label="学年">
              <el-select v-model="testItem.schoolYear" placeholder="请选择" size="mini" @change="schoolYearChange">
                <el-option
                  v-for="item in schoolYearOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地区">
              <el-select v-model="testItem.posProvinceId" placeholder="请选择省" size="mini" @change="provinceChange">
                <el-option
                  v-for="item in provinceOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="testItem.posCityId" placeholder="请选择市" size="mini" @change="cityChange">
                <el-option
                  v-for="item in cityOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="testItem.posDistrictId" placeholder="请选择区/县" size="mini" @change="districtChange">
                <el-option
                  v-for="item in districtOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学校类型">
              <el-select v-model="testItem.schoolTypeId" placeholder="请选择学校类型" size="mini" @change="schoolTypeChange">
                <el-option
                  v-for="item in schoolTypeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="testItem.schoolId" placeholder="请选择学校" size="mini" @change="getGrade">
                <el-option
                  v-for="item in schoolOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年级">
              <el-select v-model="testItem.gradeId" placeholder="请选择" @change="getClass" size="mini">
                <el-option
                  v-for="item in gradeOptions"
                  :key="item.gradeId"
                  :label="item.gradeName"
                  :value="item.gradeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级">
              <el-select v-model="testItem.classId" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in classOptions"
                  :key="item.dictClassId"
                  :label="item.dictClassName"
                  :value="item.dictClassId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="testItem.name" placeholder="请输入学生姓名" class="text-input" size="mini"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search(testItem)" class="btn" size="mini">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="reset(testItem)" class="btn" size="mini">重置</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="add" class="btn" size="mini" v-if="power.savePhysicalTestItemRecord">单个添加</el-button>
              <el-button type="primary" @click="testItemImport()" class="btn" size="mini" v-if="power.importPhysicalTestItemRecord">批量导入</el-button>
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
          prop="testItemReport"
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
          prop="gradeClassName"
          label="班级"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="体测时间"
          prop="healthTestTime">
        </el-table-column>
        <el-table-column
          label="操作" min-width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleView(scope.$index, scope.row)" class="btn" v-if="power.getPhysicalTestItemRecord">查看</el-button>
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)" class="btn" v-if="power.updatePhysicalTestItemRecord">编辑</el-button>
            <el-button
              size="mini" v-if="scope.row.shelvesStatus == 1 && power.shelvesPhysicalTestItemRecord"
              @click="handleOut(scope.$index, scope.row, 0)" class="btn">下架</el-button>
            <el-button
              size="mini" v-if="scope.row.shelvesStatus != 1 && power.shelvesPhysicalTestItemRecord"
              @click="handleOut(scope.$index, scope.row, 1)" class="btn" >上架</el-button>
            <el-button
              size="mini"
              @click="handleDelete(scope.$index, scope.row)" class="btn" v-if="power.deletePhysicalTestItemRecord">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="multi-action">
        <el-button type="primary" @click="updateBatch(0)" class="btn" size="mini" v-if="power.shelvesPhysicalTestItemRecord">批量下架</el-button>
        <el-button type="primary" @click="updateBatch(1)" class="btn" size="mini" v-if="power.shelvesPhysicalTestItemRecord">批量上架</el-button>
        <el-button type="primary" @click="deleteBatch" class="btn" size="mini" v-if="power.deletePhysicalTestItemRecord">批量删除</el-button>
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
  export default { name: 'TestItemList',
    methods: {
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
      reset(testItem) {
        testItem.gradeId = ''
        testItem.classId = ''
        testItem.name = ''
        testItem.posDistrictId = ''
        testItem.posCityId = ''
        testItem.posProvinceId = ''
        testItem.schoolId = ''
        testItem.schoolTypeId = ''
        var date = new Date()
        var diff = date.getFullYear() - 2008
        var month = date.getMonth()
        if (month >= 7) {
          diff++
        }
        testItem.schoolYear = (2007 + diff) + '-' + (2008 + diff)
        const list = testItem.schoolYear.split('-')
        if (list.length > 0) {
          testItem.schoolYearStart = list[0]
          testItem.schoolYearEnd = list[1]
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
      doSearch(testItem) {
        const search = {}
        if (testItem.schoolYear !== '') {
          search.schoolYear = testItem.schoolYear
        }
        if (testItem.gradeId !== '') {
          search.gradeId = testItem.gradeId
        }
        if (testItem.classId !== '') {
          search.classId = testItem.classId
        }
        if (testItem.name !== '') {
          search.name = testItem.name
        }
        if (testItem.posProvinceId !== '') {
          search.posProvinceId = testItem.posProvinceId
        }
        if (testItem.posCityId !== '') {
          search.posCityId = testItem.posCityId
        }
        if (testItem.posDistrictId !== '') {
          search.posDistrictId = testItem.posDistrictId
        }
        if (testItem.schoolId !== '') {
          search.schoolId = testItem.schoolId
        }
        search.pageNum = testItem.pageNum
        search.pageSize = testItem.pageSize
        this.$store.dispatch('GetTestItemList', search).then(response => {
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
        this.$confirm('确认删除体测报告？').then(_ => {
          this.$store.dispatch('DeleteTestItem', row.id).then(response => {
            this.doSearch(this.searchForm)
          })
        })
      },
      handleEdit(index, row) {
        this.routeLink = {
          path: '/testItemForm',
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
          var testItem = { 'id': row.id, 'shelvesStatus': status }
          this.$store.dispatch('UpdateSelves', testItem).then(response => {
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
      // 批量上下架
      updateBatch(status) {
        var msg = ''
        if (status === 1) {
          msg = '上架'
        } else {
          msg = '下架'
        }
        this.$confirm('确认' + msg + '？').then(_ => {
          var testItem = { 'ids': this.ids, 'shelvesStatus': status }
          this.$store.dispatch('UpdateBatchSelves', testItem).then(response => {
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
      deleteBatch() {
        var ids = { 'ids': this.ids }
        this.$confirm('确认删除体测报告？').then(_ => {
          this.$store.dispatch('DeleteBatchTestItem', ids).then(response => {
            this.doSearch(this.searchForm)
          })
        })
      },
      handleView(index, row) {
        this.routeLink = {
          path: '/testItemDetail',
          query: {
            id: row.id,
            type:row.bindingStatusValue
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
      add() {
        this.$router.push('/addTestItemForm')
      },
      getGrade() {
        this.getGradeOptions()
        this.testItem.gradeId = ''
        this.testItem.classId = ''
        this.classOptions = []
      },
      getGradeOptions() {
        this.$store.dispatch('GetGrade', { schoolId: this.testItem.schoolId }).then(response => {
          this.gradeOptions = response.data
        })
      },
      schoolYearChange() {
        this.testItem.classId = ''
        if (this.testItem.gradeId !== '') {
          this.getClass()
        }
        // this.getClass()
      },
      getClass() {
        this.testItem.classId = ''
        this.getClassOptions()
      },
      getClassOptions() {
        var data = {}
        data.schoolTypeGradeId = this.testItem.gradeId
        var list = this.testItem.schoolYear.split('-')
        if (list.length > 0) {
          data.schoolYearStart = list[0]
          data.schoolYearEnd = list[1]
        }
        data.schoolTypeId = this.testItem.schoolTypeId
        data.schoolId = this.testItem.schoolId
        this.$store.dispatch('GetClass', data).then(response => {
          if (response.data) {
            this.classOptions = response.data
          } else {
            this.classOptions = []
          }
        })
      },
      // 批量导入
      testItemImport() {
        this.$router.push({ path: '/testItemImport' })
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
        this.$store.dispatch('GetSchoolList', this.testItem).then(response => {
          this.schoolOptions = response.data
        })
      }
    },
    mounted() {
      this.schoolYearOptions = getSchoolYear()
      // this.testItem.schoolYear = this.schoolYearOptions[this.schoolYearOptions.length - 1].value
      this.testItem.schoolYear = this.schoolYearOptions[0].value
      this.search(this.testItem)
      this.getProvince()
      this.getSchoolType()
     /* setTimeout(() => {
        this.getCityOptions(this.testItem.posProvinceId)
      }, 200)
      setTimeout(() => {
        this.getDistrictOptions(this.testItem.posCityId)
      }, 600)*/
      this.getSchoolOptions()
      if (this.testItem.schoolId) {
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
      if (to.name === 'TestItemDetail' || to.name === 'TestItemForm' || to.name === 'AddTestItemForm') {
        var condition = JSON.stringify(this.searchForm)
        localStorage.setItem('testItemCondition', condition)
      } else {
        localStorage.removeItem('testItemCondition')
      }
      next()
    },
    created() {
      var condition = localStorage.getItem('testItemCondition')
      if (condition != null) {
        this.testItem = JSON.parse(condition)
      }
    },
    data() {
      return {
        power: {
          deletePhysicalTestItemRecord: false,
          savePhysicalTestItemRecord: false,
          getPhysicalTestItemRecord: false,
          updatePhysicalTestItemRecord: false,
          shelvesPhysicalTestItemRecord: false,
          importPhysicalTestItemRecord: false
        },
        powerArr: ['deletePhysicalTestItemRecord', 'savePhysicalTestItemRecord', 'getPhysicalTestItemRecord', 'updatePhysicalTestItemRecord', 'shelvesPhysicalTestItemRecord', 'importPhysicalTestItemRecord'],
        searchForm: {},
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
        testItem: {
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
        physicalModel: 2,
        list: [],
        multipleSelection: []
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
