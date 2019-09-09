// pages/order/order.js
var app = getApp()
const db = wx.cloud.database({});
const cont = db.collection('oders');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currtab: '',
    swipertab: [{
      name: '全部',
      index: 0
    }, {
      name: '未完成',
      index: 1
    }, {
      name: '已完成',
      index: 2
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      currtab: options.curr
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 页面渲染完成
    this.getDeviceInfo();
    this.orderShow();
  },

  getDeviceInfo: function() {
    let that = this
    wx.getSystemInfo({
      success: function(res) {
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
  tabSwitch: function(e) {
    var that = this
    if (this.data.currtab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currtab: e.target.dataset.current
      })
    }
  },

  tabChange: function(e) {
    this.setData({
      currtab: e.detail.current
    })
    this.orderShow()
  },

  orderShow: function() {
    let that = this
    if(this.data.currtab === '0'){
      that.alreadyShow()
    } else if (this.data.currtab === '1'){
      that.waitPayShow()
    } else {
      that.lostShow()
    }
    // switch (this.data.currtab) {
    //   case 0:
    //     that.alreadyShow()
    //     break
    //   case 1:
    //     that.waitPayShow()
    //     break
    //   case 2:
    //     that.lostShow()
    //     break
    // }
  },

  alreadyShow: function() {
    var _this = this;
    db.collection('orders').where({
        ownerid: app.globalData.openid,
        state: "未完成"
      }).get({
        success: res => {
          // console.log(res.data);
          this.setData({
            waitPayOrder: res.data
          })
        }
      }),
      db.collection('orders').where({
        ownerid: app.globalData.openid,
        state: "已完成"
      }).get({
        success: res => {
          // console.log(res.data);
          this.setData({
            lostOrder: res.data
          })

        }
      })
  },

  waitPayShow: function() {
    var _this = this;
    db.collection('orders').where({
      ownerid: app.globalData.openid,
      state: "未完成"
    }).get({
      success: res => {
        // console.log(res.data);
        this.setData({
          waitPayOrder: res.data
        })
      }
    })
  },

  lostShow: function() {
    var _this = this;
    db.collection('orders').where({
      ownerid: app.globalData.openid,
      state: "已完成"
    }).get({
      success: res => {
        // console.log(res.data);
        this.setData({
          lostOrder: res.data
        })

      }
    })
  },

  lookForDetail: function(e) {
    var goodid = e.currentTarget.dataset.goodid;
    var maijiaid = e.currentTarget.dataset.buyerid;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id=' + goodid + '&openid=' + maijiaid,
    })
  },

  cancelGoods(e) {
    db.collection('goods').doc(e.currentTarget.dataset.goodid).update({
      data: {
        goodsState:'下架'
      },
      success: res => {
        wx.showToast({
          title: '下架成功',
        })
        console.log("删除成功")
        console.error('[数据库] [删除记录] 成功：', err)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '该商品已下架',
        })
        console.log("删除失败")
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  },

  contact: function(event){
    var sender = event.currentTarget.dataset.buyerid;
    var receiver = app.globalData.openid;
    wx.navigateTo({
      url: '../message/message?sender=' + sender + '&receiver=' + receiver
    });
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

  }
})