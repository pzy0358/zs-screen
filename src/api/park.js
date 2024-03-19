import request from '@/utils/request'

export const getParkInfoApi = () => {
  return request({
    url: '/park/statistics/info',
    method: 'get'
  })
}
