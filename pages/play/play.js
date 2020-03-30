var config = require('../../config.js'); //导入配置文件
var interval;//动画定时器
var duration = 0; //播放时长
var n = 0;//动画调用时间

Page({
  data: {
    song: {},  //传入的歌曲信息
    islyric: false,//歌词专辑图片切换显示
    isPlaying: false, //播放状态
    animationData: {}, //播放动画
    lyricArr: [] //分割后的歌词
  },

  //歌词
  showCircle: function () {
    this.setData({
      islyric: false
    })
  },
  //歌手图片
  showlyric: function () {
    this.setData({
      islyric: true
    })
  },

  //页面载入事件处理函数
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '正在播放'
    })
    var self = this;

    var songid = options.songid; //获取页面跳转传过来的参数(歌曲对象)

    if (songid === undefined) { //未传入歌曲ID
      var curSong = wx.getStorageSync('curSong') || {}; //从缓存中获取歌曲

      if (curSong === undefined) { //缓存中无歌曲
        var song = { songname: '未选择歌曲' }; //显示未选择歌曲
        this.setData({
          song: song
        })

      } else {
        this.setData({
          song: curSong
        });
      }

    } else {
      var songlist = wx.getStorageSync('songlist') || []; //从缓存中取出歌曲列表
      //在歌曲列表中查找songid指定的歌曲
      for (var i = 0; i < songlist.length; i++) {
        if (songlist[i].songid == songid) {  //找到对应的歌曲        
          this.setData({
            song: songlist[i]   //更新歌曲
          });
          break;
        }
      }
      
    }
    //更新播放状态
    this.setData({
      isPlaying: !this.data.isPlaying
    });
  },

  //页面显示
  onShow: function () {

    var that = this;

    //播放歌曲
    wx.playBackgroundAudio({
      dataUrl: that.data.song.url || that.data.song.m4a,
      success: function (res) {
        //获取播放时长
        that.getSongTime();
      }
    });

    //缓存正在播放的歌曲
    wx.setStorageSync('curSong', this.data.song);

    this.getMusictime();//播放完时

    interval = setInterval(function () { //调用播放动画
      that.rotateImg(n);
      n++;
    }, 180);

    var songlist = wx.getStorageSync('curSong');
    var id = songlist.songid;

    getlyric(id, function (lyricArr) {
      that.setData({
        lyricArr: lyricArr
      })
    })
  },

  //播放/暂停
  playToggle: function () {
    var self = this;
    if (this.data.isPlaying) { //正在播放
      wx.pauseBackgroundAudio(); //暂停播放歌曲
      // this.setData({
      //   isPlaying: !this.data.isPlaying
      // });
      wx.setNavigationBarTitle({
        title: '已停止'
      })
      clearInterval(interval);//清除动画
    } else {//未播放，则开始播放

      //播放歌曲
      wx.playBackgroundAudio({
        dataUrl: this.data.song.url || this.data.song.m4a,
        success: function (res) {
          //获取播放时长
          self.getSongTime();
        }
      })
      interval = setInterval(function () { //调用播放动画
        self.rotateImg(n);
        n++;
      }, 180);
      wx.setNavigationBarTitle({
        title: '正在播放'
      })
    }

    //更新播放状态
    this.setData({
      isPlaying: !this.data.isPlaying
    });
  },

  //播放停止时
  getMusictime: function () {
    var that = this;
    wx.onBackgroundAudioStop(function () {//播放停止时
      that.setData({
        isPlaying: !that.data.isPlaying
      })
      that.nextsong();//自动调用下一首
    });
    clearInterval(interval);//清除动画
  },

  //获取播放时长
  getSongTime: function () {
    var that = this;
    setTimeout(function () {
      wx.getBackgroundAudioPlayerState({
        success: function (res) {
          duration = parseInt(res.duration);
        }
      })
    }, 1000)
  },

  //播放动画
  rotateImg: function (n) {
    //定义播放动画
    var animation = wx.createAnimation({
      duration: duration
    });
    this.animation = animation;

    animation.rotate(5 * n).step();

    this.setData({
      animationData: this.animation.export()
    });
  },

  // 上一首
  prevsong: function () {
    var that = this;
    var id = this.data.song.songid; //当前音乐
    wx.stopBackgroundAudio(); //停止播放歌曲
    wx.getStorage({
      key: "songlist",
      success: function (res) {
        let currentSongIndex = res.data.findIndex((item) => {
          return item.songid == id;
        })
        currentSongIndex--;//获取到上一首的index值
        if (currentSongIndex < 0) {//如果是第一首歌
          currentSongIndex = res.data.length - 1;
        }

        that.setData({
          song: res.data[currentSongIndex]
        })
        //缓存即将播放的歌曲
        wx.setStorageSync('curSong', that.data.song);

        wx.redirectTo({
          url: '../play/play'
        })
      }
    })
  },
  //下一首
  nextsong: function () {
    var that = this;
    var id = this.data.song.songid; //当前音乐
    wx.stopBackgroundAudio(); //停止播放歌曲
    wx.getStorage({
      key: "songlist",
      success: function (res) {
        let currentSongIndex = res.data.findIndex((item) => {
          return item.songid == id;
        })
        currentSongIndex++;//获取到上一首的index值
        if (currentSongIndex == res.data.length) {//如果是最后一首歌
          currentSongIndex = 0;
        }

        that.setData({
          song: res.data[currentSongIndex]
        })
        //缓存即将播放的歌曲
        wx.setStorageSync('curSong', that.data.song);

        wx.redirectTo({
          url: '../play/play'
        })
      }
    })
  },
  //点击右上角分享
  onShareAppMessage: function () {
    return {
      title: '分享'+this.data.song.songname,
      path: '/play/play',
      imageUrl: this.data.song.albumpic_big
    }
  }
})

//获取歌词
function getlyric(id, cb) {
  wx.request({
    url: config.config.searchByIdUrl,
    data: {
      musicid: id
    },
    success: function (res) {
      let lyric = res.data.showapi_res_body.lyric; //获取到歌词
      let timearr = lyric.split('['); //分割歌词
      let obj = {};
      let lyricArr = [];
      // seek 为键  歌词为value
      timearr.forEach((item) => {
        let key = parseInt(item.split(']')[0].split(':')[0]) * 60 + parseInt(item.split(']')[0].split(';')[1]);
        let val = item.split(']')[1];
        obj[key] = val;
      })
      for (let key in obj) {
        obj[key] = obj[key].split("&")[0];
        lyricArr.push(obj[key]);
      }

      cb && cb(lyricArr);
    }
  })
}