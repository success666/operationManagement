/**
 * Created by xxxxtech on 2018/7/23
 */
import request from '@/utils/request'

// 获取年级列表
export function getGrade(param) {
  return request({
    url: '/api/auth/v1/school/grade',
    method: 'get',
    params: param
  })
}
// 获取班级列表
export function getClass(data) {
  return request({
    url: '/api/auth/v1/school/class',
    method: 'get',
    params: data
  })
}
// 获取省市区
export function getArea(param) {
  return request({
    url: '/api/auth/v1/chinaArea/' + param,
    method: 'get'
  })
}
// 获取学校类型
export function getSchoolType() {
  return request({
    url: '/api/auth/v1/school/type',
    method: 'get'
  })
}
// 获取学校列表
export function getSchoolList(param) {
  return request({
    url: '/api/auth/v1/school/list',
    method: 'get',
    params: param
  })
}
