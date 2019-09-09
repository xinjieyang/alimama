// pages/order/order.js
var app = getApp()
const db = wx.cloud.database({});
const cont = db.collection('orders');
Page({

  /**
  * 页面的初始数据
  */
  data:{
    currtab: '',
    swipertab: [{ name: '全部', index: 0 }, { name: '未完成', index: 1 }, { name: '已完成', index: 2 }],
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var current = options.curr;
    this.setData({
      currtab:current
    })

  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    // 页面渲染完成
    this.getDeviceInfo()
    this.orderShow()
  },

  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },

  /**
  * @Explain：选项卡点击切换
  */
  tabSwitch: function (e) {
    var that = this
    if (this.data.currtab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currtab: e.target.dataset.current
      })
    }
  },

  tabChange: function (e) {
    this.setData({ currtab: e.detail.current })
    this.orderShow()
  },

  orderShow: function () {
    let that = this
    if (this.data.currtab === '0') {
      that.alreadyShow()
    } else if (this.data.currtab === 1) {
      that.waitPayShow()
    } else if (this.data.currtab === 2) {
      that.lostShow()
    }
  },
  
  alreadyShow: function () {
    var _this = this;
    db.collection('orders').where({
      _openid: app.globalData.openid,
      state: "未完成"
    })
      .get({
        success: res => {
          console.log(res.data);
          this.setData({ waitPayOrder: res.data })

        }
      }),
      db.collection('orders').where({
        _openid: app.globalData.openid,
        state: "已完成"

      })
        .get({
          success: res => {
            console.log(res.data);
            this.setData({ lostOrder: res.data })

          }
        })

    // db.collection('orders').where({
    //   _openid: app.globalData.openid,
    //   //  state:"已发货"

    // })
    //   .get({
    //     success: res => {
    //       console.log(res.data);
    //       // this.setData({ alreadyOrder: res.data })
    //       this.setData({ waitPayOrder: res.data })
    //       this.setData({ lostOrder: res.data })

    //     }
    //   })
    // this.setData({
    //   alreadyOrder: [{ name: "跃动体育运动俱乐部(圆明园店)", state: "交易成功", time: "2018-09-30 14:00-16:00", status: "已结束", url: "../../images/bad0.png", money: "132" }, { name: "跃动体育运动俱乐部(圆明园店)", state: "交易成功", time: "2018-10-12 18:00-20:00", status: "未开始", url: "../../images/bad3.jpg", money: "205" }]
    // })
  },

  waitPayShow: function () {
    var _this = this;
    db.collection('orders').where({
      _openid: app.globalData.openid,
      state: "未完成"
    })
      .get({
        success: res => {
          console.log(res.data);
          this.setData({ waitPayOrder: res.data })

        }
      })
    // this.setData({
    //   waitPayOrder: [{ name: "跃动体育运动俱乐部(圆明园店)", state: "待付款", time: "2018-10-14 14:00-16:00", status: "未开始", url: "../../images/bad1.jpg", money: "186" }],
    // })
  },

  lostShow: function () {
    var _this = this;
    db.collection('orders').where({
      _openid: app.globalData.openid,
      state: "已完成"

    })
      .get({
        success: res => {
          console.log(res.data);
          this.setData({ lostOrder: res.data })

        }
      })
    // this.setData({
    //   lostOrder: [{ name: "跃动体育运动俱乐部(圆明园店)", state: "已取消", time: "2018-10-4 10:00-12:00", status: "未开始", url: "../../images/bad1.jpg", money: "122" }],
    // })
  },
  updateOrders: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.id);
    db.collection('orders').doc(e.currentTarget.dataset.id).update({
      // data 传入需要局部更新的数据
      data: {
        state: "已完成"
      }
    })
    wx.showToast({
      title: '已完成交易',
      duration: 2000
    })
    // wx.cloud.callFunction({
    //   // 云函数名称
    //   name: 'updateOrder',
    //   // 传给云函数的参数
    //   data: {
    //     id: e.currentTarget.dataset.id
    //     // uname: that.data.name,
    //     // student_id: that.data.student_id,
    //     // address: that.data.address,
    //     // phone: that.data.phone_number,
    //   },
    //   success: function (res) {
    //     console.log(res)
    //     wx.showToast({
    //       title: '完成交易',
    //     })

    //   },
    //   fail: console.error
    // })
  },
  deleteOrders: function (e) {
    var that = this
    const db = wx.cloud.database()
    var id = e.currentTarget.dataset.id
    db.collection('orders').doc(id).remove({
      success: function (res) {
        console.log(res)
        //  that.getUserMsg()
        wx.showToast({
          title: '取消成功',
        })

      },
      fail: console.error
    })

  },

  contactSeller:function(event){
    var sender = event.currentTarget.dataset.sellerid;
    var receiver = app.globalData.openid;
    wx.navigateTo({
      url: '../message/message?sender=' + sender + '&receiver=' + receiver
    });

  },


  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {

  },

  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {

  },

  /**
  * 生命周期函数--监听页面卸载
  */
  onUnload: function () {

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
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {

  }
})