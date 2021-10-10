import store from '@/store'
import login from './login.js'
import config from '../config.js'
const baseUrl = config.baseUrl
const request = async (url = '', data = {}, method = 'POST') => {
  if (!url) {
    return
  }
  if (!store.state.app.userInfo.uid) {
    await login()
  }
  const { userInfo } = store.state.app
  const promise = new Promise((resolve, reject) => {
    uni.request({
      url: baseUrl + url,
      data,
      header: {
        'content-type': 'application/json',
        uid: userInfo.uid,
        openid: userInfo.openid
      },
      method,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
  return promise
}
export default request
