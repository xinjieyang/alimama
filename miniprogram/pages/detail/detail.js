// miniprogram/pages/detail/detail.js
var app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_shoucang: false,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    good: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    db.collection('goods').doc(options.id).get({
      success: res => {
        this.setData({
          good: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  previewImage: function(e) {
    var current = e.target.dataset.src;
    var href = this.data.imghref;
    var goodsimg = this.data.goods_img;
    var imglist = [];
    for (var i = 0; i < goodsimg.length; i++) {
      imglist[i] = href + goodsimg[i].img
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: imglist // 需要预览的图片http链接列表  
    })
  },

  viewItem: function(event) {
    console.log(event)
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../owner/owner?id=' + id
    });
  },

  callOwner: function(event) {
    if (!app.globalData.isLogin) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: function(res) {
          if (res.cancel) {} else {
            //去登录界面
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    } else {
      var sender = event.currentTarget.dataset.id;
      var receiver = app.globalData.openid;
      wx.navigateTo({
        url: '../message/message?sender=' + sender + '&receiver=' + receiver
      });
    }
  },

  inCar: function(event) {
    if (!app.globalData.isLogin) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: function(res) {
          if (res.cancel) {} else {
            //去登录界面
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    } else {
      const db = wx.cloud.database()
      db.collection('shopcarts').where({
        _openid: app.globalData.openid,
        goods_id: event.currentTarget.dataset.id
      }).count({
        success: function(res) {
          if (res.total == 0) {
            db.collection('shopcarts').add({
              data: {
                goods_id: event.currentTarget.dataset.id
              },
              success: res => {
                // 在返回结果中会包含新创建的记录的 _id
                wx.showToast({
                  title: '加入购物车成功',
                })
                this.setData({
                  counterId: res._id,
                  is_shoucang: true
                })
                console.log("123");
                
                console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '加入购物车失败'
                })
                console.error('[数据库] [新增记录] 失败：', err)
              }
            })
          } else {
            wx.showToast({
              title: '已在购物车中',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
  },

  buy: function(event) {
    console.log(event)
    if (!app.globalData.isLogin) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: function(res) {
          if (res.cancel) {} else {
            //去登录界面
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    } else {
      var id = event.currentTarget.dataset.id;
      var openid = event.currentTarget.dataset.openid;
      console.log("hhh")
      console.log(id);
      console.log(openid);
      wx.navigateTo({
        url: '../pay/pay?id=' + id + '&openid=' + openid
      });
    }
  }

})