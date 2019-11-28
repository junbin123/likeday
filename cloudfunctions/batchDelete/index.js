// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数 警示
exports.main = async(event, context) => {
  try {
    return await db.collection("event").where({
      deleteState: true,
      _openid: "oivdd5XjdYlFKm6ezZ653Krm7CAU" || "oivdd5eX-xSVlc7xJ9lREn5K3V8M"
    }).remove();
  } catch (e) {
    console.error("批量删除失败" + e)
  }

  // try {
  //   return await db.collection("user").where({
  //     nickName: "哈哈" || "伍同学",
  //   }).remove();
  // } catch (e) {
  //   console.error("批量删除失败" + e)
  // }
}