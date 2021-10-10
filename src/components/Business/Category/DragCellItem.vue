<template>
  <view class="gcell-container" :style="[boxStyle]">
    <view class="icon-remove-box flex-center padding-left-20 v-hover-background" @click="handleDelete">
      <view class="iconfont icon-remove font-size-20" />
    </view>
    <view
      class="cell-right border-bottom">
      <!-- 内容 -->
      <view class="cell-middle v-hover-background flex" @click="handleEdit">
        <view class="cell-img-box flex-center">
          <image v-if="leftImg" class="cell-img" :src="leftImg" />
        </view>
        <view class="cell-right-title">
          <text class="cell-right-title-text">{{ title }}</text>
          <text v-if="count !== ''" class="cell-right-title-count flex-center">{{ count }}</text>
        </view>
      </view>
      <!-- 上移下移 -->
      <view class="right-icon-box flex-center iconfont icon-up-line font-size-22 color-666 v-hover-background" @click="handleSort('up')"/>
      <view class="right-icon-box flex-center iconfont icon-up-line font-size-22 color-666 v-hover-background" @click="handleSort('down')" style="transform:rotate(180deg)"/>
    </view>
  </view>
</template>

<script>
/**
 * 基础单元格组件
 */
export default {
  name: 'DragCellItem',
  props: {
    marginTop: {
      type: String,
      default: ''
    },
    marginBottom: {
      type: String,
      default: ''
    },
    title: {
      // 左边标题
      type: String,
      default: '标题'
    },
    leftIcon: { // 左边icon
      type: String,
      default: 'icon-description'
    },
    leftImg: { // 左边图片Src
      type: String,
      default: ''
    },
    count: { // 右边数量显示
      type: [String, Number],
      default: ''
    },
    rightIcon: {
      type: String,
      default: 'icon-right-arrow'
    },
    isRightIcon: { // 是否显示右侧icon
      type: Boolean,
      default: true
    },
    isHover: {
      // 显示点击效果
      type: Boolean,
      default: false
    },
    isShow: {
      // 是否显示出来
      type: Boolean,
      default: true
    },
    background: {
      type: String,
      default: '#fff'
    },
    customData: {
      type: [String, Number, Array, Object, Boolean]
    },
    iconColor: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  computed: {
    boxStyle () {
      // 容器样式
      return {
        marginTop: this.marginTop,
        marginBottom: this.marginBottom,
        background: this.background
      }
    }
  },
  methods: {
    handleEdit () {
      this.$emit('handleEdit', this.customData)
    },
    handleSort (sortType) {
      this.$emit('handleSort', { ...this.customData, sortType })
    },
    handleDelete () {
      this.$emit('handleDelete', this.customData)
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 60px;
.gcell-container {
  width: 100%;
  height: $height;
  font-size: 14px;
  display: flex;
  overflow: hidden;
  background: #fff;
  .cell-right {
    // width: calc(100% - 40px);
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    height: 100%;
    .cell-right-title {
      display: flex;
      align-items: center;
      height: 100%;
      color: $color-black;
      font-weight: bold;
      flex:1;
      .cell-right-title-count{
        font-weight: lighter;
        height: 20px;
        color: $color-gray;
        font-size: 12px;
        margin: 0 8px;
        padding: 0 8px;
        border-radius: 10px;
        background-image: linear-gradient(135deg, #E6E9F0 0%, #EEF1F5 100%);
      }
    }
  }
}
.icon-remove-box{
  color: #e33636;
  width: 80rpx;
}
.cell-img-box {
  width: 100rpx;
  height: 100%;
  .cell-img{
    height: 24px;
    width: 24px;
  }
}
// .right-icon-box1{
//   height: $height;
//   width: 80rpx;
// }
.right-icon-box{
  height: $height;
  width: 100rpx;
  // padding-right: 20rpx;
  // background: blue;
}
.cell-middle{
  flex: 1;
  height: 100%;
}
</style>
