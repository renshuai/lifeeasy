//index.js
const app = getApp()
const util = require('../../utils/util.js');

Page({
  data: {
    activeIndex: '0',
    list: []
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '顺风车'
    });
    this.getData();
  },
  onShow() {
    this.getData();
  },
  tabClick(e) {
    const currentTarget = e.currentTarget;
    const index = currentTarget.dataset.index;
    this.setData({
      activeIndex: index
    }, _ => {
      this.getData();
    })
  },
  getData() {
    wx.showLoading({
      title: '加载中'
    });
    const env = app.globalData.env;
    const db = wx.cloud.database({ env: env });
    if (this.data.activeIndex === '0') {
      db.collection('freetaxi').get().then(res => {
        wx.hideLoading();
        let data = res.data;
        this.setData({
          list: res.data
        })
      })
    } else if (this.data.activeIndex === '1') {
      db.collection('freetaxi').where({
        type: '0'
      }).get().then(res => {
        wx.hideLoading();
        let data = res.data;
        this.setData({
          list: res.data
        })
      })
    } else if (this.data.activeIndex === '2') {
      db.collection('freetaxi').where({
        type: '1'
      }).get().then(res => {
        wx.hideLoading();
        let data = res.data;
        this.setData({
          list: res.data
        })
      })
    }
  },
  publish() {
    wx.navigateTo({
      url: '/pages/publish/freeTaxi/freeTaxi',
    })
  },
  showDetail(e) {
    const currentTarget = e.currentTarget;
    const id = currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/freeTaxi/detail/detail?id=' + id
    })
  }

})
