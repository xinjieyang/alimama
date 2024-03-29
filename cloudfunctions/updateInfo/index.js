// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    return await db.collection('user').where({
      _openid: wxContext.OPENID
    }).update({
      // data 传入需要局部更新的数据
      data: {
        uname: event.uname,
        sid: event.student_id,
        address: event.address,
        phone_number: event.phone,
      }
    })
  } catch (e) {
    console.error(e)
  }
}