import request from '@/utils/request'

const api_prefix = '/api/admin/user'

// 登录
export function login(data) {
  return request({
    url: `${api_prefix}/login`,
    method: 'post',
    data
  })
}

// 注销登录
export function logout() {
  return request({
    url: `${api_prefix}/logout`,
    method: 'post'
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: `${api_prefix}/info`,
    method: 'get'
  })
}

// 新建用户
export function createUser(data) {
  return request({
    url: `${api_prefix}/create`,
    method: 'post',
    data
  })
}

// 修改信息
export function updateProfile(data) {
  return request({
    url: `${api_prefix}/update/profile`,
    method: 'post',
    data
  })
}

// 管理员权限修改信息
export function updateProfileWithAdmin(data) {
  return request({
    url: `${api_prefix}/update/profile/admin`,
    method: 'post',
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

// 管理员权限直接修改密码
export function updatePasswordWithAdmin(data) {
  return request({
    url: `${api_prefix}/update/password/admin`,
    method: 'post',
    data
  })
}

// 修改头像
export function updateAvatar(data) {
  return request({
    url: `${api_prefix}/update/avatar`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
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

// 删除用户
export function deleteUser(userId) {
  return request({
    url: `${api_prefix}/delete/${userId}`,
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
