// 课程分类接口

import request from '@/utils/request'

const api_prefix = '/api/admin/subject'

export function getSubject() {
  return request({
    url: `${api_prefix}/get`,
    method: 'get'
  })
}

// 新建
export function createSubject(data) {
  return request({
    url: `${api_prefix}/create`,
    method: 'post',
    data
  })
}

// 修改
export function updateSubject(data) {
  return request({
    url: `${api_prefix}/update`,
    method: 'post',
    data
  })
}

// 禁用
export function disable(SubjectId) {
  return request({
    url: `${api_prefix}/disable/${SubjectId}`,
    method: 'post'
  })
}

// 启用
export function enable(SubjectId) {
  return request({
    url: `${api_prefix}/enable/${SubjectId}`,
    method: 'post'
  })
}

// 删除
export function deleteSubject(SubjectId) {
  return request({
    url: `${api_prefix}/delete/${SubjectId}`,
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

// 刷新缓存
export function refresh() {
  return request({
    url: `${api_prefix}/refresh`,
    method: 'post'
  })
}
