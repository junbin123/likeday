<template>
  <GPopup
    v-model="isShow"
    position="bottom"
    :title="title"
    @handleClose="handleClose"
  >
    <view class="pop-container">
      <input
        class="input-name border"
        :value="item.name"
        :maxlength="30"
        placeholder="请输入分类名称"
        @input="handleInput" />
      <FormCell
        title="分类图标"
        iconName="icon-emotion"
        type="default"
        border="1px solid #f1f1f1"
        background="#F8F8F8"
        round="roundTop"
        :rightImg="iconStr"
        :showArrow="false"
      />
      <scroll-view :scroll-y="true" class="pop-box-scrollview">
        <view class="pop-icon-box">
          <view
            class="pop-icon-item box-64 flex-center v-hover-background"
            v-for="(tempItem, index) in categoryInfo"
            :class="{ 'active-icon': index === selectIconIndex }"
            @click="handleClickIcon({icon:tempItem.icon,index})"
            :key="index"
          >
            <image
              class="box-32"
              :src="'/static/image/category/' + tempItem.icon + '.png'"
            />
          </view>
        </view>
      </scroll-view>

      <view class="pop-btn flex-center justify-between margin-top-20">
        <view class="pop-btn-item"
          ><GButton name="取消" type="gray" @handleClick="handleClose"
        /></view>
        <view class="pop-btn-item"
          ><GButton name="保存" @handleClick="handleSave"
        /></view>
      </view>
    </view>
  </GPopup>
</template>

<script>
/**
 * 分类编辑弹窗
 */
import GButton from '@/components/Basics/GButton'
import GPopup from '@/components/Basics/GPopup'
import FormCell from '@/components/Business/Add/FormCell'
import { categoryInfo } from '@/static/data/category'
import { mapState } from 'vuex'
export default {
  components: {
    GButton,
    GPopup,
    FormCell
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '添加分类'
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      iconStr: '/static/image/category/icon-love.png',
      selectIconIndex: 2,
      categoryInfo: categoryInfo,
      newItem: {}
    }
  },
  computed: {
    ...mapState('app', {
      systemInfo: 'systemInfo',
      uid: (state) => state.userInfo.uid
    }),
    isShow: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    icon ({ item }) {
      return item.icon || 'icon-love'
    }
  },
  watch: {
    icon (val) {
      const index = this.categoryInfo.findIndex(item => item.icon === val)
      this.selectIconIndex = index
      this.iconStr = `/static/image/category/${val}.png`
    }
  },
  methods: {
    handleInput (e) {
      const item = {
        ...this.item,
        name: e.detail.value
      }
      this.$emit('update:item', item)
    },
    handleClose () {
      this.isShow = false
      this.$emit('handleClose', this.item)
    },
    handleSave () {
      console.log(this.item, '--')
      const name = this.item?.name ?? ''
      if (!name.replace(/[\r\n]/g, '').replace(/\s+/g, ' ')) {
        uni.showToast({ title: '请输入分类名称', icon: 'none' })
        return
      }
      this.$emit('handleSave', { ...this.item, icon: this.icon })
    },
    handleClickIcon ({ index, icon }) {
      this.selectIconIndex = index
      this.iconStr = `/static/image/category/${icon}.png`
      console.log(index, icon, '--')
      const item = {
        ...this.item,
        icon
      }
      this.$emit('update:item', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.pop-title {
  height: 46px;
  line-height: 46px;
  padding:0 30rpx;
  background: #f0f0f0;
  margin-bottom: 10px;
}
.pop-box-scrollview {
  background: #f8f8f8;
  border-bottom: 1px solid #f1f1f1;
  border-left: 1px solid #f1f1f1;
  border-right: 1px solid #f1f1f1;
  border-radius: 4px;
  width: 100%;
  height: 210px;
}
.pop-icon-box {
  padding: 12px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  .pop-icon-item {
    position: relative;
  }
}
.pop-btn {
  width: 100%;
  height: 72px;
  .pop-btn-item {
    width: 345rpx;
  }
}
.active-icon:after {
  content: "";
  position: absolute;
  width: 64px;
  height: 64px;
  border: 1px solid $color-blue;
  border-radius: 4px;
}
.active-icon:before {
  content: "\e622";
  position: absolute;
  height: 18px;
  width: 18px;
  background: $color-blue;
  border-radius: 4px 0 2px 0;
  right: 0;
  bottom: 0;
  font-family: "iconfont";
  font-size: 14px;
  color: #fff;
  @include flex-center();
  font-weight: bold;
}
.pop-container{
  padding: 20rpx 20rpx 0 20rpx;
}
.pop-content{
  padding: 0 20rpx;
}
.input-name{
  height: 50px;
  width: 100%;
  background: #f8f8f8;
  color: #333;
  border-radius: 4px;
  border:1px solid #f1f1f1;
  padding: 0 20px;
  margin-bottom: 12px;
}
</style>
