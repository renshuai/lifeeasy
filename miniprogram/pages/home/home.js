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
        'icon': 'iconfont icon-fangzidichan',
        'type': 'house'
      },
      {
        'name': '打折优惠',
        'icon': 'iconfont icon-youhui',
        'type': 'sale'
      },
      {
        'name': '车辆服务',
        'icon': 'iconfont icon-car1'
      },
      {
        'name': '物品交易',
        'icon': 'iconfont icon-ershoushebei',
        'type': 'goods'
      },
      {
        'name': '本地服务',
        'icon': 'iconfont icon-service1'
      },
      {
        'name': '打听求助',
        'icon': 'iconfont icon-fuwu1',
        'type': 'help'
      },
      {
        'name': '本地推荐',
        'icon': 'iconfont icon-zizhutuiguang',
        'type': 'recommend'
      },
      {
        'name': '土特产',
        'icon': 'iconfont icon-tutechan',
        'type': 'speciality'
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
    } else {
      wx.showToast({
        title: '开发中'
      })
    }
  }

})
