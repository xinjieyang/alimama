var app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    userInfo: [],
    address:'',
    imgUrl: '',
    uname:'',
    sid: '',
    phone_number: ''
  },

  onLoad: function () {
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        this.setData({
          userInfo: res.data[0],
          address: res.data[0].address,
          imgUrl: res.data[0].imgUrl,
          uname: res.data[0].uname,
          sid: res.data[0].sid,
          phone_number: res.data[0].phone_number
        })
      }
    })
  },

  onShow: function () {
    this.onLoad()
  },

  inputNickname: function (e) {
    this.setData({
      uname: e.detail.value
    })
  },

  inputsid: function (e) {
    this.setData({
      sid: e.detail.value
    })
  },

  inputaddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },

  inputphone: function (e) {
    this.setData({
      phone_number: e.detail.value
    })
  },

  saveUserInfo: function () {
    var that = this;
    // console.log(that.data.uname);
    // console.log(that.data.phone_number);
    wx.cloud.callFunction({
      // 云函数名称
      name: 'updateInfo',
      // 传给云函数的参数
      data: {
        uname: that.data.uname,
        sid: that.data.sid,
        address: that.data.address,
        phone_number: that.data.phone_number,
      },
      success: function (res) {
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];
        var prevPage = pages[pages.length - 2];     //获取上一个页面
        prevPage.setData({
          username: that.data.uname,
        })
        wx.navigateBack();
        wx.showToast({
          title: '修改成功',
          duration: 1000,
        })
      },
      fail: console.error
    })
  },
})