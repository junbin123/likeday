<template>
  <view class="slide-tab-box border-bottom" :style="[{paddingTop:statusBarHeight+'px'}]">
    <view class="slide-tab flex-center">
      <view class="left-box flex-center">
        <view v-if="showLeftIcon" @click="handleClickIcon" class="iconfont icon-category tab-icon-box font-size-22 flex-center color-999" hover-class="hover-color-ddd"/>
      </view>
      <view class="right-box flex-center">
        <image class="icon-img" :src="iconUrl" />
        <view class="title-item font-size-18 color-333">{{title}}</view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 首页滑动Tab组件
 */
import { mapState } from 'vuex'
export default {
  props: ['iconUrl', 'title', 'showLeftIcon'],
  data () {
    return {}
  },
  computed: {
    ...mapState('app', {
      statusBarHeight: state => state.systemInfo.statusBarHeight || 20
    })
  },
  mounted () {
  },
  methods: {
    handleClickIcon () {
      this.$emit('handleClickIcon')
    }
  }
}
</script>

<style lang="scss" scoped>
.slide-tab-box{
  box-shadow: 0 2px 6px 0 rgba(0,0,0,0.1);
  background: #fff;
}
.slide-tab {
  width: 100%;
  height: 50px;
}
.left-box{
  width: 50px;
  height: 50px;
}
.tab-icon-box{
  width: 30px;
  height: 30px;
  border-radius: 4px;
}
.right-box{
  flex: 1;
  height: 100%;
  padding-right: 50px;
}
.icon-img{
  width: 24px;
  height: 24px;
}
.title-item{
  padding-left: 4px;
}
</style>
