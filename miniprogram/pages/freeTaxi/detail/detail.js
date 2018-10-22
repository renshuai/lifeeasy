const app = getApp();
Page({
  data: {
    data: null,
    isSelf: false,
    id: ''
  },
  onLoad(e) {
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
    wx.showModal({
      title: '删除提示',
      content: '确定要删除这条信息吗？',
      success: res => {
        if (res.confirm) {
          // 点击确定按钮
          this.deleteHandler();
        }
      }
    })
  },
  deleteHandler() {
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
      phoneNumber: this.data.data.phone
    })
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  }
})