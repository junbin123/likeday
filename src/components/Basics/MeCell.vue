<template>
  <view
    class="cell-container flex bg-color-white"
    hover-class="hover-bg-gray"
    @click="handleClick"
  >
    <view class="cell-left flex-center padding-left-10">
      <text :class="['iconfont', 'color-fff', iconName, 'font-size-22']"></text>
    </view>
    <view class="cell-right flex align-center" :class="[{'border-bottom':isBorderBottom}]">
      <view class="cell-title font-size-14 color-333 font-weight-bold">
        {{ title }}
      </view>
      <view class="cell-value flex align-center justify-end font-size-14 color-999 padding-right-20">
        {{ value }}
        <text class="iconfont icon-right-arrow color-999 font-size-22"></text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      default: 'icon-emoticon'
    },
    title: {
      type: String,
      default: '选项'
    },
    value: {
      type: String,
      default: ''
    },
    data: {
      type: String,
      default: ''
    },
    isBorderBottom: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick () {
      this.$emit('click', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.cell-container {
  height: 50px;
  width: 100%;
  .cell-left {
    width: 40px;
    height: 100%;
  }
  .cell-right {
    width: calc(100% - 40px);
    height: 100%;
    .cell-title {
      width: 50%;
    }
    .cell-value {
      width: 50%;
    }
  }
}
</style>
