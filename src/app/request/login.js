import store from '@/store'
import config from '../config.js'
const baseUrl = config.baseUrl
const login = async () => {
  const promise = new Promise((resolve, reject) => {
    uni.login({
      success: res => {
        const code = res.code
        uni.request({
          url: baseUrl + '/login',
          data: { code },
          method: 'GET',
          success: resData => {
            const userInfo = resData.data.userInfo
            store.dispatch('app/updateUserInfo', userInfo)
            resolve(userInfo)
          },
          fail: errData => {
            reject(errData)
          }
        })
      },
      fail: err => {
        reject(err)
      }
    })
  })
  return promise
}
export default login
