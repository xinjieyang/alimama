var app = getApp()

Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    openid: '',
  },

  onLoad: function () {

  },

  onShow: function () {
    this.onGetOpenid();
    this.setData({
      openid: app.globalData.openid
    })
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.isLogin = true;
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      //console.log("用户的信息如下：");
      //console.log(e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false,
      });

      const db = wx.cloud.database()
      db.collection('user').where({
        _openid: app.globalData.openid
      }).count({
        success: function (res) {
          if (res.total == 0) {
            db.collection('user').add({
              data: {
                uid: e.detail.openid,
                uname: e.detail.userInfo.nickName,
                imgUrl: e.detail.userInfo.avatarUrl,
                sid: null, //学号
                phone_number: null,
                address: null,
              },
              success: function (res) {
                app.globalData.uname = e.detail.userInfo.nickName
                console.log(app.globalData.uname)
                wx.showToast({
                  title: '登录成功',
                })
                //修改界面
                var pages = getCurrentPages();
                var currPage = pages[pages.length - 1];
                var prevPage = pages[pages.length - 2];     //获取上一个页面
                prevPage.setData({                                      //修改上一个页面的变量
                  hasUserInfo: true,
                  username: app.globalData.uname,
                  loginMessage: '',
                  avatarUrl: e.detail.userInfo.avatarUrl,
                  editMessage: '编辑个人信息'
                })
                wx.navigateBack()
                console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
              },
              fail: function (err) {
                wx.showToast({
                  icon: 'none',
                  title: '新增记录失败'
                })
                console.error('[数据库] [新增记录] 失败：', err)
              }
            })
          } else {
            db.collection('user').where({
              _openid: app.globalData.openid
            }).get({
              success: res => {
                app.globalData.uname = res.data[0].uname
                var pages = getCurrentPages();
                var currPage = pages[pages.length - 1];
                var prevPage = pages[pages.length - 2]; 
                prevPage.setData({  
                  hasUserInfo: true,
                  username: app.globalData.uname,
                  loginMessage: '',
                  avatarUrl: e.detail.userInfo.avatarUrl,
                  editMessage: '编辑个人信息'
                })
                wx.navigateBack()
                console.log('[数据库] [查询记录] 成功: ', res)
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '查询记录失败'
                })
                console.error('[数据库] [查询记录] 失败：', err)
              }
            })
            wx.showToast({
              title: '登录成功',
            })
          };
          console.log(res.data+count);
        }
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
})