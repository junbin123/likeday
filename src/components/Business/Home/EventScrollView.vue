<template>
  <scroll-view
    :scroll-y="true"
    class="scroll-view"
    :enable-back-to-top="true"
    :refresher-enabled="true"
    refresher-default-style="black"
    :refresher-triggered="isRefresh"
    @scrolltolower="handleScrollBottom"
    @refresherrefresh="handleRefresh">
    <view class="content-box">
      <view class="event-box" v-for="(item,index) in pageList" :key="index">
        <EventCard
          :item="item"
          @handleClick="handleEventClick"/>
      </view>
      <view
        v-if="isNext"
        class="load-next bg-color-white font-size-14 color-999 flex-center border-radius-4"
        hover-class="hover-color-gray"
        @click="handleLoadNext">
        加载更多
      </view>
    </view>
  </scroll-view>
</template>

<script>
import EventCard from '@/components/Basics/EventCard'
export default {
  components: {
    EventCard
  },
  props: {
    isRefresh: {
      type: Boolean,
      default: false
    },
    pageList: {
      type: Array,
      default: () => []
    },
    isNext: { // 是否还有下一页
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleEventClick (data) {
      this.$emit('handleEventClick', data)
    },
    handleRefresh () {
      this.$emit('handleRefresh')
    },
    // 滚动到底部
    handleScrollBottom (e) {
      this.$emit('handleScrollBottom')
    },
    // 加载下一页
    handleLoadNext (e) {
      this.$emit('handleLoadNext')
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-view{
  height: 100%;
  .content-box{
    padding: 12px 24rpx;
    .event-box{
      padding-bottom: 12px;
    }
    .load-next{
      box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.05);
      height: 46px;
    }
  }
}
</style>
