var config = require('../../config.js');//导入配置文件
Page({
  data: {
    movies: [
      { url: '../../images/14.jpg' },
      { url: '../../images/18.jpg' },
      { url: '../../images/19.jpg' },
      { url: '../../images/20.jpg' }
    ],
    search: ['中国新歌声第二季', '周杰伦', '双世宠妃', '从前慢', '王俊凯', '李宇春', '林忆莲', '悟空传', '淘汰'],
    value: "",
    music: [],
    searchSub:true,
    loading: false
  },
  //点击热搜
  pushValue:function(e){
    this.setData({
      value : e.currentTarget.dataset.text
    });
    this.searchSubmit();
  },
  //保存输入的关键词
  inputing: function (e) {
    this.setData({
      value: e.detail.value
    })
    if(this.data.value == ""){
      this.setData({
        searchSub: true,
        music: []
      })
    }
  },
  //搜索按钮
  searchSubmit: function (e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var self = this;

    this.setData({
      loading: !self.data.loading//更新立即搜索按钮的loading图标
    });

    //开始搜索
    wx.request({
      url: config.config.searchByNameUrl,
      data: { keyword: e.detail.value },
      success: function (res) {
        if (res.statusCode == 200) {//搜索成功
          self.setData({
            music: res.data.showapi_res_body.pagebean.contentlist,//更新搜索结果
            loading: !self.data.loading,
            searchSub: false
          });
          wx.setStorageSync('songlist', res.data.showapi_res_body.pagebean.contentlist);
        }
      }
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