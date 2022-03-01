// 课程管理APi

import request from '@/utils/request'

const api_prefix = '/api/admin/course'

// 修改信息
export function updateIt(data) {
  return request({
    url: `${api_prefix}/update`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

// 禁用
export function disable(id) {
  return request({
    url: `${api_prefix}/disable/${id}`,
    method: 'post'
  })
}

// 启用
export function enable(userId) {
  return request({
    url: `${api_prefix}/enable/${userId}`,
    method: 'post'
  })
}

// 删除
export function deleteIt(userId) {
  return request({
    url: `${api_prefix}/delete/${userId}`,
    method: 'post'
  })
}

// 驳回
export function reject(data) {
  return request({
    url: `${api_prefix}/reject`,
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}

// 通过审核
export function pass(id) {
  return request({
    url: `${api_prefix}/pass/${id}`,
    method: 'post'
  })
}

// 获取列表
export function list(data) {
  return request({
    url: `${api_prefix}/list`,
    method: 'post',
    data
  })
}

// 获取详情
export function getInfo(id) {
  return request({
    url: `${api_prefix}/info/${id}`,
    method: 'get'
  })
}

// 上传图片
export function uploadPic(data) {
  return request({
    url: `${api_prefix}/upload/pic`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}
