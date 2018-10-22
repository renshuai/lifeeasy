//index.js
const app = getApp()
const util = require('../../utils/util.js');

Page({
  data: {
    activeIndex: '0',
    list: [],
    list0: [],
    list1: [],
    list2: []
  },
  onShow() {
    this.setData({
      list: [],
      list1: [],
      list2: [],
      list0: []
    }, _ => {
      this.getData();
    });
  },
  tabClick(e) {
    const currentTarget = e.currentTarget;
    const index = currentTarget.dataset.index;
    this.setData({
      activeIndex: index,
      list: this.data['list' + index]
    }, _ => {
      if (!this.data['list' + this.data.activeIndex].length) {
        this.getData();
      }
    })
  },
  getData(isPullDown,isFromBottomCallback) {
    wx.showLoading({
      title: (isPullDown ? '下拉刷新中' : '加载中')
    });
    const env = app.globalData.env;
    const db = wx.cloud.database({ env: env });
    // 判断当前是有有数据，确定是否使用skip
    if (this.data.list.length) {
      if (this.data.activeIndex === '0') {
        return db.collection('freetaxi').limit(app.globalData.limit).skip(this.data.list.length).get().then(res => {
          wx.hideLoading();
          let data = res.data;
          if (data.length) {
            const list0 = [...this.data.list0, ...data];
            this.setData({
              list0: list0,
              list: list0
            }, _ => {
              return true;
            })
          } else {
            if (isFromBottomCallback) {
              wx.showToast({
                title: '没有更多了'
              })
            }
          }
        })
      } else if (this.data.activeIndex === '1') {
        db.collection('freetaxi').where({
          type: '0'
        }).limit(app.globalData.limit).skip(this.data.list.length).get().then(res => {
          wx.hideLoading();
          let data = res.data;
          if (data.length) {
            const list1 = [...this.data.list1, ...data];
            this.setData({
              list1: list1,
              list: list1
            })
          } else {
            if (isFromBottomCallback) {
              wx.showToast({
                title: '没有更多了'
              })
            }
          }
        })
      } else if (this.data.activeIndex === '2') {
        db.collection('freetaxi').where({
          type: '1'
        }).limit(app.globalData.limit).skip(this.data.list.length).get().then(res => {
          wx.hideLoading();
          let data = res.data;
          if (data.length) {
            const list2 = [...this.data.list2, ...data];
            this.setData({
              list2: list2,
              list: list2
            })
          } else {
            if (isFromBottomCallback) {
              wx.showToast({
                title: '没有更多了'
              })
            }
          }
        })
      }
    } else {
      if (this.data.activeIndex === '0') {
        db.collection('freetaxi').limit(app.globalData.limit).get().then(res => {
          wx.hideLoading();
          let data = res.data;
          if (data.length) {
            const list0 = [...this.data.list0, ...data];
            this.setData({
              list0: list0,
              list: list0
            })
          } else {
            wx.showToast({
              title: '暂时无数据'
            })
          }
        })
      } else if (this.data.activeIndex === '1') {
        db.collection('freetaxi').where({
          type: '0'
        }).limit(app.globalData.limit).get().then(res => {
          wx.hideLoading();
          let data = res.data;
          if (data.length) {
            const list1 = [...this.data.list1, ...data];
            this.setData({
              list1: list1,
              list: list1
            })
          } else {
            wx.showToast({
              title: '暂时无数据'
            })
          }
        })
      } else if (this.data.activeIndex === '2') {
        db.collection('freetaxi').where({
          type: '1'
        }).limit(app.globalData.limit).get().then(res => {
          wx.hideLoading();
          let data = res.data;
          if (data.length) {
            const list2 = [...this.data.list2, ...data];
            this.setData({
              list2: list2,
              list: list2
            })
          } else {
            wx.showToast({
              title: '暂时无数据'
            })
          }
        })
      }
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
  },
  onReachBottom() {
    this.getData(false,true);
  },
  onPullDownRefresh() {
    if (this.data.activeIndex === '0') {
      this.setData({
        list0: [],
        list: []
      }, _ => {
        wx.stopPullDownRefresh();
        this.getData(true);
      })
    } else if (this.data.activeIndex === '1') {
      this.setData({
        list1: [],
        list: []
      }, _ => {
        wx.stopPullDownRefresh();
        this.getData(true);
      }) 
    } else if (this.data.activeIndex === '2') {
      this.setData({
        list2: [],
        list: []
      }, _ => {
        wx.stopPullDownRefresh();
        this.getData(true);
      }) 
    }
  }

})
