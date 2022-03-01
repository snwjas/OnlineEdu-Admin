import request from '@/utils/request'

const api_prefix = '/api/admin/role'

export function listAll(enable) {
  return request({
    url: `${api_prefix}/list/all/${enable}`,
    method: 'get'
  })
}
