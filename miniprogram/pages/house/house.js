//index.js
const app = getApp()
const util = require('../../utils/util.js');

Page({
  data: {
    activeIndex: 1,
    list: [],
    list1: [],
    list2: [],
    list3: [],
    list4: []
  },
  onShow() {
    this.setData({
      list: [],
      list1: [],
      list2: [],
      list3: [],
      list4: []
    }, _ => {
      this.getData();
    })
  },
  tabClick(e) {
    const currentTarget = e.currentTarget;
    const index = currentTarget.dataset.index;
    this.setData({
      activeIndex: +index,
      list: this.data['list' + index]
    }, _ => {
      if (!this.data['list' + this.data.activeIndex].length) {
        this.getData();
      }
    })
  },
  getData(isFromPullDown,isFromBottomCallback) {
    wx.showLoading({
      title: isFromPullDown ? '下拉刷新中' : '加载中'
    });
    const env = app.globalData.env;
    const db = wx.cloud.database({ env: env });
    // 根据当前数据确定是否需要skip
    if (this.data.list.length > 0) {
      db.collection('house').where({
        typeIndex: +this.data.activeIndex
      }).limit(app.globalData.limit).skip(this.data.list.length).get().then(response => {
        wx.hideLoading();
        let data = response.data;
        this.handleData(data, isFromBottomCallback);
      })
    } else {
      db.collection('house').where({
        typeIndex: +this.data.activeIndex
      }).limit(app.globalData.limit).get().then(response => {
        wx.hideLoading();
        let data = response.data;
        this.handleData(data, false);
      })
    }
    
  },
  handleData(data, isFromBottomCallback) {
    if (data.length > 0) {
      wx.showLoading({
        title: '加载封面图中'
      })
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
          if (+this.data.activeIndex === 1) {
            const list1 = [...this.data.list1, ...data];
            this.setData({
              list1: list1,
              list: list1
            })
          } else if (+this.data.activeIndex === 2) {
            const list2 = [...this.data.list2, ...data];
            this.setData({
              list2: list2,
              list: list2
            })
          } else if (+this.data.activeIndex === 3) {
            const list3 = [...this.data.list3, ...data];
            this.setData({
              list3: list3,
              list: list3
            })
          } else if (+this.data.activeIndex === 4) {
            const list4 = [...this.data.list4, ...data];
            this.setData({
              list4: list4,
              list: list4
            })
          }
        }
      })
    } else {
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
      url: '/pages/publish/house/house',
    })
  },
  showDetail(e) {
    const currentTarget = e.currentTarget;
    const id = currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/house/detail/detail?id=' + id
    })
  },
  onReachBottom() {
    this.getData(false, true);
  },
  showDetail(e) {
    const currentTarget = e.currentTarget;
    const id = currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/house/detail/detail?id=' + id
    })
  },
  onPullDownRefresh() {
    if (this.data.activeIndex === 1) {
      this.setData({
        list1: [],
        list: []
      }, _ => {
        wx.stopPullDownRefresh();
        this.getData(true);
      })
    } else if (this.data.activeIndex === 2) {
      this.setData({
        list2: [],
        list: []
      }, _ => {
        wx.stopPullDownRefresh();
        this.getData(true);
      })
    } else if (this.data.activeIndex === 3) {
      this.setData({
        list3: [],
        list: []
      }, _ => {
        wx.stopPullDownRefresh();
        this.getData(true);
      })
    } else if (this.data.activeIndex === 4) {
      this.setData({
        list4: [],
        list: []
      }, _ => {
        wx.stopPullDownRefresh();
        this.getData(true);
      })
    }
    // this.setData({
    //   list: [],
    //   list1: [],
    //   list2: [],
    //   list3: [],
    //   list4: []
    // }, _ => {
    //   this.getData();
    // })
  }

})
