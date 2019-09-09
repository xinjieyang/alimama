var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: [],
    hasUserInfo: false,
    username: '您还未登录',
    loginMessage: '点击此处登录',
    avatarUrl: '../../images/profile.png',
    editMessage: ''
  },
  //退出按钮的事件
  loginout: function (e) {
    if (!this.data.hasUserInfo) {
      user = null;
      app.globalData.user.user == null;
      wx.navigateTo({
        url: '/pages/mine/mine',
      })
    }
  },

  goEditMessage: function (e) {
    wx.navigateTo({
      //跳转到“编辑个人信息”界面
      url: '/pages/editMessage/editMessage',
    })
  },

  //点击已下单
  goOrder: function (e) {
    // console.log(app.globalData.user.user.uid)
    var curr = e.currentTarget.dataset.curr;
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      // let uid = app.globalData.user.user.uid
      wx.navigateTo({
        //跳转到“已下单”界面
        url: '/pages/order/order?curr='+curr,
      })
    }
  },

  //点击交易成功
  goSuccessOrder: function (e) {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '/pages/success_order1/success_order1',
      })
    }

  },

  //点击发布商品
  goReleaseGoods: function () {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '/pages/release_goods/release_goods',
      })
    }

  },

  goSellerOrders: function (e) {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '/pages/seller_order/seller_order?curr=0',
      })
    }
  },

  yiwancheng: function (e) {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '/pages/seller_order/seller_order?curr=2'
      })
    }
  },

  goMyreleased: function () {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '/pages/myReleased/myReleased',
      })
    }
  },

  sorry: function () {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showToast({
        title: '先功能正在研发',
        icon: 'none',
        duration: 2000
      })
    }

  },

  managerAddress: function (e) {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      let uid = app.globalData.user.user.uid
      wx.navigateTo({
        url: '/pages/address/address',
      })
    }
  },

  aboutUs: function (e) {
    wx.navigateTo({
      url: '/pages/aboutUs/aboutUs',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    if (app.globalData.isLogin) {
      const db = wx.cloud.database();
      db.collection('user').where({
        _openid: app.globalData.openid
      }).get({
        success: res => {
          this.setData({
            user: res.data,
            hasUserInfo: true,
            username: res.data[0].uname,
            loginMessage: '',
            avatarUrl: res.data[0].imgUrl,
            editMessage: '编辑个人信息'
          })
        }
      })
    }
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