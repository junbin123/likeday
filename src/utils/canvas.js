/**
 * canvas绘制方法封装
 * @author 何龙
 * @tel 15797710821
 * @date 2021-05-14 12:26:33
 */
export default class CanvasContext {
  /**
   * 初始化
   * @param {String} id 创建画布ID
   * @param {Object} component 组件使用时需要传入组件this对象
   */
  constructor (
    id,
    canvasOptions = {
      width: 0,
      height: 0,
      format: 'jpg',
      quality: 1
    },
    component
  ) {
    this.id = id
    this.component = component // 组件使用需要传入当前组件this

    this.imageQueue = [] // 存储下载图数组
    this.imageQueueBackup = [] // 图片备份
    this.renderQueue = [] // 渲染函数队列
    this.canvasOptions = canvasOptions // 存储指定this对象
    this.init() // 初始化创建画布
  }

  /**
   * 当前创建的canvas实例对象
   * @returns 返回当前创建canvas实例对象
   */
  newCtx () {
    return this.ctx
  }

  /**
   * 适配比例计算
   * @returns 返回比例倍数
   */
  upx () {
    let upx = 1
    uni.getSystemInfo({
      success: function (res) {
        upx = res.windowWidth / 375
      }
    })
    return upx
  }

  /**
   * 初始化
   */
  init () {
    this.ctx = uni.createCanvasContext(this.id, this.component)
  }

  /**
   * canvas渲染函数执行
   */
  render () {
    this.renderQueue.forEach(ele => {
      ele()
    })
    this.imageQueue = JSON.parse(JSON.stringify(this.imageQueueBackup))
  }

  box (options) {
    const render = () => {
      this.boxRender(options)
    }
    this.renderQueue.push(render)
    return this
  }

  boxRender (options) {
    this.ctx.save()
    this.setBackground(options)
    this.setBorder(options)
    // this.setTransform(options)
    if (options.radius) {
      const { x, y } = options
      const w = options.width
      const h = options.height
      const r = options.radius
      this.drawRadiusRoute(x, y, w, h, r)
      this.ctx.fill()
    } else {
      this.ctx.fillRect(options.x, options.y, options.width, options.height)
    }
    this.ctx.restore()
  }

  clipBox (options) {
    const render = () => {
      this.clipBoxRender(options)
    }
    this.renderQueue.push(render)
    return this
  }

  restore () {
    const render = () => {
      this.ctx.restore()
    }
    this.renderQueue.push(render)
    return this
  }

  // 裁剪绘制
  clipBoxRender (options) {
    this.ctx.save()
    this.setBackground(options)
    this.setBorder(options)
    if (options.radius) {
      const { x, y } = options
      const w = options.width
      const h = options.height
      const r = options.radius
      this.drawRadiusRoute(x, y, w, h, r)
      this.ctx.fill()
    } else {
      this.ctx.fillRect(options.x, options.y, options.width, options.height)
    }
    this.ctx.clip()
  }

  /**
   * 绘制文字
   */
  text (options) {
    const render = () => {
      this.textRender(options)
    }
    this.renderQueue.push(render)
    return this
  }

  /**
   * 图形渲染
   */
  image (options) {
    this.imageQueue.push(options)
    this.imageQueueBackup.push(options)
    const render = () => {
      this.imageRender(options)
    }
    this.renderQueue.push(render) // 插入渲染队列
    return this
  }

  /**
   * 还原裁剪操作
   */
  setRestore () {
    this.renderQueue.push(() => {
      this.ctx.restore()
    })
    return this
  }

  /**
   * 图片渲染
   */
  imageRender (options) {
    this.ctx.save()
    this.setBorder(options)
    this.handleImageRadius(options)
    this.drawImageByMode(options)
    this.ctx.restore()
  }

  /**
   * 重置并创建新的变换矩阵
   * @param {Number} option.rotateX 水平旋转
   * @param {Number} option.skewX 水平倾斜
   * @param {Number} option.skewY 垂直倾斜
   * @param {Number} option.scaleY 垂直缩放
   * @param {Number} option.moveX 水平移动
   * @param {Number} option.moveY 垂直移动
   */
  setTransform ({ rotateX, skewX, skewY, scaleY, moveX, moveY }) {
    this.ctx.setTransform(rotateX, skewX, skewY, scaleY, moveX, moveY)
  }

