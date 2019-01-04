/**
 * Created by xxxxtech on 2018/7/23.
 */
import { getGrade, getClass, getArea, getSchoolList, getSchoolType } from '@/api/common'
import { Message } from 'element-ui'
import { setInterval } from 'timers';

const common = {
  state: {
    totalNum: false, //总共问题反馈未回复的个数
    parentNum: false, //家长端问题反馈未回复的个数
    schoolNum: false //学校端问题反馈未回复的个数
  },
  actions: {
    // 获取年级列表
    GetGrade({ commit }, data) {
      return new Promise((resolve, reject) => {
        getGrade(data).then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            resolve(response)
          } else {
            Message({
              message: response.status.msg,
              type: 'error',
              duration: 2 * 1000
            })
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取年级列表
    GetClass({ commit }, data) {
      return new Promise((resolve, reject) => {
        getClass(data).then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            resolve(response)
          } else {
            Message({
              message: response.status.msg,
              type: 'error',
              duration: 2 * 1000
            })
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetArea({ commit }, data) {
      return new Promise((resolve, reject) => {
        getArea(data).then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            resolve(response)
          } else {
            Message({
              message: response.status.msg,
              type: 'error',
              duration: 2 * 1000
            })
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetSchoolList({ commit }, data) {
      return new Promise((resolve, reject) => {
        getSchoolList(data).then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            resolve(response)
          } else {
            Message({
              message: response.status.msg,
              type: 'error',
              duration: 2 * 1000
            })
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetSchoolType({ commit }) {
      return new Promise((resolve, reject) => {
        getSchoolType().then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            resolve(response)
          } else {
            Message({
              message: response.status.msg,
              type: 'error',
              duration: 2 * 1000
            })
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    problemFeedbackStatus(res,data){
      if(data.parentNum>0){
        this.state.Common.parentNum = true;
      }else{
        this.state.Common.parentNum = false;
      }
      if(data.totalNum>0){
        this.state.Common.totalNum = true;
      }else{
        this.state.Common.totalNum = false;
      }
      if(data.schoolNum>0){
        this.state.Common.schoolNum = true;
      }else{
        this.state.Common.schoolNum = false;
      }
    }
  }
}

export default common
