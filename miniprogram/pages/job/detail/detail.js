const app = getApp();
Page({
  data: {
    data: null,
    isSelf: false,
    id: ''
  },
  onLoad(e) {
    wx.setNavigationBarTitle({
      title: '招聘信息'
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
    db.collection('job').doc(this.data.id).get().then(response => {
      wx.hideLoading();
      this.setData({
        data: response.data,
        isSelf: app.globalData.openid === response.data._openid
      }, _ => {
        const promises = [];
        if (response.data.fileIds && response.data.fileIds.length) {
          wx.showLoading({
            title: '图片加载中'
          })
          response.data.fileIds.forEach(item => {
            promises.push(wx.cloud.downloadFile({
              fileID: item
            }))
          })
          Promise.all(promises).then(response => {
            wx.hideLoading();
            const images = [];
            if (response.length) {
              response.forEach(item => {
                if (item.tempFilePath) {
                  images.push(item.tempFilePath);
                }
              })
              this.setData({
                images: images
              })
            }
          });
        }
      })
    });
  },
  edit() {
    wx.navigateTo({
      url: '/pages/publish/job/job?id=' + this.data.id
    })
  },
  delete() {
    wx.showLoading({
      title: '删除中'
    })
    const env = app.globalData.env;
    const db = wx.cloud.database({ env: env });
    db.collection('job').doc(this.data.id).remove().then(_ => {
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
  },
  showImage(e) {
    const currentTarget = e.currentTarget;
    const index = currentTarget.dataset.index;
    wx.previewImage({
      urls: this.data.images,
      current: index
    })
  }
})