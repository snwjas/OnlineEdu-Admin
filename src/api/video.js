import request from '@/utils/request'

const api_prefix = '/api/admin/video'

// 列出章节视频
export function listVideos(chapterId) {
  return request({
    url: `${api_prefix}/list/${chapterId}`,
    method: 'get'
  })
}

// 列出章节视频
export function listVideosTmp(chapterId) {
  return request({
    url: `${api_prefix}/tmp/list/${chapterId}`,
    method: 'get'
  })
}

// 获取视频播放凭证
export function getPlayAuth(videoSourceId) {
  return request({
    url: `${api_prefix}/auth/${videoSourceId}`,
    method: 'get'
  })
}
