import request from '@/app/request'
import store from '@/store'

export const getUserInfo = async () => {
  const res = await request('/user/get', {})
  const userInfo = res.data.data
  console.log('getUserInfo----', userInfo)
  store.dispatch('app/updateUserInfo', userInfo)
}

// 更新用户信息
export const updateUserInfo = async () => {
  const promise = new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '获取用户信息',
      success: res => {
        const data = {
          ...res.userInfo,
          isAuth: true,
          isNew: false,
          othenInfo: {
            cloudID: res.cloudID,
            encryptedData: res.encryptedData,
            iv: res.iv,
            rawData: res.rawData,
            signature: res.signature
          }
        }
        request('/user/update', data).then(() => {
          const result = { ...res.userInfo, isAuth: true, isNew: false }
          store.dispatch('app/updateUserInfo', result)
          uni.showToast({ title: '更新成功', icon: 'success' })
          resolve(result)
        }).catch(err => {
          reject(err)
        })
      },
      fail: err => {
        uni.showToast({ title: '更新失败', icon: 'error' })
        reject(err)
        console.log('fail', err)
      }
    })
  })
  return promise
}

export const updateCategory = async (data) => {
  const res = await request('/user/update', data)
  return res
}

// 删除用户
export const deleteUser = async () => {
  const res = await request('/user/delete')
  return res
}

export const moveUserInfo = async (data) => {
  const res = await request('/user/moveUserInfo', data)
  return res.data
}