  /**
   * 绘制圆角图片
   */
  handleImageRadius (options) {
    if (options.radius) {
      if (typeof options.radius === 'string' && options.radius.includes('%')) {
        const radiusNumber = Number(options.radius.replace(/[^0-9]/gi, ''))
        const num = Number(radiusNumber > 100 ? 100 : radiusNumber) / 100
        options.radius = options.width * num
      }
      this.drawRadiusRoute(options.x, options.y, options.width, options.height, options.radius)
      this.ctx.clip()
    }
    return this
  }

  drawImageByMode (options) {
    const temp = this.imageQueue[0]
    this.ctx.drawImage(
      temp.url || '/static/image/common/lottery-default.png',
      temp.x,
      temp.y,
      temp.width,
      temp.height
    )
    this.imageQueue.shift()
  }

  /**
   * 下载网络图片
   * @param {String} url
   */
  downLoadImage (url) {
    return new Promise(resolve => {
      if (!url.includes('http')) {
        // 本地图片
        resolve(url)
      } else {
        uni.getImageInfo({
          // 下载网络图片
          src: url,
          success: result => {
            resolve(result.path)
          },
          fail: err => {
            // throw new Error(err)
            console.log(err)
            resolve('/static/image/common/lottery-default.png')
          }
        })
      }
    })
  }

