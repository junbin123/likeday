<template>
  <view :class="['gcell-container',roundClass,{ 'v-hover-background': isHover }]" :style="[boxStyle]">
    <view class="cell-left flex-center">
      <image v-if="leftImg" class="cell-left-img" :src="leftImg" />
      <view v-else :class="['cell-left-icon', 'iconfont', leftIcon]" />
    </view>
    <view
      :class="['cell-right', { 'border-top': borderTop }, { 'border-bottom': borderBottom }]"
      @click="handleClick"
    >
      <view class="cell-right-title">
        <text class="cell-right-title-text">{{ title }}</text>
        <text v-if="count !== ''" class="cell-right-title-count flex-center">{{ count }}</text>
      </view>
      <view v-if="isRightIcon" class="cell-right-value flex-center">
        <text :class="['cell-right-value-icon','iconfont' ,rightIcon]" :style="[{'color':iconColor}]"/>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 基础单元格组件
 */
export default {
  name: 'GCell',
  props: {
    marginTop: {
      type: String,
      default: ''
    },
    marginBottom: {
      type: String,
      default: ''
    },
    round: {
      // 顶部或底部圆角
      type: String,
      default: '',
      validator: (val) => {
        return ['', 'roundTop', 'roundBottom', 'round'].includes(val)
      }
    },
    borderTop: {
      type: Boolean,
      default: false
    },
    borderBottom: {
      type: Boolean,
      default: false
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
    roundClass () {
      if (!this.round) return ''
      const roundDict = {
        roundTop: 'round-top-4',
        roundBottom: 'round-bottom-4',
        round: 'border-radius-4'
      }
      return roundDict[this.round]
    },
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
    handleClick () {
      this.$emit('handleClick', this.customData)
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 50px;
.gcell-container {
  width: 100%;
  height: $height;
  font-size: 14px;
  display: flex;
  overflow: hidden;
  background: #fff;
  .cell-left {
    width: $height;
    height: 100%;
    .cell-left-icon {
      color: $color-gray;
      font-size: 20px;
    }
    .cell-left-img{
      height: 24px;
      width: 24px;
    }
  }
  .cell-right {
    width: calc(100% - 50px);
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
    .cell-right-value {
      height: 100%;
      width: $height;
      .cell-right-value-icon{
        font-size: 20px;
        color: $color-lightgray;
      }
    }
  }
}
</style>
