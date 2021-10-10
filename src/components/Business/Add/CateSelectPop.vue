<template>
  <GPopup v-model="isShow" position="bottom" title="选择分类">
    <view class="cate-pop">
      <scroll-view class="cate-pop-scroll" :scroll-y="true">
        <GCell
          title="全部"
          :count="countdownCount"
          leftImg="/static/image/category/icon-home.png"
          rightIcon="icon-done"
          :borderBottom="true"
          :isHover="true"
          :isRightIcon="iconIndex === -1"
          :customData="{id:''}"
          iconColor="#495AFF"
          @handleClick="handleSelectIcon"/>
        <GCell
          v-for="(item,index) in categoryList"
          :key="item.id"
          :title="item.name"
          :count="item.count"
          :leftImg="'/static/image/category/'+item.icon+'.png'"
          rightIcon="icon-done"
          :borderBottom="true"
          :isHover="true"
          :isRightIcon="iconIndex === index"
          :customData="item"
          iconColor="#495AFF"
          @handleClick="handleSelectIcon"/>
      </scroll-view>
    </view>
  </GPopup>
</template>

<script>
import GPopup from '@/components/Basics/GPopup'
import GCell from '@/components/Basics/GCell'
import { mapState } from 'vuex'
export default {
  components: { GPopup, GCell },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    iconIndex: {
      type: Number,
      default: -1
    }
  },
  computed: {
    isShow: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    ...mapState('app', {
      countdownCount: (state) => state.userInfo.countdownCount || 0,
      categoryList: state => state.userInfo?.categoryList || []
    })
  },
  methods: {
    handleSelectIcon ({ id = '' }) {
      this.isShow = false
      this.$emit('handleClick', id)
    }
  }

}
</script>

<style lang="scss" scoped>
.cate-pop-scroll{
  height: 700rpx;
}
.cate-pop{
 padding: 20rpx;
}

</style>
