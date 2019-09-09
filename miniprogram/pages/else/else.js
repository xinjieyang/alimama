const db = wx.cloud.database({});
const cont = db.collection('goods');
Page({
  data: {
    good_list: [],
  },
  onLoad: function (options) {
    // 创建一个变量来保存页面page示例中的this, 方便后续使用 
    var _this = this; db.collection('goods').where({
      gtype: "其他",
      goodsState: "上架"
    })
      .get({
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
      url: '../detail/detail?id=' + id
    });
  }


}) 