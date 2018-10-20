//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {
      'env': 'lifeeasy-88481e',
      'place': '交城'
    }
    this.onGetOpenid();
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.globalData.openid = res.result.openid
      },
      fail: err => {
        wx.showToast({
          title: '获取用户信息失败'
        })
      }
    })
  },
})
