var config=require('../../config.js'); //导入配置文件

//将秒数转换为分秒的表示形式
var formatSeconds = function (value) {
  var time = parseFloat(value);
  var m = Math.floor(time / 60);
  var s = time - m * 60;

  return [m, s].map(formatNumber).join(':');

  function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    music:[],
    playid:"",
    playimg:"",
    playtest:"",
    loading: false, //加载标志
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var topid = options.id; //获取页面跳转传过来的参数

    this.setData({
      loading: true   //显示加载提示信息
    })

    //加载歌曲列表
    wx.request({
      url: config.config.hotUrl, //热门榜单接口
      data: { topid: topid },       //歌曲类别编号

      success: function (e) {

        if (e.statusCode == 200) {
          var songlist = e.data.showapi_res_body.pagebean.songlist;
          //将时长转换为分秒的表示形式
          for (var i = 0; i < songlist.length; i++) {
            songlist[i].seconds = formatSeconds(songlist[i].seconds);
          }

          self.setData({
            //保存歌曲列表
            music: songlist,
            loading: false //隐藏加载提示信息
          });
          
          // 将歌曲列表保存到本地缓存中
          wx.setStorageSync('songlist', songlist);
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var playimg = getApp().img;
    var playtest = getApp().test;
    this.setData({
      playimg: playimg,
      playtest: playtest
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