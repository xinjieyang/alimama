// miniprogram/pages/pay/pay.js
var app = getApp();
const db = wx.cloud.database({}); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    good:[],
    users:[],
    owner:[],
    index:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
    console.log(options.openid);
    db.collection('goods').doc(options.id).get({
      success: res => {
        this.setData({
          good: res.data,
          index: options.index
        })
        console.log(res.data)
      }
    }),

      db.collection('user').where({
        _openid: options.openid
      }).get({
        success: res => {
          this.setData({
            owner: res.data
          })
        }
      })

    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        this.setData({
          users: res.data
        })
      }
    })

  },

  sure: function(){
    var that = this;
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

        db.collection('shopcarts').where({
          _openid: app.globalData.openid,
          goods_id: this.data.good._id
        }).count({
          success: e=>{
            console.log("hhh");
            console.log(e);
            console.log(app.globalData.openid);
            console.log(this.data.good._id);
            console.log("hhh");
            if (e.total != 0) {
              db.collection('shopcarts').where({
                _openid: app.globalData.openid,
                goods_id: this.data.good._id
              }).get({
                success: re=>{
                  db.collection('shopcarts').doc(re.data[0]._id).remove({
                    success: es => {
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
            } else {
            }
          }
        })
        // var pages = getCurrentPages();
        // var currPage = pages[pages.length - 1];
        // var prevPage = pages[pages.length - 2];     //获取上一个页面
        // var temp = app.globalData.ssCarts;
        // console.log(app.globalData.ssCarts)
        // temp.splice(that.data.index, 1)
        // prevPage.setData({                   
        //   ssCarts: temp
        // })

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