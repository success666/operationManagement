/**
 * Created by xxxxtech on 2018/7/17.
 */
import request from '@/utils/request'
// 体测列表
export function getTestItemList(testItem) {
  return request({
    url: '/api/auth/v1/physical/testItem',
    method: 'get',
    params: testItem
  })
}

// 删除体测报告
export function deleteTestItem(id) {
  return request({
    url: '/api/auth/v1/physical/testItem/' + id,
    method: 'delete',
    params: { }
  })
}

// 体测报告上下架
export function updateSelves(testItem) {
  return request({
    url: '/api/auth/v1/physical/testItem/updateSelves',
    method: 'post',
    data: testItem
  })
}

// 体测详情
export function getTestItemDetail(testItem) {
  return request({
    url: '/api/auth/v1/physical/testItem/' + testItem.id,
    method: 'get'
  })
}
// 获取体测项目
export function getTestItem(testItem) {
  return request({
    url: '/api/auth/v1/physical/testItem/item',
    method: 'get',
    params: testItem
  })
}

// 体测详情
export function getHealthItemDetail(healthItem) {
  return request({
    url: '/api/auth/v1/physical/health/' + healthItem.id,
    method: 'get'
  })
}

// 获取体检列表
export function getHealthList(health) {
  return request({
    url: '/api/auth/v1/physical/health',
    method: 'get',
    params: health
  })
}
// 删除体检报告
export function deleteHealthItem(id) {
  return request({
    url: 'api/auth/v1/physical/health/' + id,
    method: 'delete',
    params: { }
  })
}

// 体检报告上下架
export function updateHealthSelves(health) {
  return request({
    url: '/api/auth/v1/physical/health/updateSelves',
    method: 'post',
    data: health
  })
}
// 新增体测报告
export function addTestItem(testItem) {
  return request({
    url: '/api/auth/v1/physical/testItem/' + testItem.id,
    method: 'post',
    data: testItem
  })
}
// 批量删除体测项目
export function deleteBatchTestItem(ids) {
  return request({
    url: '/api/auth/v1/physical/testItem/deleteBatch',
    method: 'delete',
    params: ids
  })
}
// 批量上下架体测记录
export function updateBatchSelves(data) {
  return request({
    url: '/api/auth/v1/physical/testItem/updateBatchSelves',
    method: 'post',
    data: data
  })
}
// 批量删除体检
export function deleteBatchHealth(ids) {
  return request({
    url: '/api/auth/v1/physical/health/deleteBatch',
    method: 'delete',
    params: ids
  })
}
// 批量上下架体检记录
export function updateBatchHealth(data) {
  return request({
    url: '/api/auth/v1/physical/health/updateBatchSelves',
    method: 'post',
    data: data
  })
}
// 新增体检报告
export function addHealth(health) {
  return request({
    url: '/api/auth/v1/physical/health/' + health.id,
    method: 'post',
    data: health
  })
}
// 获取下载模版,
//  type: 1 体测
//  type: 2 体检
export function downTemplate(type) {
  var downloadUrl = ''
  switch (type) {
    case 1: {
      return request({
        url: '/api/auth/v1/physical/testItem/downTemplate',
        method: 'get',
        data: {}
      })
    }
    case 2: {
      return request({
        url: '/api/auth/v1/physical/health/downTemplate',
        method: 'get',
        data: {}
      })
    }
  }
  return request({
    url: downloadUrl,
    method: 'get',
    data: {}
  })
}
// 体测指导点
export function getRecomData(testItem) {
  return request({
    url: '/api/auth/v1/guidancePoint/recom',
    method: 'get',
    params: testItem
  })
}
// 体测指导点
export function getRecomDetailData(testItem) {
  return request({
    url: 'api/auth/v1/guidancePoint/' + testItem.id,
    method: 'get'
  })
}
