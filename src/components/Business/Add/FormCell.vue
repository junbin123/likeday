<template>
  <view
    v-if="isShow"
    class="cell-container"
    :class="[{ 'v-hover-background': isHover },round ? roundDict[round]:'',{'disabled':disabled}]"
    :style="[boxStyle]"
    @click="handleClickCover"
  >
    <view class="cell-left flex-center">
      <view :class="['cell-left-icon', 'iconfont', iconName]" />
      <text class="required-class" v-if="isRequired">*</text>
    </view>
    <view :class="['cell-right',{'border-top':borderTop},{'border-bottom':borderBottom}]"
    @click="handleClick">
      <view class="cell-right-title" :style="type==='calendar'?'width:18%':''">{{ title }}</view>
      <slot name="right" :customData="name">
      <view class="cell-right-value" :style="type==='calendar'?'width:82%':''">
        <block v-if="type === 'default'">
          <image v-if="rightImg" :src="rightImg" class="right-img" :lazy-load="true" />
          <view class="cell-right-text" :style="rightImg ? 'width:auto' : ''">{{
            rightValue
          }}</view>
          <view v-if="showArrow" class="cell-right-icon iconfont icon-right-arrow" />
        </block>
        <input
          v-if="type === 'input'"
          class="input-class"
          :value="rightValue"
          :placeholder="placeholder"
          placeholder-class="placeholder-class"
          :focus="true"
          @input="handleInput"
        />
        <switch
          v-if="type === 'switch'"
          :checked="rightValue"
          color="#495aff"
          class="switch-class"
          :disabled="disabled"
          @change="handleSwitch"
        />
        <block v-if="type === 'calendar'">
          <view class="cell-right-text v-hover-opacity" style="width:auto">{{calendarStr}}</view>
          <view class="calendar-box" @click.stop="handleCalendar">
            <view class="calendar-switch">
              <view :class="['select',isLunar ? 'select-left' :'select-right']"></view>
            </view>
            <view class="calendar-text">
              <view :class="['calendar-text-item',{'select-text-left':isLunar}]">农历</view>
              <view :class="['calendar-text-item',{'select-text-right':!isLunar}]">公历</view>
            </view>
          </view>
        </block>
      </view>
      </slot>
    </view>
  </view>
</template>

<script>
/**
 * 表单单元格组件
 */
