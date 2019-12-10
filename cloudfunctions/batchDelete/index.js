// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数 警示
exports.main = async(event, context) => {
  try {
    return await db.collection("event").where({
      deleteState: true,
      _openid: "ohPw75PXvHXj1pTtzcFvJOKXPnck"
    }).remove();
  } catch (e) {
    console.error("批量删除失败" + e)
  }
}