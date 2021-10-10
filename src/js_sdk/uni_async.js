// async test () {
//   const src = 'https://box.bdimg.com/static/fisp_static/common/img/searchbox/logo_news_276_88_1f9876a.png'
//   const res = await this.$uniAsync.getImageInfo({ src })
//   console.log(res.path, '..')
// },
// async onLoad (options) {
//   const src = 'https://box.bdimg.com/static/fisp_static/common/img/searchbox/logo_news_276_88_1f9876a.png'
//   const res = await this.$uniAsync.getImageInfo({ src })
//   console.log(res)
// },
const uniAsync = new Proxy({}, {
  get (target, name) {
    return (obj) => new Promise((resolve, reject) => {
      uni[name]({
        ...obj,
        success: res => {
          resolve(res)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }
})
export default uniAsync
