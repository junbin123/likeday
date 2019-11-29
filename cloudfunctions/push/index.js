// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: cloud.getWXContext().OPENID,
      page: 'pages/index/index',
      data: {
        name1: {
          value: '4542312'
        },
        date3: {
          value: '2015年01月05日'
        },
      },
      templateId: 'yyFvDHU6xbrik5jQwYDpJuix8OOiBIvNrNTyC6u4anA'
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}