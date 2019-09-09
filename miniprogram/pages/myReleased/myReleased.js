const db = wx.cloud.database();
var app = getApp()
const cont = db.collection('goods');
Page({
  data: {
    good_list: [],
  },

  onShow: function () {
    // 创建一个变量来保存页面page示例中的this, 方便后续使用 
    var _this = this; 
    db.collection('goods').where({
      _openid: app.globalData.openid
    }).get({
        success: res => {
          // console.log(res.data);
          this.setData({ good_list: res.data })
        }
      })
  },

  viewItem: function (event) {
    console.log(event)
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../editGoods/editGoods?id=' + id
    });
  }


}) 