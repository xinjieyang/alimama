// pages/contact/contact.js
const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;

// /**
//  * 初始化数据
//  */
// function initData(that) {
//   inputVal = '';
//   msgList = [];

//   that.setData({
//     msgList,
//     inputVal,
//     message
//   })
// }

/**
 * 计算msg总高度
 */
// function calScrollHeight(that, keyHeight) {
//   var query = wx.createSelectorQuery();
//   query.select('.scrollMsg').boundingClientRect(function(rect) {
//   }).exec();
// }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0,
    msgList:[],
    temp:[],
    inputVal: '',
    sender: '',//对方
    receiver: '',//自己
    senderName:'',
    senderImg:'',
    receiverName:'',
    receiverImg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var msgList = that.data.msgList;
    var temp = that.data.temp;
    var senderName = that.data.senderName;
    var senderImg = that.data.senderImg;
    var receiverName = that.data.receiverName;
    var receiverImg = that.data.receiverImg;
    console.log(options)
    //查所有我自己发给对方的消息
    const db = wx.cloud.database()
    db.collection("user").where({
      _openid: options.sender
    }).get({
      success: res => {
        senderName = res.data[0].uname;
        senderImg = res.data[0].imgUrl;
        that.setData({
          senderName: senderName,
          senderImg: senderImg
        })
      }
    })
    db.collection("user").where({
      _openid: options.receiver
    }).get({
      success: res => {
        receiverName = res.data[0].uname;
        receiverImg = res.data[0].imgUrl;
        that.setData({
          receiverName: receiverName,
          receiverImg: receiverImg
        })
      }
    })
    db.collection('chat_message').where({
      operator: options.receiver
    }).get({
      success: res => {
        temp = res.data;
        console.log(temp);
        for(var i = 0; i < temp.length; i++){
          //如果是我发的消息
          if (temp[i].sender === options.receiver && temp[i].receiver === options.sender){
            console.log(1);
            msgList.push({
              speaker: "ziji",
              content: temp[i].content
            })
          } else if (temp[i].sender === options.sender && temp[i].receiver === options.receiver){
            console.log(temp[i].senderName)
            msgList.push({
              speaker: "duifang",
              content: temp[i].content
            })
          }
        }
        app.globalData.msgList = msgList;
        console.log(msgList)
        that.setData({
          msgList: msgList,
          temp: temp,
          sender: options.sender,
          receiver: options.receiver,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      msgList: app.globalData.msgList
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 获取聚焦
   */
  focus: function (e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

  },

  /**
   * 发送点击监听，我发消息了
   */
  sendClick: function (e) {
    var that = this;
    var msgList = that.data.msgList;
    msgList.push({
      speaker: "ziji",
      content: e.detail.value
    })
    app.globalData.msgList = msgList;

    const db = wx.cloud.database();
    db.collection("chat_message").add({
      data: {
        operator: that.data.receiver,
        state: 'send',
        sender: that.data.receiver,
        senderName: that.data.receiverName,
        senderImg: that.data.receiverImg,
        receiver: that.data.sender,
        receiverName: that.data.senderName,
        receiverImg: that.data.senderImg,
        content: e.detail.value
      },
      success: function (res) {
        console.log(res)
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: function (err) {
        console.log(err)
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })

    db.collection("chat_message").add({
      data: {
        operator: that.data.sender,
        state: 'receive',
        sender: that.data.receiver,
        senderName: that.data.receiverName,
        senderImg: that.data.receiverImg,
        receiver: that.data.sender,
        receiverName: that.data.senderName,
        receiverImg: that.data.senderImg,
        content: e.detail.value
      },
      success: function (res) {
        console.log(res)
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: function (err) {
        console.log(err)
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })

    inputVal = '';
    this.setData({
      msgList: msgList,
      inputVal
    });
  },

  /**
   * 退回上一页
   */
  toBackClick: function () {
    wx.navigateBack({})
  }

})
