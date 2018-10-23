const app = getApp()

Page({
  data: {
    id: '',
    type: 0,
    goods: '',
    description: '',
    price: '',
    phone: '',
    contact: '',
    images: [],
    fileIds: [],
    position: '点我选择位置',
    address: '',
    latitude: '',
    longitude: '',
    markers: []
  },
  onLoad(e) {
    // 先判断是否是修改还是新添加
    if (e.id) {
      wx.showLoading({
        title: '加载中'
      })
      // 有id值说明是修改
      const env = app.globalData.env;
      const db = wx.cloud.database({ env: env });
      db.collection('goods').doc(e.id).get().then(response => {
        wx.hideLoading();
        const data = response.data;
        this.setData({
          type: +data.type,
          goods: data.goods,
          description: data.description,
          price: data.price,
          phone: data.phone,
          contact: data.contact,
          fileIds: data.fileIds,
          position: (data.latitude ? data.position : '点我选择位置'),
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          id: e.id
        }, _ => {
          const promises = [];
          if (data.fileIds && data.fileIds.length) {
            wx.showLoading({
              title: '图片加载中'
            })
            data.fileIds.forEach(item => {
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
      })
    }
  },
  publish() {
    if ((!this.data.goods && !this.data.description) || !this.data.phone) {
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
      db.collection('goods').doc(this.data.id).update({
        data: {
          type: +this.data.type,
          goods: this.data.goods,
          price: this.data.price,
          description: this.data.description,
          phone: this.data.phone,
          contact: this.data.contact,
          fileIds: this.data.fileIds,
          position: (this.data.latitude ? this.data.position : ''),
          address: this.data.address,
          latitude: this.data.latitude,
          longitude: this.data.longitude,
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
      db.collection('goods').add({
        data: {
          type: +this.data.type,
          goods: this.data.goods,
          price: this.data.price,
          description: this.data.description,
          phone: this.data.phone,
          contact: this.data.contact,
          fileIds: this.data.fileIds,
          position: (this.data.latitude ? this.data.position : ''),
          address: this.data.address,
          latitude: this.data.latitude,
          longitude: this.data.longitude,
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
  radioChange(e) {
    this.setData({
      type: +e.detail.value
    })
  },
  inputGoodsBlur(e) {
    this.setData({
      goods: e.detail.value
    })
  },
  inputPriceBlur(e) {
    this.setData({
      price: e.detail.value
    })
  },
  inputPhoneBlur(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  inputContactBlur(e) {
    this.setData({
      contact: e.detail.value
    })
  },
  inputDescriptionBlur(e) {
    this.setData({
      description: e.detail.value
    })
  },
  upload() {
    const self = this;
    wx.chooseImage({
      success(res) {
        wx.showLoading({
          title: '上传中'
        })
        const tempFilePaths = res.tempFilePaths
        if (tempFilePaths.length) {
          const promises = [];
          tempFilePaths.forEach(item => {
            const cloudPath = item.split('tmp')[1].substring(1);
            promises.push(wx.cloud.uploadFile({
              cloudPath: cloudPath,
              filePath: item
            }));
          })
          Promise.all(promises).then(response => {
            wx.hideLoading();
            wx.showToast({
              title: '上传成功'
            })
            const fileIds = [];
            if (response.length) {
              response.forEach(item => {
                fileIds.push(item.fileID);
              })
              self.setData({
                fileIds: [...self.data.fileIds, ...fileIds],
                images: [...self.data.images, ...tempFilePaths]
              })
            }
          })
        }
      }
    })
  },
  delete(e) {
    const currentTarget = e.currentTarget;
    const index = currentTarget.dataset.index;
    wx.showModal({
      title: '删除提示',
      content: '是否删除该张图片',
      success: res => {
        if (res.confirm) {
          // 点击确定按钮
          this.deleteHandler(index);
        }
      }
    })
  },
  deleteHandler(index) {
    wx.showLoading({
      title: '图片删除中'
    })
    wx.cloud.deleteFile({
      fileList: [this.data.fileIds[index]]
    }).then(response => {
      wx.hideLoading();
      const fileIds = this.data.fileIds;
      const images = this.data.images;
      fileIds.splice(index, 1);
      images.splice(index, 1);
      this.setData({
        fileIds: fileIds,
        images: images
      }, _ => {
        wx.showToast({
          title: '删除成功'
        })
      })
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
  choosePosition() {
    wx.chooseLocation({
      success: (res) => {
        console.log(res);
        this.setData({
          position: res.name,
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude,
          }]
        })
      }
    })
  }
})