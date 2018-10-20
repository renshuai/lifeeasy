const app = getApp()
const util = require('../../../utils/util.js');

Page({
  data: {
    id: '',
    type: '0',
    time: '09:00',
    date: '2015-09-01',
    from: '',
    to: '',
    name: '',
    array: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    index: 0,
    phone: ''
  },
  onLoad(e) {
    wx.setNavigationBarTitle({
      title: '顺风车-信息发布'
    });
    // 先判断是否是修改还是新添加
    if (e.id) {
      wx.showLoading({
        title: '加载中'
      })
      // 有id值说明是修改
      const env = app.globalData.env;
      const db = wx.cloud.database({ env: env });
      db.collection('freetaxi').doc(e.id).get().then(response => {
        wx.hideLoading();
        const data = response.data;
        const time = data.time.split(' ')[1];
        const date = data.time.split(' ')[0];
        this.setData({
          type: data.type,
          time: time,
          date: date,
          from: data.from,
          to: data.to,
          name: data.name,
          index: data.number ? this.data.array.indexOf(data.number) : 0,
          phone: data.phone,
          id: e.id
        })
      })
    } else {
      this.initTime();
    }
  },
  radioChange(e) {
    this.setData({
      type: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  initTime() {
    const date = new Date();
    let timestamp = Date.parse(date);
    date.setTime(timestamp + 30 * 60 * 1000);
    const timeObj = util.formatTime(date);
    this.setData({
      time: timeObj.time,
      date: timeObj.date
    })
  },
  publish() {
    if (!this.data.from || !this.data.to || !this.data.phone) {
      wx.showToast({
        title: '必填项不能为空'
      })
      return;
    }
    const env = app.globalData.env;
    const db = wx.cloud.database({ env: env });
    if (this.data.id) {
      wx.showLoading({
        title: '修改中'
      });
      db.collection('freetaxi').doc(this.data.id).update({
        data: {
          type: this.data.type,
          from: this.data.from,
          to: this.data.to,
          name: this.data.name,
          number: this.data.array[this.data.index],
          phone: this.data.phone,
          time: this.data.date + ' ' + this.data.time,
          timestamp: Date.parse(new Date())
        }
      }).then(_ => {
        wx.hideLoading();
        wx.showToast({
          title: '修改成功',
          success: _ => {
            wx.navigateBack({
              delta: 1
            })
          }
        });
      })
    } else {
      wx.showLoading({
        title: '发布中'
      });
      db.collection('freetaxi').add({
        data: {
          type: this.data.type,
          from: this.data.from,
          to: this.data.to,
          name: this.data.name,
          number: this.data.array[this.data.index],
          phone: this.data.phone,
          time: this.data.date + ' ' + this.data.time,
          timestamp: Date.parse(new Date())
        }
      }).then(response => {
        wx.hideLoading();
        wx.showToast({
          title: '发布成功',
          success: _ => {
            wx.navigateBack({
              delta: 1
            })
          }
        });
      })
    }
    
  },
  cancel() {
    wx.navigateBack({
      delta: 1
    })
  },
  inputFromBlur(e) {
    this.setData({
      from: e.detail.value
    })
  },
  inputToBlur(e) {
    this.setData({
      to: e.detail.value
    })
  },
  inputPhoneBlur(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  inputNameBlur(e) {
    this.setData({
      name: e.detail.value
    })
  }
})