<template>
  <GPopup v-model="isShow" position="bottom" width="100%" height="216px" title="操作" @handleClose="handleClose">
    <view class="pop-container">
      <MeCell
        v-for="(item, index) in list"
        :key="index"
        :iconName="item.iconName"
        :title="item.title"
        :data="item.data"
        :isBorderBottom="true"
        @click="handleCellClick(item)"/>
    </view>
  </GPopup>
</template>

<script>
import GPopup from '@/components/Basics/GPopup'
import MeCell from '@/components/Basics/MeCell'
/**
 * 事件编辑选项弹窗
 */
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '操作'
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  components: {
    GPopup,
    MeCell
  },
  data () {
    return {
      iconList: [
        {
          image: 'https://img-blog.csdnimg.cn/2021060822102437.png',
          name: '发送给朋友',
          label: 'friend',
          openType: 'share'
        },
        {
          image: 'https://img-blog.csdnimg.cn/2021060822102478.png',
          name: '分享到朋友圈',
          label: 'moment',
          openType: ''
        },
        {
          image: 'https://img-blog.csdnimg.cn/2021060822102438.png',
          name: '保存分享图',
          label: 'poster',
          openType: ''
        }
      ]
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
    }
  },
  created () {},
  watch: {},
  methods: {
    handleCellClick (item) {
      this.$emit('handleClick', item)
    },
    handleClose () {
      this.isShow = false
    }
  }

}
</script>

<style lang="scss" scoped>
.share-container {
  background: #f6f7f8;
  border-radius: 10px 10px 0 0;
  .share-content {
    height: 126px;
    .share-item {
      width: 182rpx;
      &:active {
        background-color: #f6f7f8;
      }
      .share-item-img {
        width: 60px;
        height: 60px;
      }
    }
  }
  .share-btn {
    height: 54px;
  }

  .button-hover {
    background-color: #f6f7f8;
  }
}
.pop-container{
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  .pop-header{
    height: 46px;
    text{
      position: absolute;
      right: 36rpx;
    }
  }
}
</style>
