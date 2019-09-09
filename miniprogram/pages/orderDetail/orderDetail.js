// miniprogram/pages/pay/pay.js
var app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    good: [],
    users: [],
    owner: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    db.collection('goods').where({
      _id: options.id
    }).get({
      success: res => {
        console.log(res.data)
        this.setData({
          good: res.data
        })
      }
    }),

      db.collection('user').where({
        _openid: app.globalData.openid
      }).get({
        success: res => {
          this.setData({
            owner: res.data
          })
        }
      })

    db.collection('user').where({
      _openid: options.openid
    }).get({
      success: res => {
        this.setData({
          users: res.data
        })
      }
    })

  },

  sure: function () {
    db.collection('orders').add({
      data: {
        goodid: this.data.good._id,
        ownerid: this.data.owner[0]._openid,
        image: this.data.good.yulanimg[0],
        money: this.data.good.price,
        name: this.data.good.gname,
        state: "未完成"
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id
        })
        wx.showModal({
          title: '下单完成',
          content: '您已下单，请前往个人中心完成支付',
          success: function (res) {
            if (res.cancel) { } else {
              //去登录界面
              wx.switchTab({
                url: '../mine/mine',
              })
            }
          }
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '下单失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  no: function () {
    wx.showModal({
      title: '下单失败',
      content: '您已取消订单',
      success: function (res) {
        if (res.cancel) { } else {
          wx.switchTab({
            url: 'pages/index/index',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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