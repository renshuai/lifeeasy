const app = getApp();
Page({
  data: {
    data: null,
    isSelf: false,
    id: ''
  },
  onLoad(e) {
    wx.setNavigationBarTitle({
      title: '顺风车'
    })
    this.setData({
      id: e.id
    }, _ => {
      this.getDetail();
    })
  },
  onShow() {
    this.getDetail();
  },
  getDetail() {
    wx.showLoading({
      title: '加载中'
    })
    const env = app.globalData.env;
    const db = wx.cloud.database({ env: env });
    db.collection('freetaxi').doc(this.data.id).get().then(response => {
      wx.hideLoading();
      this.setData({
        data: response.data,
        isSelf: app.globalData.openid === response.data._openid
      })
    });
  },
  edit() {
    wx.navigateTo({
      url: '/pages/publish/freeTaxi/freeTaxi?id=' + this.data.id
    })
  },
  delete() {
    wx.showLoading({
      title: '删除中'
    })
    const env = app.globalData.env;
    const db = wx.cloud.database({ env: env });
    db.collection('freetaxi').doc(this.data.id).remove().then(_ => {
      wx.hideLoading();
      wx.showToast({
        title: '删除成功'
      });
      wx.navigateBack({
        delta: 1
      });
    })
  },
  contact() {
    wx.makePhoneCall({
      phoneNumber: data.phone
    })
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  }
})