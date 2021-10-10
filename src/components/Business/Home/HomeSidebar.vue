<template>
  <GPopup
    v-model="isShow"
    position="left"
    width="68%"
    height="100%"
    radius="0"
    :isOverflow="false"
    @handleClose="handleClose">
    <view
      class="sidebar-container border-right"
      :style="[{paddingTop:systemInfo.statusBarHeight+'px'}]"
      :class="isBounce ? 'bounce' : ''"
      @animationend="animationend">
      <!-- 标题 -->
      <view class="title-box flex-center">
        <view class="title-img-box flex-center">
          <image src="/static/image/common/likeday-logo.png" class="title-img"/>
        </view>
       <view @click="handleClose" hover-class="hover-color-ddd" class="iconfont icon-left-arrow color-999 font-size-20 title-icon flex-center"></view>
      </view>
      <!-- 全部 -->
      <view class="all-item-box border-bottom">
        <CateCellItem
          name="全部"
          iconUrl='/static/image/category/icon-home.png'
          :count="countdownCount"
          :index="-1"
          :isSelect="selectIndex === -1"
          @handleClick="handleClick"/>
      </view>
      <!-- 分类 -->
      <scroll-view class="content-box" :scroll-y="true" :style="[contentStyle]">
        <view v-for="(item,index) in tempList" :key="index" class="content-item">
          <CateCellItem
            :name="item.name"
            :iconUrl="item.iconUrl"
            :count="item.count"
            :index="index"
            :isSelect="selectIndex === index"
            @handleClick="handleClick"/>
        </view>
      </scroll-view>
      <view class="button-box flex flex-column justify-between">
        <GButton name="分类管理" icon="icon-edit" type="gray" size="small" @handleClick="handleEdit"/>
        <GButton name="已删除的倒数日" icon="icon-delete" type="danger" size="small" @handleClick="handleEvent"/>
      </view>
    </view>
</GPopup>
</template>

<script>
import GPopup from '@/components/Basics/GPopup'
import GButton from '@/components/Basics/GButton'
import CateCellItem from '@/components/Business/Home/CateCellItem'
import { mapState } from 'vuex'
/**
 * 首页侧边栏组件
 */
export default {
  components: {
    GPopup,
    GButton,
    CateCellItem
  },
  props: {
    value: { // 是否显示
      type: Boolean,
      default: false
    },
    isBounce: {
      type: Boolean,
      default: false
    },
    selectIndex: { // 选中的列表项
      type: Number,
      default: 0
    },
    list: { // 分类列表数据
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('app', {
      systemInfo: 'systemInfo',
      countdownCount: (state) => state.userInfo.countdownCount || 0,
      categoryList: (state) => state.userInfo.categoryList || [{ name: '', icon: 'icon-love' }]
    }),
    contentStyle ({ systemInfo }) { // 分类内容高度
      const { isIphoneX, statusBarHeight } = systemInfo || {}
      const totalHeight = statusBarHeight + 60 + 62 + (isIphoneX ? 34 : 0) + 108
      return { height: `calc(100vh - ${totalHeight}px)` }
    },
    isShow: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    tempList ({ categoryList = [] }) {
      const res = categoryList.map(item => {
        const iconUrl = `/static/image/category/${item.icon || 'icon-love'}.png`
        return { ...item, iconUrl }
      })
      return res
    }
  },

  methods: {
    animationend () {
      this.$emit('update:isBounce', false)
    },
    handleClick (index) {
      this.$emit('handleClick', { index })
    },
    handleClose (data) {
      this.isShow = false
    },
    handleEdit () {
      const url = '/pages/edit/category'
      uni.navigateTo({ url })
    },
    handleEvent () {
      const url = '/pages/edit/deleteList'
      uni.navigateTo({ url })
    }

  }
}
</script>

<style lang="scss" scoped>
.bounce{
  animation: bounce 2s 1;
}
.sidebar-container{
  width: 100%;
  height: 100%;
  background: #fff;
  .content{
    .item-box{
      width: 100%;
      padding: 4px 12px;
      height: 48px;
      border-radius: 4px;
    }
    .line{
      width: 100%;
      height: 1px;
      background: #F4F4F4;
      margin: 4px 0;
    }
    .item {
      width: 100%;
      height: 42px;
      display: flex;
      .item-left{
        width: 40px;
        height: 100%;
        @include flex-center();
        .item-left-img{
          width: 24px;
          height: 24px;
        }
      }
      .item-right{
        width: calc(100% - 40px);
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 12px;
        color: $color-black;
        .item-right-name{
          color: $color-black;
          font-size: 14px;
          font-weight: 800;
          max-width: 70%;
        }
        .item-right-count{
          color: $color-gray;
          max-width: 40%;
          font-size: 14px;
          height: 20px;
          padding: 0 8px;
          border-radius: 10px;
          background-image: linear-gradient(135deg, #E6E9F0 0%, #EEF1F5 100%);
        }
      }
    }
  }
  .button-box{
    width: 100%;
    height: 108px;
    padding: 12px;
  }
}
.select{
  background: #F6F6F6;
  border-radius: 4px;
}

.title-box{
  width: 100%;
  height: 60px;
  padding: 0 20rpx;
}
.title-icon{
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background: #f1f1f1;
}
.title-img-box{
  height:22.4px;
  flex: 1;
  padding-left: 20px;
}
.title-img{
  width:80px;
  height:22.4px
}
.all-item-box{
  padding: 10px 20rpx;
}
.content-box{
  width: 100%;
  padding: 20rpx;
}
.content-item{
  padding-bottom: 20rpx;
}
.animation-container{
 position: fixed;
 top: 0;
 left: 0;
 bottom: 0;
 transform: translateX(-100%);
}

@keyframes bounce {
  from,
  20%,
  53%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(50px,0, 0) scaleX(1.1);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(26px,0 , 0) scaleX(1.05);
  }
  80% {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0) scaleX(0.95);
  }
  90% {
    transform: translate3d(8px,0,  0) scaleX(1.02);
  }
}
</style>
