//index.js
const app = getApp()
const util = require('../../utils/util.js');

Page({
  data: {
    list: [],
  },
  onShow() {
    this.setData({
      list: []
    }, _ => {
      this.getData();
    })
  },
  getData(isFromPullDown, isFromBottomCallback) {
    wx.showLoading({
      title: isFromPullDown ? '下拉刷新中' : '加载中'
    });
    const env = app.globalData.env;
    const db = wx.cloud.database({ env: env });
    // 根据当前数据确定是否需要skip
    if (this.data.list.length > 0) {
      db.collection('recommend').limit(app.globalData.limit).skip(this.data.list.length).get().then(response => {
        let data = response.data;
        this.handleData(data, isFromBottomCallback);
      })
    } else {
      db.collection('recommend').limit(app.globalData.limit).get().then(response => {
        wx.hideLoading();
        let data = response.data;
        this.handleData(data, false);
      })
    }

  },
  handleData(data, isFromBottomCallback) {
    if (data.length > 0) {
      // 下载所有的封面图
      const promises = [];
      data.forEach(item => {
        const fileIds = item.fileIds;
        if (fileIds.length) {
          let fileId = fileIds[0];
          promises.push(wx.cloud.downloadFile({
            fileID: fileId
          }));
        } else {
          promises.push((new Promise(resolve => {
            resolve(false)
          })))
        }
      })
      Promise.all(promises).then(responses => {
        wx.hideLoading();
        if (responses.length) {
          responses.forEach((item, index) => {
            if (item && item.tempFilePath) {
              data[index]['cover'] = item.tempFilePath;
            }
          })
          const list = [...this.data.list, ...data];
          this.setData({
            list: list
          })
        }
      })
    } else {
      wx.hideLoading();
      // 没有数据时，判断当前是否有列表数据
      if (this.data.list.length) {
        if (isFromBottomCallback) {
          // 只有滚动到最后无数据时才提示没有
          wx.showToast({
            title: '没有更多了'
          })
        }
      } else {
        wx.showToast({
          title: '暂时无数据'
        })
      }
    }
  },
  publish() {
    wx.navigateTo({
      url: '/pages/publish/recommend/recommend',
    })
  },
  showDetail(e) {
    const currentTarget = e.currentTarget;
    const id = currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/recommend/detail/detail?id=' + id
    })
  },
  onReachBottom() {
    this.getData(false, true);
  },
  onPullDownRefresh() {
    this.setData({
      list: []
    }, _ => {
      wx.stopPullDownRefresh();
      this.getData(true);
    })
  }

})
