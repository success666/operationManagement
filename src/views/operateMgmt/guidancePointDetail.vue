<template>
    <div class="contain-vessel" 
        v-loading="loading"
        element-loading-text="拼命加载中">
      <el-row>
        <el-col :span="24">名称：{{ detail.name }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2">缩略图：</el-col>
        <el-col :span="20"><img :src="detail.coverUrl" alt=""></el-col>
      </el-row>
      <div class="sub-title">适合人群</div>
      <el-row>
        <el-col :span="12">年级：{{ grade }}</el-col>
        <el-col :span="12">性别：{{ sexArr[detail.sex] }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">身体状况：{{ bodyStatus }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">有无器材：{{ haveEquipment[detail.haveEquipment] }}</el-col>
      </el-row>
      <div class="sub-title">指导点属性</div>
      <el-row>
        <el-col :span="12">难度：{{ difficulty[detail.difficulty] }}</el-col>
        <el-col :span="12">身体部位：{{ bodyPart[detail.bodyPart] }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">场地：{{ place[detail.place] }}</el-col>
        <el-col :span="12">器材：{{ equipment }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span>关联素质：</span>
          <template v-for="(item,index) in detail.diathesisList" >
            <span>{{ diathesis[item.diathesisType] }}</span>
            <span>{{ item.weight + '%' }}</span>；
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">单个动作锻炼时长：{{ detail.perActionTime }}秒</el-col>
        <el-col :span="12">锻炼数：{{ detail.exerciseGroupNo }}组 每组{{ detail.groupValue }}{{ groupUnit[detail.groupUnit] }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">练习间隔：{{ detail.exerciseIntervalTime }}秒</el-col>
        <el-col :span="12">组间间隔：{{ detail.groupAmongIntervalTime }}秒</el-col>
      </el-row>
      <div class="sub-title">指导点内容</div>
      <el-row>
        <el-col :span="24">运动目的：{{ detail.exercisePurpose }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2">动作描述：</el-col>
        <el-col style="border: 1px solid #ccc;" :span="22" v-html="detail.actionDescription"></el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span style="vertical-align: top">视频：</span>
          <video :src="detail.videoUrl" controls></video>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span style="vertical-align: middle; display: inline-block">音频：</span>
          <audio style="vertical-align: middle" :src="detail.audioUrl" controls></audio>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">动作图：</el-col>
        <el-col :span="20"><img :src="detail.actionUrl" alt=""></el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span style="vertical-align: top">片头：</span>
          <video :src="detail.vedioHeadUrl" controls></video>
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
      this.sexArr[3]="男;女";
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
        loading:false,
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
        apparatus: []
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
        const id = this.$route.query.id;
        return request.get(`/api/auth/v1/guidancePoint/${id}`)
      },
    },
    computed: {
      bodyStatus() {
        const arr = this.detail.bodyCondition ? this.detail.bodyCondition.split(',') : [];
        let text = '';
        arr.forEach((item, idx) => {
          text = `${text}${idx === 0 ? '' : '、'}${this.bodyCondition[item]}`
        })
        return text;
      },
      equipment() {
        const arr = this.detail.apparatusIds ? this.detail.apparatusIds.split(',') : [];
        let apparatusObj = {};
        this.apparatus.forEach((item, idx) => {
          apparatusObj[item.id] = item.name
        })
        let text = '';
        arr.forEach((item, idx) => {
          text = `${text}${idx === 0 ? '' : '、'}${apparatusObj[item]}`
        })
        return text;
      },
      grade() {
        if(!this.detail.gradeStr) return;
        const arr = this.detail.gradeStr;
        let gradeObj = {};
        this.gradeId.forEach((item, idx) => {
          gradeObj[item.code] = item.name
        })
        let text = '';
        if(!arr) return;
        arr.forEach((item, idx) => {
          text = `${text}${idx === 0 ? '' : '、'}${gradeObj[item]}`
        })
        return text;
      }
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
