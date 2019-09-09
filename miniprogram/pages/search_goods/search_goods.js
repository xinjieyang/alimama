var app = getApp();
Page({
  data: {
    searchKey: "",
    history: [],
  },
  //获取input文本
  getSearchKey: function (e) {    
    this.setData({
      searchKey: e.detail.value,
      //app.globalData.input = this.data.searchKey,
    })
      //console.log(app.input)
  },
/*
  btnClick: function(){       
      wx.navigateTo({
      url: '../displaySearch/displaySearch'
    })
  } ,
*/
  btnClick: function (event) {
    //console.log(event)
    var id = this.data.searchKey;

    wx.navigateTo({
      url: '../displaySearch/displaySearch?id='+id
    });
  },


  // 清空page对象data的history数组 重置缓存为[]
  clearHistory: function () {
    this.setData({
      history: []
    })
    wx.setStorageSync("history", [])
  },
  // input失去焦点函数
  routeToSearchResPage: function (e) {
    //对历史记录的点击事件 已忽略
    let _this = this;
    let _searchKey = this.data.searchKey;
    if (!this.data.searchKey) {
      return
    }

    let history = wx.getStorageSync("history") || [];
    history.push(this.data.searchKey)
    wx.setStorageSync("history", history);
  },
  //每次显示钩子函数都去读一次本地storage
  onShow: function () {
    this.setData({
      history: wx.getStorageSync("history") || []
    })
  }
})