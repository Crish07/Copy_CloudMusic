Page({
  data: {
    movies: [
      { url: '../../images/13.jpg' },
      { url: '../../images/15.jpg' },
      { url: '../../images/16.jpg' },
      { url: '../../images/17.jpg' }
    ],
    list: [
      { url: '../../images/1.jpg', test: '121万', introduce: '我们小仙女不需要男朋友', type:"4" },
      {
        url: '../../images/2.jpg', test: '129万', introduce: '爱神吻过的旋律：西方古典音乐的罗曼蒂克史', type: "3" },
      { url: '../../images/3.jpg', test: '25万', introduce: '二胡唢呐声中的爱与忠I悲欢翔集', type: "5" },
      {
        url: '../../images/4.jpg', test: '89万', introduce: '别压抑，你需要释放', type: "27" },
      { url: '../../images/5.jpg', test: '5177', introduce: '日系恋歌｜从很久以前就喜欢你了', type: "17" },
      { url: '../../images/6.jpg', test: '20万', introduce: '人聲采樣 | 后现代游吟诗人', type: "28" },
      { url: '../../images/7.jpg', test: '32678', introduce: '『古风』不解相思意，闲看窗外雨', type: "26" },
      { url: '../../images/8.jpg', test: '21万', introduce: '神道妖道人道，自求人间道', type: "6" },
      { url: '../../images/9.jpg', test: '5273', introduce: '七夕碍着你了？| 来自情侣的反击', type: "16" }
    ]
  },
  playList:function(e){
    var id = e.currentTarget.id;
    var img = e.currentTarget.dataset.img;
    var test = e.currentTarget.dataset.test;
    var app = getApp();
    app.img = img;
    app.test = test;
    wx.navigateTo({
      url: '../list/list?id=' + id
    })
  },
  //点击右上角分享
  onShareAppMessage: function () {
    return {
      title: 'CRISH',
      path: '/recommend/recommend',
      imageUrl:"../../images/bg.png"
    }
  }
})