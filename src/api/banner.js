import request from '@/utils/request'

const api_prefix = '/api/admin/banner'

// 新建
export function createBanner(data) {
  return request({
    url: `${api_prefix}/create`,
    method: 'post',
    data
  })
}

// 修改
export function updateBanner(data) {
  return request({
    url: `${api_prefix}/update`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

// 刷新Banner缓存
export function refresh() {
  return request({
    url: `${api_prefix}/refresh`,
    method: 'post'
  })
}

// 禁用
export function disable(bannerId) {
  return request({
    url: `${api_prefix}/disable/${bannerId}`,
    method: 'post'
  })
}

// 启用
export function enable(bannerId) {
  return request({
    url: `${api_prefix}/enable/${bannerId}`,
    method: 'post'
  })
}

// 删除
export function deleteBanner(bannerId) {
  return request({
    url: `${api_prefix}/delete/${bannerId}`,
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