export default {
  name: 'FormCell',
  props: {
    marginTop: {
      type: String,
      default: ''
    },
    marginBottom: {
      type: String,
      default: ''
    },
    round: { // 顶部或底部圆角
      type: String,
      default: '',
      validator: val => {
        return ['', 'roundTop', 'roundBottom', 'round'].includes(val)
      }
    },
    border: {
      type: String,
      default: ''
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
      default: ''
    },
    iconName: {
      // 左边icon
      type: String,
      default: 'icon-description'
    },
    type: {
      // 右边输入类型
      type: String,
      default: 'default',
      validator: (val) => {
        return ['default', 'input', 'switch', 'calendar'].includes(val)
      }
    },
    value: {
      // 右边双向绑定值
      type: [String, Number, Boolean, Object],
      default: ''
    },
    placeholder: {
      // type为input有效
      type: String,
      default: '输入内容'
    },
    name: {
      // 点击后抛出的值
      type: String,
      default: ''
    },
    isHover: {
      // 显示点击效果
      type: Boolean,
      default: false
    },
    isRequired: {
      // 是否必填
      type: Boolean,
      default: false
    },
    isShow: {
      // 是否显示出来
      type: Boolean,
      default: true
    },
    rightImg: {
      // 右侧的图片路径
      type: String,
      default: ''
    },
    background: {
      type: String,
      default: '#fff'
    },
    showArrow: { // 显示右边箭头
      type: Boolean,
      default: true
    },
    disabled: { // 是否可点击
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isLunar: true,
      roundDict: {
        roundTop: 'round-top-4',
        roundBottom: 'round-bottom-4',
        round: 'border-radius-4'
      }
    }
  },
  mounted () {
    this.isLunar = this.value?.isLunar || false
  },
  computed: {
    calendarStr () {
      return this.isLunar ? this.rightValue?.lunarDate : this.rightValue?.solorDate
    },
    rightValue: { // 值的双向绑定
      get () {
        return this.value
      },
      set (val) {
        return this.$emit('input', val)
      }
    },
    boxStyle () { // 容器样式
      return {
        marginTop: this.marginTop,
        marginBottom: this.marginBottom,
        background: this.background,
        border: this.border
      }
    }

  },
  methods: {
    handleClickCover () {
      if (this.disabled) {
        uni.showToast({ title: '不可编辑', icon: 'none' })
      }
    },
    handleInput (data) {
      const { value } = data.detail
      this.$emit('handleClick', { name: this.name, value })
    },
    handleCalendar () {
      this.isLunar = !this.isLunar
      this.rightValue.isLunar = !this.rightValue.isLunar
      this.$emit('handleCalendar', this.rightValue)
    },
    handleClick () {
      if (this.type === 'switch') return
      this.$emit('handleClick', { name: this.name, value: this.rightValue })
    },
    handleSwitch (data) {
      this.$emit('input', data.detail.value)
      this.$emit('handleClick', { name: this.name, value: data.detail.value })
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled{
  background: #f8f8f8 !important;
}
.cell-container {
  width: 100%;
  height: 54px;
  font-size: 14px;
  display: flex;
  overflow: hidden;
  background: #fff;
  .cell-left {
    width: 44px;
    height: 100%;
    position: relative;
    .cell-left-icon {
      color: $color-gray;
      font-size: 22px;
    }
    .required-class {
      color: red;
      position: absolute;
      top: 16px;
      left: 32px;
      font-size: 12px;
    }
  }
  .cell-right {
    width: calc(100% - 44px);
    display: flex;
    align-items: center;
    font-size: 14px;
    height: 100%;
    .cell-right-title {
      width: 30%;
      color: $color-gray;
    }
    .cell-right-value {
      width: 70%;
      color: $color-black;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 100%;
    }
    .cell-right-text {
      text-align: right;
      width: calc(100% - 36px);
      @include text-overflow();
      font-weight: medium;
    }
    .cell-right-icon {
      width: 36px;
      height: 100%;
      color: $color-black;
      font-size: 22px;
      @include flex-center();
    }
    .input-class {
      width: 100%;
      height: 100%;
      padding: 0 12px;
      color: $color-black;
      text-align: right;
      font-weight: medium;
    }
    .placeholder-class {
      color: $color-lightgray;
      font-weight: normal;
    }
    .switch-class {
      padding-right: 10px;
    }
  }
  .right-img {
    width: 22px;
    height: 22px;
    margin: 16px;
  }
.calendar-box{
  max-width: 102px;
  width: 210rpx;
  height: 100%;
  position: relative;
  @include flex-center();
  .calendar-switch{
    width: 88px;
    height: 30px;
    border-radius: 15px;
    background: #EEEEEE;
    position: relative;
    .select{
      position: absolute;
      width: 48px;
      height: 30px;
      background: $color-blue;
      border-radius: 15px;
      transition: all 0.5s;
    }
    .select-right{
      left: 40px;
    }
    .select-left{
      left: 0;
    }
  }
  .calendar-text{
    width: 88px;
    color: $color-font-gray;
    display: flex;
    align-items: center;
    font-size: 14px;
    position: absolute;
    .calendar-text-item{
      transition: all 0.5s;
      width: 44px;
      @include flex-center();
    }
    .select-text-left{
      padding-left: 4px;
      width: 44px;
      color: white;
    }
    .select-text-right{
      padding-right: 4px;
      width: 44px;
      color: white;
    }
  }
}
}
</style>
