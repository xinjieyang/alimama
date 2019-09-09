var app = getApp();
const db = wx.cloud.database();
const orginalPrice = 0; //由于0.00在赋值时是0，用toFixed()取余

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [], // 购物车列表 
    ssCarts: [],
    totalPrice: orginalPrice.toFixed(2), // 总价，初始为0
    selectAllStatus: false, // 全选状态，默认没有全选
    myCartLength: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    if (!app.globalData.isLogin) {
      wx.showModal({
        title: '提示',
        content: '请先登录',

        success: function(res) {
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
      var that = this;
      this.getCartsList()
    }
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

  onPullDownRefresh: function() {
    // 动态设置导航条标题
    wx.setNavigationBarTitle({
      title: '购物车'
    });

    wx.showNavigationBarLoading(); //在标题栏中显示加载图标

    setTimeout(function() {
      wx.stopPullDownRefresh(); //停止加载
      wx.hideNavigationBarLoading(); //隐藏加载icon
    }, 2000)

  },

  getCartsList: function() {
    console.log('进入购物车成功');
    var that = this;
    var carts = new Array();
    var ssCarts = new Array();
    var myCartLength = '';

    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
    })

    db.collection('shopcarts').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        console.log(res.data),
          console.log('I层加载成功！')
        that.setData({
          ssCarts: []
        })
        //----
        for (var i = 0; i < res.data.length; i++) {
          db.collection('goods').where({
            _id: res.data[i].goods_id
          }).get({
            success: e => {
              console.log(e.data),
                console.log('II层加载成功！')
              ssCarts.push(e.data[0])
              // app.globalData.ssCarts = ssCarts;
              that.setData({
                ssCarts: ssCarts
              })
              console.log(ssCarts)
            },
            fail: err => {
              console.log('II层加载失败')
            }
          })
          //----
        } //for

      },
      fail: err => {
        console.log(err);
      }
    })
  },

  //删除商品
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let ssCarts = this.data.ssCarts;
    console.log("wow");
    console.log(ssCarts.length);
    wx.showModal({
      title: '提示',
      content: '将此产品移除购物车？',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定');
          db.collection('shopcarts').where({
            _openid: app.globalData.openid,
            goods_id: ssCarts[index]._id
          }).get({
            success: function(res) {
              db.collection('shopcarts').doc(res.data[0]._id).remove({
                success: res => {
                  console.log("删除成功")
                  console.error('[数据库] [删除记录] 成功：', err)
                },
                fail: err => {
                  console.log("删除失败")
                  console.error('[数据库] [删除记录] 失败：', err)
                }
              })
            },
            fail: console.error
          })
          ssCarts.splice(index, 1); // 删除购物车列表里这个商品
          console.log(ssCarts.length);
          app.globalData.ssCarts = ssCarts;
          this.setData({
            ssCarts: ssCarts
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  toBuy: function(e) { //付款
    const index = e.currentTarget.dataset.index;
    var that = this;
    let ssCarts = this.data.ssCarts;
    var id = ssCarts[index]._id;
    var openid = ssCarts[index]._openid;

    // db.collection('goods').where({
    //   _id: ssCarts[index]._id
    // }).get({
    //   success: res => {
    //     openid = res.data._openid
    //   },
    //   fail: err => {
    //     console.log(err);
    //   }
    // })
    wx.navigateTo({
      url: "../pay/pay?id="+ id +"&openid=" + openid + "&index=" + index
    })

  },

  //查看详情
  viewItem: function(event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    });
  }

})