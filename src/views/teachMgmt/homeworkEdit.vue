<template>
  <div class="contain-vessel homeWorkEdit">
    <el-form
    v-loading="loading"
    element-loading-text="拼命加载中"
    :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="ke-ruleForm">
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" auto-complete="off" size="small"></el-input>
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
      <el-form-item label="练习量" class="inline-form" prop="exerciseGroupNo">
        <el-input v-model="ruleForm.exerciseGroupNo" style="width: 202px;" size="small"></el-input>
        <span>组</span>
      </el-form-item>
      <el-form-item label="每组" class="inline-form" prop="groupTime">
        <el-input v-model="ruleForm.groupTime" style="width: 220px;" size="small"></el-input>
        <el-select size="small"
          v-model="ruleForm.groupTimeUnit"
          placeholder="单位"
          style="width: 100px;"
        >
          <el-option
            v-for="(value, key) in groupTimeUnit"
            :key="key"
            :label="value"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="年级" class="inline-form" prop="gradeId">
          <el-select size="small" class="itemValue"
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
          <el-select size="small" class="itemValue"
            v-model="ruleForm.sex"
            @change="changeValue"
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
        <el-form-item label="难度" class="inline-form" prop="difficulty">
          <el-select size="small" class="itemValue"
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
        <el-form-item label="运动项目" class="inline-form" >
          <el-select size="small" class="itemValue"
            v-model="ruleForm.sportItemIds"
            multiple
            @change="sportItemChange"
          >
            <el-option
              v-for="item in sportItem"
              :key="String(item.id)"
              :label="item.name"
              :value="String(item.id)"
            >
            </el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="关联素质" class="inline-form" prop="diathesis">
        <el-select size="small" class="itemValue"
          v-model="ruleForm.diathesis"
          multiple
        >
          <el-option
            v-for="(value, key) in diathesis"
            :key="key"
            :label="value"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="身体部位" class="inline-form" prop="bodyPart">
        <el-select size="small" class="itemValue"
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
        <el-form-item label="身体状况" class="inline-form" prop="bodyCondition">
          <el-select size="small" class="itemValue"
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
        <el-form-item label="器材" class="inline-form" prop="apparatusIds">
          <el-select size="small" class="itemValue"
            v-model="ruleForm.apparatusIds"
            multiple
          >
            <el-option
              v-for="item in apparatus"
              :key="String(item.id)"
              :label="item.name"
              :value="String(item.id)"
            >

            </el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="动作描述" prop="actionDescription" class="form-ue">
        <Ueditor :content=ueContent :config=ueConfig :id="ueId" ref="ueditor"></Ueditor>
      </el-form-item>
      <el-form-item label="教学视频" prop="videoUrl">
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
      <el-form-item>
        <el-button type="primary" @click="saveForm">保存</el-button>
        <el-button @click="goback">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import { BODYPART, SEXARR, DIFFICULTY, BODYCONDITION, HAVEEQUIPMENT, PLACE, DIATHESIS, HOMEGROUPUNIT } from '@/utils/comData'
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
      this.loading=true;
      this.sexArr[3]="男;女";
      this.ueContent = ''
      this.$ajax.all([this.getGradeUnion(), this.getData(), this.getApparatus(), this.getSportItem()])
        .then(this.$ajax.spread((res1, res2, res3, res4) => {
          this.loading=false;
          const resData2 = res2.data;
          this.gradeId = res1.data;
          this.ruleForm.name = resData2.name;
          this.ruleForm.coverUrl = resData2.coverUrl;
          this.ruleForm.gradeId = resData2.gradeIds;
          this.ruleForm.sex = String(resData2.sex);
          if(resData2.bodyCondition){
            this.ruleForm.bodyCondition = resData2.bodyCondition && resData2.bodyCondition.split(',');
          }
          this.ruleForm.difficulty = String(resData2.difficulty);
          this.ruleForm.bodyPart = String(resData2.bodyParts);
          this.ruleForm.apparatusIds = resData2.apparatusIds && resData2.apparatusIds.split(',');
          this.ruleForm.diathesis = resData2.quality.split(',');
          this.ruleForm.exerciseGroupNo = resData2.exerciseGroupNo;
          this.ruleForm.groupTime = resData2.groupTime;
          this.ruleForm.groupTimeUnit = String(resData2.groupTimeUnit);
          this.ruleForm.coverUrl = resData2.thumbnailUrl;
          this.ruleForm.coverList.push({url: resData2.thumbnailUrl});
          this.ruleForm.videoUrl = resData2.teachingVideoUrl;
          this.ruleForm.sportItemIds = resData2.sportItemIds.split(',');
          this.ruleForm.sportItemNames = resData2.sportItemNames;
          this.ueContent = resData2.actionDescription;
          this.apparatus = res3.data;
          this.sportItem = res4.data;
        })).catch(()=>{
          this.loading=false;
        })
    },
    data() {
      const validateCoverUrl = (rule, value, callback) => {
        this.ruleForm.coverUrl ? callback() : callback(new Error('请输入缩略图'))
      }
      const validateVideoUrl = (rule, value, callback) => {
        this.ruleForm.videoUrl ? callback() : callback(new Error('请输入视频'))
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
        } else if (!this.ruleForm.groupTimeUnit) {
          callback(new Error('请输入单位'))
        } else {
          callback()
        }
      }
      return {
        loading:false,
        ruleForm: {
          name: '',
          videoUrl: '',
          coverList: [],
          coverUrl: '',
          place: '',
          difficulty: '',
          bodyPart: '',
          groupUnit: '',
          sex: '',
          groupTimeUnit: '',
          bodyCondition:[],
          sportItemIds: [],
          sportItemName: []
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          coverUrl: [
            { required: true, validator: validateCoverUrl }
          ],
          exerciseGroupNo: [
            { required: true, message: '请输入练习量', trigger: 'blur' }
          ],
          groupTime: [
            { required: true, validator: validateGroupTime }
          ],
          gradeId: [
            { required: true, message: '请输入年级', trigger: 'change' }
          ],
          sex: [
            { required: true, message: '请输入性别', trigger: 'change' }
          ],
          haveEquipment: [
            { required: true, message: '请输入', trigger: 'change' }
          ],
          difficulty: [
            { required: true, message: '请输入难度', trigger: 'change' }
          ],
          bodyPart: [
            { required: true, message: '请输入身体部位', trigger: 'change' }
          ],
          apparatusIds: [
            { required: true, message: '请输入器材', trigger: 'change' }
          ],
          diathesis: [
            { required: true, message: '请输入关联素质', trigger: 'change' }
          ],
          sportItemIds: [
            { required: true, message: '请输入运动项目', trigger: 'change' }
          ],
          videoUrl: [
            { required: true, validator: validateVideoUrl }
          ],
          actionDescription: [
            { required: true, validator: validateAcDescrip }
          ]
        },
        gradeId: [],
        bodyPart: BODYPART,
        sexArr: SEXARR,
        // difficulty: DIFFICULTY,
        difficultys: {
          1: '高',
          2: '中',
          3: '低'
        },
        bodyCondition: BODYCONDITION,
        haveEquipment: HAVEEQUIPMENT,
        place: PLACE,
        diathesis: DIATHESIS,
        groupTimeUnit: HOMEGROUPUNIT,
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
        sportItem: [
          { id: 1, name: '教育部' },
          { id: 2, name: '省级' },
          { id: 3, name: '市级' },
          { id: 4, name: '区级' }
        ]
      }
    },
    methods: {
      sportItemChange(value) {
        let nameArr = [];
        for (let i = 0, len = value.length; i < len; i++) {
          let item = this.sportItem.filter((item) => {
            if (item.id == value[i]) {
              nameArr.push(item.name)
            }
          })
        }
        this.ruleForm.sportItemNames = nameArr.join(',');
      },
      getGradeUnion() {
        return request.get('/api/auth/v1/gradeUnion')
      },
      getApparatus() {
        return request.get('/api/auth/v1/guidancePoint/apparatus')
      },
      getSportItem() {
        return request.get(`/api/auth/v1/sportItem/category`)
      },
      getData() {
        const id = this.$route.query.id;
        return request.get(`/api/auth/v1/homeworkLib/${id}`)
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
      onCoverUrl(data) {
        this.ruleForm.coverUrl = data;
      },
      onVideoUrl(data) {
        this.ruleForm.videoUrl = data;
      },
      saveForm() {
        const ruleForm = this.ruleForm || {};
        const id = this.$route.query.id;
        const content = this.$refs.ueditor.getContent();
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            request.post(`/api/auth/v1/homeworkLib/${id}`, {
              id: id,
              name: ruleForm.name,
              thumbnailUrl: ruleForm.coverUrl,
              exerciseGroupNo: ruleForm.exerciseGroupNo,
              groupTime: ruleForm.groupTime,
              groupTimeUnit: ruleForm.groupTimeUnit,
              gradeIds: ruleForm.gradeId,
              sex: ruleForm.sex,
              difficulty: ruleForm.difficulty,
              sportItemIds: ruleForm.sportItemIds.join(','),
              sportItemNames: ruleForm.sportItemNames,
              quality: ruleForm.diathesis.join(','),
              bodyParts: ruleForm.bodyPart,
              bodyCondition: ruleForm.bodyCondition.join(','),
              apparatusIds: ruleForm.apparatusIds.join(','),
              actionDescription: content,
              teachingVideoUrl: ruleForm.videoUrl,
            }).then((res) => {
              this.$router.push({
                path: `/homeworkLib/homeworkmgmt`
              })
            })
          }
        })
      },
      goback() {
        this.$router.go(-1);
      },
      changeValue(value){
        console.log(value);
      }
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped >
.homeWorkEdit{
  .el-form{
    font-size: 0px;
    .inline-form {
      display: inline-block;
      margin-right: 20px;
      min-width: 300px;
    }
    .itemValue{
      width: 100%;
    }

    .el-select__tags{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
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
