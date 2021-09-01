import { reqGetCityInfo } from '../api'

export const getCurrentCity = () => {
  // 判断 localStorage 中是否有定位城市
  const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
  if (!localCity) {
    return new Promise((resolve, reject) => {
      const curCity = new window.BMapGL.LocalCity()
      curCity.get(async res => {
        const params = {
          name: res.name
        }
        try {
          const result = await reqGetCityInfo(params)
          localStorage.setItem('hkzf_city', JSON.stringify(result.body))
          resolve(result.body)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  // 如果有，直接返回本地存储中的城市数据
  // 注意：因为上面为了处理异步操作，使用了Promise,因此，为了该函数返回值统一，此处，也应该使用Promise
  // 因为此处的 Promise 不会失败，所以，此处，只要返回一个成功的Promise 即可
  return Promise.resolve(localCity)
}