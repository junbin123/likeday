<template>
  <view class="container bg-color-white border-top">
    <view class="flex justify-between">
      <view
        class="btn-item"
        :style="'width:'+(item.width || btnWidth)"
        v-for="(item,index) in buttonList"
        :key="index">
        <ButtonItem
          :item="item"
          :name="item.name"
          :type="item.type || 'default'"
          :icon="item.icon"
          :size="item.size || 'normal'"
          :disabled="item.disabled"
          :formType="item.formType"
          :openType="item.openType || ''"
          :sessionFrom="item.sessionFrom"
          :sendMessageImg="item.sendMessageImg"
          :sendMessagePath="item.sendMessagePath"
          :sendMessageTitle="item.sendMessageTitle"
          @handleOpenSetting="handleOpenSetting"
          @handleContact="handleContact"
          @handleGetPhoneNumber="handleGetPhoneNumber"
          @handleClick="handleClick"/>
       </view>
    </view>
  <view class="is-iphonex" v-if="isIphoneX"></view>
  </view>
</template>

<script>
import ButtonItem from '@/components/Basics/ButtonItem.vue'
import { mapState } from 'vuex'

export default {
  components: { ButtonItem },
  props: {
    buttonList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    btnWidth ({ buttonList }) {
      const width = (702 - (buttonList.length - 1) * 24) / buttonList.length
      return width + 'rpx'
    },
    ...mapState('app', {
      isIphoneX: state => state.systemInfo.isIphoneX
    })
  },
  methods: {
    handleOpenSetting (e) {
      this.$emit('handleOpenSetting', e)
    },
    handleContact (e) {
      this.$emit('handleContact', e)
    },
    handleGetPhoneNumber (e) {
      this.$emit('handleGetPhoneNumber', e)
    },
    handleClick (e) {
      this.$emit('handleClick', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx;
}

</style>
