// 订单管理APi

import request from '@/utils/request'

const api_prefix = '/api/admin/order'

// 获取列表
export function list(data) {
  return request({
    url: `${api_prefix}/list`,
    method: 'post',
    data
  })
}

