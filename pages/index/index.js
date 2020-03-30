//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'WELCOME CRISH',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.switchTab({
      url: '../recommend/recommend'
    })
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  //点击右上角分享
  onShareAppMessage: function () {
    return {
      title: 'CRISH',
      path: '/recommend/recommend',
      imageUrl: "../../images/bg.png"
    }
  }
})
