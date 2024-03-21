import { ref } from 'vue'
import { getParkInfoApi } from '@/api/park.js'

export const useParkInfo = () => {
  const parkInfo = ref({})

  const getParkInfo = async () => {
    try {
      // const {
      //   data: { base, parkIncome, parkIndustry }
      // } = await getParkInfoApi()
      const res = await getParkInfoApi()
      parkInfo.value = res.data
      // console.log('base', base)
      // console.log('parkIncome', parkIncome)
      // console.log('parkIndustry', parkIndustry)
    } catch (error) {
      console.log(error)
    }
  }

  return {
    parkInfo,
    getParkInfo
  }
}
