const app = getApp();
Page({
  data: {
    data: null,
    isSelf: false,
    id: '',
    images: [],
    markers: []
  },
  onLoad(e) {
    this.setData({
      id: e.id
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
    db.collection('goods').doc(this.data.id).get().then(response => {
      wx.hideLoading();
      this.setData({
        data: response.data,
        isSelf: app.globalData.openid === response.data._openid
      }, _ => {
        const promises = [];
        // 加载图片
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
        if (response.data.longitude) {
          const markers = [];
          markers.push({
            latitude: response.data.latitude,
            longitude: response.data.longitude
          });
          this.setData({
            markers: markers
          })
        }

      })
    });
  },
  edit() {
    wx.navigateTo({
      url: '/pages/publish/goods/goods?id=' + this.data.id
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
    db.collection('goods').doc(this.data.id).remove().then(_ => {
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
  preview(e) {
    const currentTarget = e.currentTarget;
    const index = currentTarget.dataset.index;
    wx.previewImage({
      urls: this.data.images,
      current: index
    })
  },
  navigation() {
    wx.openLocation({
      latitude: this.data.data.latitude,
      longitude: this.data.data.longitude,
      success: res => {
        console.log(res);
      }
    })
  }
})