  /**
   * 获取字符串的字节长度
   * @param {String} value -输入值
   * @return {Number} 输出长度 字节
   */
  getStringByteLength (value) {
    const str = value
    let bytes = 0
    for (let i = 0, n = str.length; i < n; i++) {
      const c = str.charCodeAt(i)
      if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
        bytes += 1
      } else {
        bytes += 2
      }
    }
    return bytes
  }

  /**
   * 获取指定字符串换行总条数
   * @returns 返回换行总数
   */
  getLineFeedCount (options) {
    return Math.ceil(this.getStringByteLength(options.text) / options.maxLength)
  }

  /**
   * 文字渲染方法
   */
  textRender ({ ...options }) {
    this.ctx.save()
    this.setLineSpace(options)
    this.ctx.setFontSize(options.fontSize || 16)
    this.ctx.setFillStyle(options.color || '#000000')
    if (!options.overflow) {
      options.overflow = 'normal'
    }
    if (options.font) {
      this.ctx.font = options.font
    }
    if (options.textAlign) {
      console.log(options.textAlign)
      this.ctx.setTextAlign(options.textAlign) // 绘制文字对齐方式 left：左对齐 center：居中 right：右对齐
    }

    this.ctx.setTextBaseline(options.baseLine || 'top') // 文字水平对齐方式 top middle bottom normal

    if (options.overflow === 'ellipsis') {
      // 单行省略
      if (!options.maxLength) {
        console.error('需要指定最大字节数')
        return
      }
      const isEll = this.getStringByteLength(options.text) <= options.maxLength // 是否小于等于最大字节数
      const text = this.sliceByByte(options.text, 0, options.maxLength) + (isEll ? '' : '...')
      this.ctx.fillText(text, options.x, options.y, options.maxWidth)
      return
    }
    if (options.overflow === 'wrap') {
      // 换行渲染
      if (!options.maxLength) {
        console.error('需要指定最大字节数')
        return
      }
      const totalLines = Math.ceil(this.getStringByteLength(options.text) / options.maxLength) // 换行总行数
      for (let i = 0; i < totalLines; i++) {
        const text = this.sliceByByte(
          options.text,
          i * options.maxLength,
          (i + 1) * options.maxLength
        )
        this.ctx.fillText(text, options.x, i * options.fontSize + options.y + options.lineSpace * i, options.maxWidth)
      }
      return
    }
    this.ctx.fillText(options.text, options.x, options.y, options.maxWidth)
    this.ctx.restore()
  }

  setLineSpace (options) {
    if (
      options.lineSpace &&
      (!options.fontSize || !options.overflow || options.overflow !== 'wrap')
    ) {
      console.error('lineSpace需要搭配fontSize和overflow:wrap来使用')
    }
  }

  /**
   * 截取指定字节位置的字符串
   * @param {String} value - 输入字符串
   * @param {Number} start - 开始位置
   * @param {Number} end  - 结束位置
   */
  sliceByByte (value, start, end) {
    let bytes = 0
    let result = ''
    for (let i = 0, n = value.length; i < n; i++) {
      const c = value.charCodeAt(i)
      if (bytes >= end && end !== undefined) {
        break
      }
      if (bytes >= start) {
        result = result + value[i]
      }
      if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
        bytes += 1
      } else {
        bytes += 2
      }
    }
    return result
  }

  /**
   * 设置背景色
   * Set background color
   */
  setBackground (options) {
    if (!options.backgroundColor) return null
    let backgroundColor
    if (typeof options.backgroundColor === 'string') {
      backgroundColor = options.backgroundColor
    }
    if (typeof options.backgroundColor === 'object') {
      const { startX, startY, endX, endY, gradient } = options.backgroundColor
      const grd = this.ctx.createLinearGradient(startX, startY, endX, endY)
      for (let i = 0, l = gradient.length; i < l; i++) {
        grd.addColorStop(gradient[i].step, gradient[i].color)
      }
      backgroundColor = grd
    }
    this.ctx.setFillStyle(backgroundColor)
  }

  /**
   * 绘制圆角矩形框
   * @param {*} x x轴坐标
   * @param {*} y y轴坐标
   * @param {*} w 宽度
   * @param {*} h 高度
   * @param {*} r 圆角半径
   */
  drawRadiusRoute (x, y, w, h, r) {
    this.ctx.beginPath()
    this.ctx.moveTo(x + r, y, y)
    this.ctx.lineTo(x + w - r, y)
    this.ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 0)
    this.ctx.lineTo(x + w, y + h - r)
    this.ctx.arc(x + w - r, y + h - r, r, 0, 0.5 * Math.PI)
    this.ctx.lineTo(x + r, y + h)
    this.ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, Math.PI)
    this.ctx.lineTo(x, y + r)
    this.ctx.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI)
    this.ctx.closePath()
  }

  /**
   * 绘制边框
   */
  setBorder (options = {}) {
    if (!options.border) return null
    const { x, y } = options
    const w = options.width
    const h = options.height
    if (options.border.width || 0) {
      this.ctx.setLineWidth(options.border.width)
    }
    if (options.border.color || '') {
      this.ctx.setStrokeStyle(options.border.color)
    }
    const p = options.border.width / 2 // 偏移距离
    // 是否有圆角
    if (options.radius || 0) {
      const r = options.radius
      this.drawRadiusRoute(x - p, y - p, w + 2 * p, h + 2 * p, r + p)
      this.ctx.stroke()
    } else {
      this.ctx.strokeRect(x - p, y - p, w + 2 * p, h + 2 * p)
    }
  }

  /**
   * 最终绘制 · 保存
   */
  draw (save = false) {
    const _render = callback => {
      this.render()
      this.ctx.draw(save, () => {
        setTimeout(() => {
          uni.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: this.id, // canvas ID
            width: this.canvasOptions.width, // canvas 宽度
            height: this.canvasOptions.height, // canvas 高度
            fileType: this.canvasOptions.format,
            quality: this.canvasOptions.quality,
            success (res) {
              callback(res)
            },
            fail (err) {
              callback(err)
            }
          })
        }, 800)
      })
    }
    return new Promise(resolve => {
      if (this.imageQueue.length) {
        // 判断图片是否下载完成
        this.preLoadImage().then(() => {
          _render(resolve)
        })
      } else {
        _render(resolve)
      }
    })
  }

  /**
   * 下载所有的图像
   */
  preLoadImage () {
    return new Promise(resolve => {
      const t = this.imageQueue.map((item, index) => {
        return this.downLoadImage(item.url, index)
      })
      Promise.all(t)
        .then(res => {
          res.forEach((item, index) => {
            this.imageQueue[index].url = item
          })
          resolve()
        })
        .catch(err => {
          throw new Error(err)
        })
    })
  }

  /**
   * 传入参数检测
   */
  checkParams (options) {
    if (options.x && typeof options.x !== 'number') {
      return 'x坐标值只能是数字类型'
    }
    if (options.y && typeof options.y !== 'number') {
      return 'y坐标值只能是数字类型'
    }
    if (options.width && typeof options.width !== 'number') {
      return '宽度只能是数字类型'
    }
    if (options.height && typeof options.height !== 'number') {
      return '高度只能是数字类型'
    }
    if (options.fontSize && typeof options.fontSize !== 'number') {
      return '字体大小只能是数字类型'
    }

    return 'success'
  }
}
