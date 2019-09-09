const db = wx.cloud.database({});
const cont = db.collection('goods');
var app = getApp();
Page({
  data: {
    message_list: [],
    temp: [],
    user: []
  },

  onShow: function() {
    if (!app.globalData.isLogin) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: function (res) {
          if (res.cancel) {
          } else {
            //去登录界面
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })

    } else {
      var _this = this;
      var receiver = _this.data.receiver;
      var temp = _this.data.temp;
      var user_temp = new Array();
      var user = _this.data.user;
      //查找所有操作人是自己的消息
      db.collection('chat_message').where({
        operator: app.globalData.openid
      }).get({
        success: res => {
          temp = res.data;
          for (var i = 0; i < temp.length; i++) {
            if (temp[i].state == 'send') {
              user_temp.push({
                zijiid: temp[i].sender,
                id: temp[i].receiver,
                touxiang: temp[i].receiverImg,
                nicheng: temp[i].receiverName,
              })
            } else if (temp[i].state == 'receive') {
              user_temp.push({
                zijiid: temp[i].receiver,
                id: temp[i].sender,
                touxiang: temp[i].senderImg,
                nicheng: temp[i].senderName,
              })
            }
          }
          user = user_temp;
          for (var j = 0; j < user.length; j++) {
            for (var k = j + 1; k < user.length; k++) {
              if (user[j].id == user[k].id) {
                user.splice(k, 1);
                k--;
              }
            }
          }
          console.log(user);
          app.globalData.user = user;
          _this.setData({
            user: user,
          })
        }
      })
    }
  },

  onLoad: function(options) {
    // if (!app.globalData.isLogin) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请先登录',
    //     success: function(res) {
    //       if (res.cancel) {
    //       } else {
    //         //去登录界面
    //         wx.navigateTo({
    //           url: '/pages/login/login',
    //         })
    //       }
    //     }
    //   })

    // } else {
    //   var _this = this;
    //   var receiver = _this.data.receiver;
    //   var temp = _this.data.temp;
    //   var user_temp = new Array();
    //   var user = _this.data.user;
    //   //查找所有操作人是自己的消息
    //   db.collection('chat_message').where({
    //     operator: app.globalData.openid
    //   }).get({
    //     success: res => {
    //       temp = res.data;
    //       for (var i = 0; i < temp.length; i++) {
    //         if (temp[i].state == 'send') {
    //           user_temp.push({
    //             zijiid: temp[i].sender,
    //             id: temp[i].receiver,
    //             touxiang: temp[i].receiverImg,
    //             nicheng: temp[i].receiverName,
    //           })
    //         } else if (temp[i].state == 'receive') {
    //           user_temp.push({
    //             zijiid: temp[i].receiver,
    //             id: temp[i].sender,
    //             touxiang: temp[i].senderImg,
    //             nicheng: temp[i].senderName,
    //           })
    //         }
    //       }
    //       user = user_temp;
    //       for (var j = 0; j < user.length; j++) {
    //         for (var k = j + 1; k < user.length; k++) {
    //           if (user[j].id == user[k].id) {
    //             user.splice(k, 1);
    //             k--;
    //           }
    //         }
    //       }
    //       console.log(user);
    //       app.globalData.user = user;
    //       _this.setData({
    //         user: user,
    //       })
    //     }
    //   })
    // }

  },

  viewItem: function(event) {
    console.log(event)
    var sender = event.currentTarget.dataset.sender;
    var receiver = event.currentTarget.dataset.receiver;
    wx.navigateTo({
      url: '../message/message?sender=' + sender + "&receiver=" + receiver
    });
  }
})