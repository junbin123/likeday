import uniAsync from '@/js_sdk/uni_async.js'
import store from '@/store'
import config from '../config.js'
const baseUrl = config.baseUrl
const login = async () => {
  const { code } = await uniAsync.login({})
  try {
    const res = await uniAsync.request({
      url: baseUrl + '/login',
      data: { code },
      method: 'GET'
    })
    const { userInfo } = res.data
    store.dispatch('app/updateUserInfo', userInfo)
    return Promise.resolve(userInfo)
  } catch (err) {
    return Promise.reject(err)
  }
}
export default login
