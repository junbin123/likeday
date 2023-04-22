<template>
  <GPopup v-model="isShow" position="bottom" width="100%" height="180px">
    <view class="share-container">
      <view class="share-content flex align-center padding-left-10 padding-right-10">
        <button class="share-item flex flex-column align-center" hover-class="button-hover" v-for="item in iconList" :key="item.label" @click="handleClick(item)" :open-type="item.openType">
          <image class="share-item-img" :src="item.image" mode="aspectFill" :lazy-load="true"></image>
          <text class="font-size-12 color-666 margin-top-10">{{item.name}}</text>
        </button>
      </view>
      <view @click="isShow = false" class="share-btn font-size-16 color-333 flex-center bg-color-white" hover-class="hover-bg-gray">取消</view>
    </view>
  </GPopup>
</template>

<script>
import GPopup from '@/components/Basics/GPopup'
import { mapState } from 'vuex'
/**
 * picker选择器
 */
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  components: {
    GPopup
  },
  data () {
    return {

    }
  },
  computed: {
    isShow: {
      get () {
        return this.value
      },
      set (val) {
        return this.$emit('input', val)
      }
    },
    ...mapState('app', {
      system: (state) => state.systemInfo.system
    }),
    iconList ({ system = '' }) {
      // const ios = system.toLowerCase().includes('ios')
      // return ios

      return [{
        image: 'https://img-blog.csdnimg.cn/2021060822102437.png',
        name: '发送给朋友',
        label: 'friend',
        openType: 'share'
      },
      // {
      //   image: 'https://img-blog.csdnimg.cn/2021060822102478.png',
      //   name: '分享到朋友圈',
      //   label: 'moment',
      //   openType: ''
      // },
      {
        image: 'https://img-blog.csdnimg.cn/2021060822102438.png',
        name: '保存分享图',
        label: 'poster',
        openType: ''
      }
      ]
    }
  },
  mounted () {
    console.log(this.systemInfo, '-111')
  },
  watch: {

  },
  methods: {
    handleClick ({ label = '' }) {
      if (label === 'poster') {
        uni.previewImage({
          urls: ['https://img-blog.csdnimg.cn/4a814dbd7caa497dae5c165cf89e0cda.png']
        })
      }
      this.isShow = false
      console.log('handleClick')
    }
  }
}
</script>

<style lang="scss" scoped>
.share-container {
  background: #F6F7F8;
  border-radius: 10px 10px 0 0;
  .share-content{
    height: 126px;
    .share-item{
      width:182rpx;
      &:active{
        background-color: #F6F7F8;
      }
      .share-item-img{
        width: 60px;
        height: 60px;
      }
    }
  }
  .share-btn{
    height: 54px;
  }

  .button-hover{
            background-color: #F6F7F8;

  }
}
</style>
