
const { VUE_APP_ENV = 'dev' } = process.env
console.log({ VUE_APP_ENV }, '----')
const version = 'v1'
const apiConfig = {
  dev: `http://localhost:3000/${version}`,
  prod: `https://likeday-f4b2b-1300778416.ap-shanghai.app.tcloudbase.com/likeday-koa-tcb/${version}`
}

export default {
  env: VUE_APP_ENV,
  platform: 'weixin',
  baseUrl: apiConfig[VUE_APP_ENV] || apiConfig.dev
}
