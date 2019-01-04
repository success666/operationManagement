<template>
    <div class="contain-vessel">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="ke-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input size="small" v-model="ruleForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="缩略图" prop="coverUrl">
          <Upload
            :verifyUrl="'/api/auth/v1/oss/policy?dir=guidancePoint'"
            :tip="'请上传180x130的图片,大小不超过100KB'"
            :buttonText="'上传图片'"
            :accept="'image/*'"
            :VerifyFile="VerifyCoverUrl"
            :fileList="ruleForm.coverList"
            @coverUrl="onCoverUrl"
          ></Upload>
        </el-form-item>
        <div class="sub-title">适合人群</div>
        <el-form-item label="年级" class="inline-form" prop="gradeId">
          <el-select size="small"
            v-model="ruleForm.gradeId"
            multiple
          >
            <el-option
              v-for="item in gradeId"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >

            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" class="inline-form" prop="sex">
          <el-select size="small"
            v-model="ruleForm.sex"
          >
            <el-option
              v-for="(value, key) in sexArr"
              :key="key"
              :label="value"
              :value="key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身体状况" prop="bodyCondition">
          <el-select size="small"
            v-model="ruleForm.bodyCondition"
            multiple
          >
            <el-option
              v-for="(value, key) in bodyCondition"
              :key="key"
              :label="value"
              :value="key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有无器材" prop="haveEquipment">
          <el-select size="small"
            v-model="ruleForm.haveEquipment"
            @change="changeValue"
          >
            <el-option
              v-for="(value, key) in haveEquipment"
              :key="key"
              :label="value"
              :value="key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div class="sub-title">指导点属性</div>
        <el-form-item label="难度" class="inline-form" prop="difficulty">
          <el-select size="small"
            v-model="ruleForm.difficulty"
          >
            <el-option
              v-for="(value, key) in difficultys"
              :key="key"
              :label="value"
              :value="key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身体部位" class="inline-form" prop="bodyPart">
          <el-select size="small"
            v-model="ruleForm.bodyPart"
          >
            <el-option
              v-for="(value, key) in bodyPart"
              :key="key"
              :label="value"
              :value="key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场地" class="inline-form" prop="place">
          <el-select size="small"
            v-model="ruleForm.place"
          >
            <el-option
              v-for="(value, key) in place"
              :key="key"
              :label="value"
              :value="key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="器材" class="inline-form" prop="apparatusIds">
          <el-select size="small"
            v-model="ruleForm.apparatusIds"
            multiple
            @change="changeAppar"
          >
            <el-option
              v-for="item in apparatus"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >

            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联素质及权重" label-width="125px" prop="diathesis">
          <el-form-item
            v-for="(item, idx) in dynamicQuality"
            style="margin-bottom: 10px"
            :key="idx"
            :rules="{required: true, message: '请填写', trigger: 'blur'}"
          >
            <el-select size="small"
              v-model="item.diathesisType"
            >
              <el-option
                v-for="(value, key) in diathesis"
                :key="key"
                :label="value"
                :value="key"
              >
              </el-option>
            </el-select>
            <el-input size="small" v-model="item.weight" placeholder="请填写权重分,总权重为100" style="width: 220px;"></el-input>
            <a :class="[idx == 0 ? 'el-icon-circle-plus-outline' : 'el-icon-remove-outline']" @click="addRemoveQuality(item, idx)"></a>
          </el-form-item>
        </el-form-item>
        <el-form-item label="单个动作锻炼时长" label-width="135px" prop="perActionTime">
          <el-input size="small" v-model="ruleForm.perActionTime" style="width: 220px;"></el-input>
          <span>秒</span>
        </el-form-item>
        <el-form-item label="锻炼数" class="inline-form" prop="exerciseGroupNo">
          <el-input size="small" v-model="ruleForm.exerciseGroupNo" style="width: 220px;"></el-input>
          <span>组</span>
        </el-form-item>
        <el-form-item label="每组" class="inline-form" prop="groupTime">
          <el-input size="small" v-model="ruleForm.groupTime" style="width: 220px;"></el-input>
          <el-select size="small"
            v-model="ruleForm.groupUnit"
            placeholder="单位"
            style="width: 100px;"
          >
            <el-option
              v-for="(value, key) in groupUnit"
              :key="key"
              :label="value"
              :value="key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div>
          <el-form-item label="练习间隔" class="inline-form" prop="exerciseIntervalTime">
            <el-input size="small" v-model="ruleForm.exerciseIntervalTime" style="width: 220px;"></el-input>
            <span>秒</span>
          </el-form-item>
          <el-form-item label="组间间隔" class="inline-form" prop="groupAmongIntervalTime">
            <el-input size="small" v-model="ruleForm.groupAmongIntervalTime" style="width: 220px;"></el-input>
            <span>秒</span>
          </el-form-item>
        </div>
        <div class="sub-title">指导点内容</div>
        <el-form-item label="运动目的" prop="exercisePurpose">
          <el-input size="small" v-model="ruleForm.exercisePurpose"></el-input>
        </el-form-item>
        <el-form-item label="运动描述" prop="actionDescription" class="form-ue">
          <Ueditor :content=ueContent :config=ueConfig :id="ueId" ref="ueditor"></Ueditor>
        </el-form-item>
        <el-form-item label="视频" prop="videoUrl">
          <UploadVideo
            :verifyUrl="'/api/auth/v1/oss/policy?dir=guidancePoint'"
            :tip="'请上传大小不超过100M，mp4格式的视频'"
            :buttonText="'上传视频'"
            :accept="'video/mp4'"
            :VerifyFile="VerifyVideo"
            :dataSrc="ruleForm.videoUrl"
            @uploadUrl="onVideoUrl"
          ></UploadVideo>
        </el-form-item>
        <el-form-item label="音频" prop="audioUrl">
          <UploadAudio
            :verifyUrl="'/api/auth/v1/oss/policy?dir=guidancePoint'"
            :tip="'请上传大小不超过10M，mp3格式的音频'"
            :buttonText="'上传音频'"
            :accept="'audio/mp3'"
            :VerifyFile="VerifyAudio"
            :dataSrc="ruleForm.audioUrl"
            @uploadUrl="onAudioUrl"
          ></UploadAudio>
        </el-form-item>
        <el-form-item label="动作图" prop="gifUrl">
          <Upload
            :verifyUrl="'/api/auth/v1/oss/policy?dir=guidancePoint'"
            :tip="'请上传大小不超过10M,gif格式的动图'"
            :buttonText="'上传图片'"
            :accept="'image/gif'"
            :VerifyFile="VerifyGifUrl"
            :fileList="ruleForm.coverList"
            @coverUrl="onGifUrl"
          ></Upload>
        </el-form-item>
        <el-form-item label="片头" prop="titleUrl">
          <UploadVideo
            :verifyUrl="'/api/auth/v1/oss/policy?dir=guidancePoint'"
            :tip="'请上传大小不超过100M，mp4格式的视频'"
            :buttonText="'上传视频'"
            :accept="'video/mp4'"
            :VerifyFile="VerifyVideo"
            :dataSrc="ruleForm.titleUrl"
            @uploadUrl="onTitleUrl"
          ></UploadVideo>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveForm">保存</el-button>
          <el-button @click="goback">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import request from '@/utils/request'
  import { BODYCONDITION, HAVEEQUIPMENT, PLACE, DIATHESIS, GROUPUNIT } from '@/utils/comData'
  import Upload from '@/components/common/upload'
  import UploadVideo from '@/components/common/uploadVideo'
  import UploadAudio from '@/components/common/uploadAudio'
  import Ueditor from '@/components/ueditor/ueditor';

  export default {
    components: {
      Upload,
      UploadVideo,
      UploadAudio,
      Ueditor
    },
    created() {
      this.getGradeUnion();
      this.getApparatus();
    },
    data() {
      const validateCoverUrl = (rule, value, callback) => {
        this.ruleForm.coverUrl ? callback() : callback(new Error('请输入缩略图'))
      }
      const validateVideoUrl = (rule, value, callback) => {
        this.ruleForm.videoUrl ? callback() : callback(new Error('请输入视频'))
      }
      const validateAudioUrl = (rule, value, callback) => {
        this.ruleForm.audioUrl ? callback() : callback(new Error('请输入音频'))
      }
      const validateGifUrl = (rule, value, callback) => {
        this.ruleForm.gifUrl ? callback() : callback(new Error('请输入gif'))
      }
      const validateTitleUrl = (rule, value, callback) => {
        this.ruleForm.titleUrl ? callback() : callback(new Error('请输入片头'))
      }
      const validateDiathesis = (rule, value, callback) => {
        let allWeight = 0;
        const DynamicQuality = this.dynamicQuality;
        for (let i = 0; i < DynamicQuality.length; i++) {
          allWeight = allWeight + parseInt(DynamicQuality[i].weight);
          if (!DynamicQuality[i].diathesisType) {
            callback(new Error('请选择关联素质'))
          }
        }
        if (allWeight != 100) {
          callback(new Error('权重总分为100'))
        } else {
          callback()
        }
      }
      const validateAcDescrip = (rule, value, callback) => {
        const content = this.$refs.ueditor.getContent();
        if (!content) {
          callback(new Error('请输入详细运动描述'))
        } else {
          callback()
        }
      }
      const validateGroupTime = (rule, value, callback) => {
        if (!this.ruleForm.groupTime) {
          callback(new Error('请输入'))
        } else if (!this.ruleForm.groupUnit) {
          callback(new Error('请输入单位'))
        } else {
          callback()
        }
      }
      return {
        ruleForm: {
          name: '',
          videoUrl: '',
          haveEquipment: '',
          audioUrl: '',
          gifUrl: '',
          titleUrl: '',
          coverList: [],
          coverUrl: '',
          apparatusIds: [],
          bodyCondition: []
        },
        rules: {
          name: [
            { required: true, message: '请输入指导点名称', trigger: 'blur' }
          ],
          coverUrl: [
            { required: true, validator: validateCoverUrl }
          ],
          gradeId: [
            { required: true, message: '请输入年级', trigger: 'change' }
          ],
          sex: [
            { required: true, message: '请输入性别', trigger: 'change' }
          ],
          // bodyCondition: [
          //   { required: true, message: '请输入身体状况', trigger: 'change' }
          // ],
          haveEquipment: [
            { required: true, message: '请输入', trigger: 'change' }
          ],
          difficulty: [
            { required: true, message: '请输入难度', trigger: 'change' }
          ],
          bodyPart: [
            { required: true, message: '请输入身体部位', trigger: 'change' }
          ],
          place: [
            { required: true, message: '请输入场地', trigger: 'change' }
          ],
          apparatusIds: [
            { required: true, message: '请输入器材', trigger: 'change' }
          ],
          diathesis: [
            { required: true, validator: validateDiathesis }
          ],
          perActionTime: [
            { required: true, message: '请输入单个动作锻炼时长', trigger: 'blur' }
          ],
          exerciseGroupNo: [
            { required: true, message: '请输入锻炼数', trigger: 'blur' }
          ],
          groupTime: [
            { required: true, validator: validateGroupTime }
          ],
          exerciseIntervalTime: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          groupAmongIntervalTime: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          exercisePurpose: [
            { required: true, message: '请输入运动目的', trigger: 'blur' }
          ],
          videoUrl: [
            { required: true, validator: validateVideoUrl }
          ],
          audioUrl: [
            { required: true, validator: validateAudioUrl }
          ],
          gifUrl: [
            { required: true, validator: validateGifUrl }
          ],
          titleUrl: [
            { required: false, validator: validateTitleUrl }
          ],
          actionDescription: [
            { required: true, validator: validateAcDescrip }
          ]
        },
        gradeId: [],
        bodyPart: {
          1: '上肢',
          2: '下肢',
          3: '躯干',
          4: '综合'
        },
        sexArr: {
          1: '男',
          2: '女',
          3: '全部'
        },
        difficultys: {
          1: '高',
          2: '中',
          3: '低'
        },
        bodyCondition: BODYCONDITION,
        haveEquipment: HAVEEQUIPMENT,
        place: PLACE,
        diathesis: DIATHESIS,
        groupUnit: GROUPUNIT,
        dynamicQuality: [{
          diathesisType: '',
          weight: 0
        }],
        ueConfig: {
          autoHeight: false,
          wordCount: false
        },
        ueContent: '',
        ueId: 'ue',
        apparatus: [],
        beforeApparatus:[]
      }
    },
    methods: {
      getGradeUnion() {
        request.get('/api/auth/v1/gradeUnion').then((res) => {
          this.gradeId = res.data;
        })
      },
      changeValue(value){
        this.ruleForm.apparatusIds=[];
        let beforeApparatus=JSON.parse(this.beforeApparatus);
        if(value==0){
          this.apparatus=[{id:1,name:"无器械"}]
          this.ruleForm.apparatusIds=[1];
        }else{
          this.apparatus=beforeApparatus.filter((item)=>{
            return item.name!="无器械"
          })
        }
      },
      changeAppar(value){
        if(value[value.length-1]!=1){
          value=value.filter((item)=>{
            return item!=1;
          })
          this.ruleForm.haveEquipment="1";
        }else{
          value=["1"];
          this.ruleForm.haveEquipment="0";
        }
        this.ruleForm.apparatusIds=value;
      },
      getApparatus() {
        request.get('/api/auth/v1/guidancePoint/apparatus').then((res) => {
          this.apparatus = res.data;
          this.beforeApparatus=JSON.stringify(res.data);
        })
      },
      addRemoveQuality(item, idx) {
        if (idx == 0) {
          if (this.dynamicQuality.length === 6) {
            return
          }
          this.dynamicQuality.push({
            diathesisType: '',
            weight: ''
          })
        } else {
          const index = this.dynamicQuality.indexOf(item)
          if (index !== -1) {
            this.dynamicQuality.splice(index, 1)
          }
        }
      },
      VerifyCoverUrl(file) {
        const imgFile = file
        const _URL = window.URL || window.webkitURL
        const _self = this
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.src = _URL.createObjectURL(imgFile)
          img.onload = function() {
            if (imgFile.size / 1024 < 100 && this.width === 180 && this.height === 130) {
              resolve(true)
            } else {
              _self.$message({
                type: 'error',
                message: '缩略图请上传180x130的图片,大小不超过100KB!'
              })
              reject(false)
            }
          }
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
      VerifyAudio(file) {
        const isLimit = file.size / 1024 / 1024 < 10;
        if (!isLimit) {
          this.$message({
            type: 'error',
            message: '请上传大小不超过10M，mp3格式的音频!'
          })
        };
        return isLimit;
      },
      VerifyGifUrl(file) {
        const isLimit = file.size / 1024 / 1024 < 10;
        if (!isLimit) {
          this.$message({
            type: 'error',
            message: '请上传大小不超过10M,gif格式的动图!'
          })
        };
        return isLimit;
      },
      onCoverUrl(data) {
        this.ruleForm.coverUrl = data;
      },
      onGifUrl(data) {
        this.ruleForm.gifUrl = data;
      },
      onVideoUrl(data) {
        this.ruleForm.videoUrl = data;
      },
      onAudioUrl(data) {
        this.ruleForm.audioUrl = data;
      },
      onTitleUrl(data) {
        this.ruleForm.titleUrl = data;
      },
      saveForm() {
        const ruleForm = this.ruleForm || {};
        const content = this.$refs.ueditor.getContent();
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            request.post('/api/auth/v1/guidancePoint', {
              name: ruleForm.name,
              coverUrl: ruleForm.coverUrl,
              gradeIds: ruleForm.gradeId,
              sex: ruleForm.sex,
              bodyCondition: ruleForm.bodyCondition.join(','),
              haveEquipment: ruleForm.haveEquipment,
              difficulty: ruleForm.difficulty,
              bodyPart: ruleForm.bodyPart,
              place: ruleForm.place,
              apparatusIds: ruleForm.apparatusIds.join(','),
              perActionTime: ruleForm.perActionTime,
              diathesis: this.dynamicQuality,
              exerciseGroupNo: ruleForm.exerciseGroupNo,
              groupValue: ruleForm.groupTime,
              exerciseIntervalTime: ruleForm.exerciseIntervalTime,
              groupAmongIntervalTime: ruleForm.groupAmongIntervalTime,
              exercisePurpose: ruleForm.exercisePurpose,
              videoUrl: ruleForm.videoUrl,
              audioUrl: ruleForm.audioUrl,
              actionUrl: ruleForm.gifUrl,
              vedioHeadUrl: ruleForm.titleUrl,
              actionDescription: content,
              groupUnit: ruleForm.groupUnit
            }).then((res) => {
              this.$router.push({
                path: `/guidancePoint/guidancemgmt`
              })
            })
          }
        })
      },
      goback() {
        this.$router.go(-1);
      }
    },
  }
</script>

<style scoped>
  .inline-form {
    display: inline-block;
    margin-right: 20px;
  }
  .el-icon-circle-plus-outline {
    font-size: 27px;
    vertical-align: middle;
    color: #606266;
  }
  .el-icon-remove-outline {
    font-size: 27px;
    vertical-align: middle;
    color: #606266;
  }
  .el-upload__tip {
    color: red;
  }
  .sub-title {
    border-top: 1px solid #ccc;
    margin: 11px;
    padding-top: 13px;
    font-weight: bold;
  }

</style>
