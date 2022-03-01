import request from '@/utils/request'

const api_prefix = '/api/admin/stat'

export function getCommon() {
  return request({
    url: `${api_prefix}/get/common`,
    method: 'get'
  })
}

export function getDaily(data) {
  return request({
    url: `${api_prefix}/get/daily`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}
