<template>
    <div class="contain-vessel"
    v-loading="loading"
    element-loading-text="拼命加载中">
      <el-row>
        <el-col :span="24">作业点名称：{{ detail.name }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2">缩略图：</el-col>
        <el-col :span="20"><img :src="detail.thumbnailUrl" alt=""></el-col>
      </el-row>
      <div class="sub-title">适合人群</div>
      <el-row>
        <el-col :span="12">练习量：{{ detail.exerciseGroupNo }}组</el-col>
        <el-col :span="12">每组：{{ detail.groupTime }}
          <span v-if="detail.groupTimeUnit===1">次</span>
          <span v-if="detail.groupTimeUnit===2">秒</span>
          <span v-if="detail.groupTimeUnit===3">分</span>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="12">年级：{{ detail.gradeNames }}</el-col>
        <el-col :span="12">性别：{{ detail.sexName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">难度：{{ detail.difficultyName }}</el-col>
        <el-col :span="12">运动项目：{{ detail.sportItemNames }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">关联素质：{{ detail.qualityName }}</el-col>
        <el-col :span="12">身体部位：{{ detail.bodyPartsName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">身体状况：{{ detail.bodyConditionName }}</el-col>
        <el-col :span="12">器械：{{ detail.apparatusNames }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2">动作描述：</el-col>
        <el-col style="border: 1px solid #ccc;" :span="22" v-html="detail.actionDescription"></el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span style="vertical-align: top">教学视频：</span>
          <video :src="detail.teachingVideoUrl" controls></video>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import request from '@/utils/request'
  import { BODYPART, SEXARR, DIFFICULTY, BODYCONDITION, HAVEEQUIPMENT, PLACE, DIATHESIS, GROUPUNIT } from '@/utils/comData'

  export default {
    created() {
      this.loading=true;
      this.$ajax.all([this.getGradeUnion(), this.getData(), this.getApparatus()])
        .then(this.$ajax.spread((res1, res2, res3) => {
          this.loading=false;
          this.gradeId = res1.data;
          this.detail = res2.data;
          this.apparatus = res3.data;
        })).catch(()=>{
          this.loading=false;
        })
    },
    data() {
      return {
        bodyPart: BODYPART,
        sexArr: SEXARR,
        difficulty: DIFFICULTY,
        bodyCondition: BODYCONDITION,
        haveEquipment: HAVEEQUIPMENT,
        place: PLACE,
        diathesis: DIATHESIS,
        groupUnit: GROUPUNIT,
        detail: {},
        gradeId: [],
        apparatus: [],
        loading:false
      }
    },
    methods: {
      getGradeUnion() {
        return request.get('/api/auth/v1/gradeUnion')
      },
      getApparatus() {
        return request.get('/api/auth/v1/guidancePoint/apparatus')
      },
      getData() {
        console.log(this.groupUnit);
        const id = this.$route.query.id;
        return request.get(`/api/auth/v1/homeworkLib/${id}`)
      },
    },
    computed: {

    }
  }
</script>

<style scoped>
  * {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
  }
  img {
    max-width: 400px;
    max-height: 300px;
  }
  video {
    width: 300px;
  }
  .el-row {
    margin-bottom: 15px;
  }
  .sub-title {
    border-top: 1px solid #ccc;
    margin: 11px 0 21px;
    padding-top: 13px;
    font-weight: 700;
  }
</style>
