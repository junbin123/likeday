<template>
  <GPopup v-model="isShow" position="bottom" width="100%" height="270px" :title="title">
    <view class="picker-container">
      <picker-view
        :value="valueList"
        indicator-style="height:48px"
        @change="handleChange"
        class="picker-view"
      >
        <picker-view-column class="picker-column" v-for="(columns,columnIdx) in pickerList" :key="columnIdx">
          <view v-for="item in columns" :key="item" class="picker-column-item">
            {{ item }}
          </view>
        </picker-view-column>
      </picker-view>
      <view class="btn-box">
        <view class="btn-item btn-left"
          ><GButton name="取消" type="gray" @handleClick="handleCancel"
        /></view>
        <view class="btn-item btn-right"
          ><GButton name="确定" @handleClick="handleSubmit"
        /></view>
      </view>
    </view>
  </GPopup>
</template>

<script>
import GPopup from '@/components/Basics/GPopup'
import GButton from '@/components/Basics/GButton'
/**
 * picker选择器
 */
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    pickerList: {
      type: Array,
      default: () => []
    },
    pickerValue: {
      type: Array,
      default: () => []
    },
    value: {
      type: Boolean,
      default: false
    }

  },
  components: {
    GPopup,
    GButton
  },
  data () {
    return {
      valueList: this.pickerValue
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
  mounted () {
    this.valueList = this.pickerValue
  },
  watch: {

  },
  methods: {
    handleChange ({ detail }) {
      this.valueList = detail.value
      this.$emit('change', this.valueList)
    },
    handleCancel () {
      this.isShow = false
    },
    handleSubmit () {
      this.$emit('confirm', this.valueList)
    }
  }
}
</script>

<style lang="scss" scoped>
.picker-container {
  width: 100%;
  height: 100%;
  padding: 0 24rpx;
  .picker-view {
    width: 100%;
    height: 188px;
    margin-bottom: 10px;
    .picker-column-item {
      @include flex-center();
    }
  }
  .btn-box {
    width: 100%;
    height: 72px;
    @include flex-between();
    .btn-item {
      width: 50%;
    }
    .btn-left{
        padding-right: 12rpx;
    }
    .btn-right{
padding-left: 12rpx;
    }
  }
}
</style>
