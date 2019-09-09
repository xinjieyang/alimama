var app = getApp();
const db = wx.cloud.database()
Page({
  data: {
    good_list: [],
  },

  //通过获取的input文本搜索数据库knkk
  onLoad: function (options) {
    //var i = app.globalData.input  //获取输入框输入内容
    var i = options.id 
    if (i != '') {
      db.collection('goods')
        .where({
          gname: db.RegExp({
            regexp: i,
          }), //匹配输入内容(模糊匹配)
          goodsState: "上架"
        })
        .get({
          success: res => {
            this.setData({ good_list: res.data })
            console.log('搜索成功', res.data)
          }
        })
    } else {
      //弹出不能空白搜索!
      wx.showToast({
        title: '不能空白搜索哦~',
        icon: 'loading',
        duration: 3000,
      })
      console.log('空白搜索')
    }
  },

  viewItem: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    });
  }

})