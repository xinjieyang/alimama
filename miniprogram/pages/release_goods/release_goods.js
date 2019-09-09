var app = getApp();
import { $init, $digest } from '../../utils/common.util'

Page({
  data: {
    yulanimages: [],
    title: "",//名称
    info: "",//新旧程度
    point: "",//商品简介
    price: "",//商品价格
    state: [{//商品状态
      name: "下架",
      id: 0
    }, {
      name: "上架",
      id: 1
    }],
    productID: 0,
    category: [{//商品类别
      title: "女装",
      id: 0
    }, {
      title: "男装",
      id: 1
    }, {
      title: "配饰",
      id: 2
    }, {
      title: "箱包",
      id: 3
    }, {
      title: "食品",
      id: 4
    }, {
      title: "美妆",
      id: 5
    }, {
      title: "日用品",
      id: 6
    }, {
      title: "其他",
      id: 7
    }],
    categoryInd: 0, //类别
    stateInd: 1, //状态
    yulanfileID: []
  },

  onLoad(options) {
    this.setData({

    })
    $init(this)
  },

  /**
  * 获取标题
  */
  titleBlur(e) {
    this.setData({
      title: e.detail.value
    })
  },
  /**
   * 获取商品价格
   */
  priceBlur(e) {
    this.setData({
      price: e.detail.value
    })
  },
  /**
   * 获取商品新旧程度
   */
  infoBlur(e) {
    this.setData({
      info: e.detail.value
    })
  },
  /**
   * 获取商品简介
   */
  pointBlur(e) {
    this.setData({
      point: e.detail.value
    })
  },
  /** 
   * 商品价格
   */
  price(e) {
    this.setData({
      price: e.detail.value
    })
  },
  /**
   * 商品状态
   */
  state(e) {
    this.setData({
      stateInd: e.detail.value
    })
  },
  /**
   * 商品类别
   */
  category(e) {
    this.setData({
      categoryInd: e.detail.value
    })
  },

  chooseyulanImage(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.yulanimages.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        this.data.yulanimages = images.length < 4 ? images : images.slice(0, 4)
        $digest(this)
      }
    })
  },

  removeyulanImage(e) {
    const idx = e.target.dataset.idx
    this.data.yulanimages.splice(idx, 1)
    $digest(this)
  },

  handleyulanImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.yulanimages
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },

  formSubmit(e) {
    let that = this
    if (e.detail.value.title === "") {
      wx.showToast({
        title: '请输入商品名称',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (e.detail.value.price === "") {
      wx.showToast({
        title: '请输入商品价格',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (e.detail.value.info === "") {
      wx.showToast({
        title: '请输入商品新旧程度',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (e.detail.value.point === "") {
      wx.showToast({
        title: '请输入商品简介',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (that.data.categoryInd === -1) {
      wx.showToast({
        title: '请选择商品类别',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (that.data.stateInd === -1) {
      wx.showToast({
        title: '请选择商品状态',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (that.data.yulanimages.length === 0) {
      wx.showToast({
        title: '请选择预览图片',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else {
      var imageFiles = that.data.yulanimages;
      wx.cloud.init();
      const db = wx.cloud.database();    //初始化数据库
      //for循环进行图片上传
      for (var i = 0; i < imageFiles.length; i++) {
        var imageUrl = imageFiles[i].split("/");
        var name = imageUrl[imageUrl.length - 1];//得到图片的名称
        var yulanfileID = that.data.yulanfileID;//得到data中的fileID
        wx.cloud.uploadFile({
          cloudPath: "community/goods_images/" + name,//云存储路径
          filePath: imageFiles[i],//文件临时路径
          success: res => {
            yulanfileID.push(res.fileID);
            that.setData({
              yulanfileID: yulanfileID         //更新data中的 fileID
            })
            if (yulanfileID.length === imageFiles.length) {
              //对数据库进行操作
              db.collection("goods").add({
                data: {
                  gname: this.data.title,
                  newOrOld: this.data.info,
                  price: this.data.price,
                  goodsState: this.data.state[this.data.stateInd].name,
                  gtype: this.data.category[this.data.categoryInd].title,
                  gcomment: this.data.point,
                  yulanimg: this.data.yulanfileID,
                  staticimg: this.data.yulanimages
                },
                success: function (res) {
                  console.log(res)
                  wx.showToast({
                    title: '发布成功',
                    duration: 1000,
                    mask: true,
                  })
                  console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
                },
                fail: function (err) {
                  console.log(err)
                  console.error('[数据库] [新增记录] 失败：', err)
                }
              })
            }
          }
        })
      }
      wx.navigateBack();
    }
  }
})