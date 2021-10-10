<template>
  <view
    :class="['item', { select: isSelect }, 'v-hover-background']"
    @click="handleClick">
    <view class="item-left">
      <image :src="iconUrl" class="item-left-img" />
    </view>
    <view class="item-right">
      <view class="item-right-name">{{ name }}</view>
      <view class="item-right-count flex-center">{{ count }}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: ['index', 'name', 'iconUrl', 'count', 'isSelect'],
  methods: {
    handleClick () {
      this.$emit('handleClick', this.index)
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  height: 42px;
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  .item-left {
    width: 40px;
    height: 100%;
    @include flex-center();
    .item-left-img {
      width: 24px;
      height: 24px;
    }
  }
  .item-right {
    width: calc(100% - 40px);
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 12px;
    color: $color-black;
    .item-right-name {
      color: $color-black;
      font-size: 14px;
      font-weight: 800;
      max-width: 70%;
    }
    .item-right-count {
      color: $color-gray;
      max-width: 40%;
      font-size: 14px;
      height: 20px;
      padding: 0 8px;
      border-radius: 10px;
      background:#e6e9f0;
    }
  }
}
.select {
  background: #f1f1f1;
}
</style>
