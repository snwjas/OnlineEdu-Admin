import request from '@/utils/request'

const api_prefix = '/api/admin/chapter'

// 列出章节
export function listChapters(courseId) {
  return request({
    url: `${api_prefix}/list/${courseId}`,
    method: 'get'
  })
}

// 列出章节(二审)
export function listChaptersTmp(courseId) {
  return request({
    url: `${api_prefix}/tmp/list/${courseId}`,
    method: 'get'
  })
}
