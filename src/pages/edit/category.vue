<template>
  <view class="container padding-top-20">
    <NoData v-if="pageList.length === 0 && !isLoading"/>
    <view
      class="item-box"
      v-for="(item,index) in pageList"
      :style="'transform:translateY('+ (item.sort-index) * 60 +'px)'"
      :key="item.type">
      <DragCellItem
        :data-item="item"
        :title="item.name"
        :count="item.count"
        :leftImg="'/static/image/category/' + item.icon + '.png'"
        :customData="item"
        @handleSort="handleSort"
        @handleDelete="handleDelete"
        @handleEdit="handleEdit"
      />
    </view>
    <view class="add-btn padding-20">
      <ButtonItem
        name="添加分类"
        icon="icon-add"
        size="normal"
        @handleClick="handleAdd"
        />
    </view>

    <EditCatePop
      v-model="showCatePop"
      :item.sync="cateItem"
      :title="cateTitle"
      @handleSave="handleCateClick"
    />
    <GButton :isBottom="true" name="保存修改" @handleClick="handleSave" />
  </view>
</template>

<script>
/**
 * 分类编辑页
 */
import DragCellItem from '@/components/Business/Category/DragCellItem'
import EditCatePop from '@/components/Business/Category/EditCatePop'
import GButton from '@/components/Basics/GButton'
import NoData from '@/components/Basics/NoData'
import login from '@/app/request/login.js'
import ButtonItem from '@/components/Basics/ButtonItem.vue'
import { updateCategory } from '@/app/service/user.js'
import { uuid } from '@/utils/base'
import { mapState } from 'vuex'
export default {
  components: {
    ButtonItem,
    EditCatePop,
    DragCellItem,
    GButton,
    NoData
  },
  data () {
    return {
      isLoading: true,
      cateItem: {},
      cateTitle: '添加分类',
      showCatePop: false,
      pageList: []
    }
  },
  computed: {
    ...mapState('app', {
      systemInfo: 'systemInfo',
      uid: (state) => state.userInfo.uid,
      categoryList: (state) => state.userInfo.categoryList
    })
  },
  async onLoad (options) {
    uni.showLoading({
      title: '加载中',
      mask: true
    })
    if (!this.uid) {
      await login()
    }
    this.pageList = this.categoryList.map((item, index) => ({ ...item, sort: index, index }))
    this.isLoading = false
    uni.hideLoading()
  },
  onShow () {},
  onHide () {},
  onUnload () {

  },
  onPullDownRefresh () {},
  onReachBottom () {},
  methods: {
    handleSave () {
      uni.showLoading({ title: '保存中' })
      const data = this.pageList.sort((a, b) => a.sort - b.sort).map(item => {
        const { name, id, count, icon } = item
        return { name, id, count, icon }
      })
      updateCategory({ categoryList: data }).then(res => {
        this.$store.dispatch('app/updateUserInfo', { categoryList: data })
        this.$bus('categoryList', data)
        uni.hideLoading()
        uni.navigateBack()
      })
    },
    // 分类弹窗点击事件
    handleCateClick (data) {
      console.log('asd', { ...data })
      if (data.id) { // 编辑
        this.pageList = this.pageList.map(item => item.id === data.id ? data : item)
      } else {
        const addItem = {
          name: data.name,
          icon: data.icon,
          count: 0,
          id: uuid(6, 16),
          index: this.pageList.length,
          sort: this.pageList.length
        }
        this.pageList.push(addItem)
      }
      this.showCatePop = false
    },
    handleSort ({ sort, sortType }) {
      const list = this.pageList.map(item => ({ ...item }))
      const index = list.findIndex(item => item.sort === sort)
      if (sortType === 'up') {
        if (sort === 0) {
          return
        }
        const nextIndex = list.findIndex(item => item.sort === sort - 1)
        list[index].sort = sort - 1
        list[nextIndex].sort = sort
        this.pageList = list
        return
      }
      if (sortType === 'down') {
        if (sort === list.length - 1) {
          return
        }
        const nextIndex = list.findIndex(item => item.sort === sort + 1)
        list[index].sort = sort + 1
        list[nextIndex].sort = sort
        this.pageList = list
      }
    },
    handleDelete ({ count, index, type }) {
      wx.showModal({
        title: '确定删除？',
        content: count > 0 ? `当前分类下有 ${count} 个倒数日，删除后，可以在「全部」里查看` : '删除后不可恢复',
        confirmText: '删除',
        confirmColor: '#E33636',
        success: (res) => {
          if (res.cancel) {
            return
          }
          this.pageList = this.pageList
            .filter(item => item.index !== index)
            .sort((a, b) => a.sort - b.sort)
            .map((item, idx) => ({ ...item, index: idx, sort: idx }))
        }
      })
    },
    handleEdit (data) {
      this.cateItem = data
      this.cateTitle = '分类管理'
      this.showCatePop = true
    },
    handleAdd () {
      this.cateItem = {}
      this.cateTitle = '添加分类'
      this.showCatePop = true
    },
    handlePopSave () {},
    handleClosePop () {}
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f1f2f3;
  padding-bottom: 400rpx;
  .cell-box {
    padding: 20rpx;
    padding-bottom: 300rpx;
    .cell-box-sub {
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
    }
  }
  .pop-title {
    height: 64px;
    line-height: 64px;
    padding-left: 24rpx;
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
    bottom: 0;
    position: absolute;
    width: 100%;
    left: 0;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .pop-btn-left {
      width: 50%;
      height: 100%;
      padding: 12px 6px 12px 24rpx;
    }
    .pop-btn-right {
      width: 50%;
      height: 100%;
      padding: 12px 24rpx 12px 6px;
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
    content: "\e634";
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
}
.drag-box {
  position: fixed;
  width: 46px;
  top: 0;
  right: 20rpx;
  background: red;
  opacity: 0.2;
  z-index: 5;
}
.moveable-box {
  // display: none !important;
  position: fixed;
  top: 0;
  right: 0;
  background: green;
  opacity: 0.2;
  z-index: 4;
  width: 750rpx;
}
.moveable-item {
  width: 750rpx;
}
.moveable-item-sub {
  padding: 20rpx;
}

.moveable-handle {
  z-index: 99;
  position: fixed;
  top: 0;
  right: 0;
  width: 120rpx;
  background: blue;
  opacity: 0.5;
}
.moveable-handle-sub {
  padding-top: 20rpx;
  width: 120rpx;
  background: red;
  height: 3000px;
}
.none {
  display: none !important;
}
.moveable-handle-item {
  height: 50px;
  width: 100%;
  background: blue;
}
.scroll-view-box {
  width: 100vw;
  // background: red;
  padding-top: 10px;
}
.movable-area-box {
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
  // background: blue;
}
.movable-view-box {
  width: 100%;
}
.bottom-space {
  height: 200px;
}
.item-box{
  transition: all 0.3s ease-in-out;
}
.add-cate{
  height: 60px;
  width: 100%;
  background: #fff;
}
</style>
