import request from '@/utils/request'

const api_prefix = '/api/admin/teacher'

// 获取用户信息
export function getInfo(userId) {
  return request({
    url: `${api_prefix}/info/${userId}`,
    method: 'get'
  })
}

// 新建用户
export function createUser(data) {
  return request({
    url: `${api_prefix}/create`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

// 修改信息
export function updateProfile(data) {
  return request({
    url: `${api_prefix}/update/profile`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

// 修改密码
export function updatePassword(data) {
  return request({
    url: `${api_prefix}/update/password`,
    method: 'post',
    data
  })
}

// 禁用用户
export function disable(userId) {
  return request({
    url: `${api_prefix}/disable/${userId}`,
    method: 'post'
  })
}

// 启用用户
export function enable(userId) {
  return request({
    url: `${api_prefix}/enable/${userId}`,
    method: 'post'
  })
}

// 删除
export function deleteUser(userId) {
  return request({
    url: `${api_prefix}/delete/${userId}`,
    method: 'post'
  })
}

// 通过审核
export function pass(userId) {
  return request({
    url: `${api_prefix}/pass/${userId}`,
    method: 'post'
  })
}

// 获取用户列表
export function list(data) {
  return request({
    url: `${api_prefix}/list`,
    method: 'post',
    data
  })
}
