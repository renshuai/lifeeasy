//index.js
const app = getApp()

Page({
  data: {
    navs: [
      {
        'name': '顺风车',
        'icon': 'iconfont icon-carwei',
        'type': 'freeTaxi'
      },
      {
        'name': '招聘信息',
        'icon': 'iconfont icon-zhaopin',
        'type': 'job'
      },
      {
        'name': '房屋租售',
        'icon': 'iconfont icon-fangzidichan'
      },
      {
        'name': '打折优惠',
        'icon': 'iconfont icon-youhui'
      },
      {
        'name': '车辆服务',
        'icon': 'iconfont icon-car1'
      },
      {
        'name': '物品交易',
        'icon': 'iconfont icon-ershoushebei'
      },
      {
        'name': '本地服务',
        'icon': 'iconfont icon-fuwu'
      },
      {
        'name': '打听求助',
        'icon': 'iconfont icon-fuwu1'
      },
      {
        'name': '本地推荐',
        'icon': 'iconfont icon-zizhutuiguang'
      },
      {
        'name': '土特产',
        'icon': 'iconfont icon-tutechan'
      }
    ]
  },

  onLoad: function () {
  },
  redirectTo(e) {
    const currentTarget = e.currentTarget;
    const type = currentTarget.dataset.type;
    if (type) {
      wx.navigateTo({
        url: '/pages/' + type + '/' + type
      })
    }
  }

})
