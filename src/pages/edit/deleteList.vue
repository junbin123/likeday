<template>
  <view class="container page-container">
    <NoData v-if="!initLoading && pageList.length === 0"/>
    <view class="page-item" v-for="item in pageList" :key="item.id">
      <EventCard
        :item="item"
        @handleClick="handleEventClick"/>
    </view>
    <!-- 事件编辑选项弹窗 -->
    <EditOptionsPop v-model="showOptionsPop" :list="optionsList" @handleClick="handleOptionsClick"/>
  </view>
</template>

<script>
/**
 * 删除列表
 */
import EditOptionsPop from '@/components/Basics/EditOptionsPop.vue'
import EventCard from '@/components/Basics/EventCard'
import NoData from '@/components/Basics/NoData'
import { pagination } from '@/mixins/pagination'
import { getArchiveCountdown, archiveCountdown, deleteCountdown } from '@/app/service/countdown'
export default {
  mixins: [pagination],
  components: {
    EditOptionsPop,
    EventCard,
    NoData
  },
  data () {
    return {
      isRecovery: false, // 是否进行过恢复倒数日
      categoryId: '', // 最新恢复倒数日的categoryId
      showOptionsPop: false,
      clickItem: null, // 点击的倒数日id
      optionsList: [
        {
          title: '彻底删除',
          iconName: 'icon-delete',
          label: 'delete'
        },
        {
          title: '恢复',
          iconName: 'icon-reply',
          label: 'recovery'
        }
      ]
    }
  },
  computed: {
  },
  async onLoad (options) {
    uni.showLoading({
      title: '加载中',
      mask: true
    })
    try {
      await this.getInitList(this.params)
    } catch (err) {
      console.log(err)
    }
    uni.hideLoading()
  },
  onShow () {},
  onHide () {},
  onUnload () {
    if (this.isRecovery) {
      this.$bus('refreshHome', { categoryId: this.categoryId })
    }
  },
  onPullDownRefresh () {},
  onReachBottom () {},
  onShareAppMessage (e) {
    return {
      title: '推荐一款好用的倒数日工具给你',
      imageUrl: 'https://img-blog.csdnimg.cn/d532dcf961304234a0b26287ad7ed617.png',
      path: '/pages/index/home'
    }
  },
  methods: {
    handleEventClick (data) {
      this.clickItem = data
      this.showOptionsPop = true
      console.log(data)
    },
    handleOptionsClick ({ label }) {
      const eventDict = {
        delete: () => {
          const { id, categoryId } = this.clickItem
          deleteCountdown({ id, categoryId }).then(res => {
            console.log('delete', res)
            uni.showToast({
              title: '删除成功',
              icon: 'none'
            })
            this.showOptionsPop = false
            this.getInitList(this.params)
          })
        },
        recovery: () => {
          const { id, categoryId } = this.clickItem
          archiveCountdown({ id, categoryId, isArchive: false }).then(res => {
            console.log('recovery', res)
            this.isRecovery = true
            this.categoryId = categoryId
            uni.showToast({
              title: '已恢复',
              icon: 'success'
            })
            this.showOptionsPop = false
            this.getInitList(this.params)
          })
        }
      }
      eventDict[label] && eventDict[label]()
    },
    async getList (params) {
      const res = await getArchiveCountdown(params)
      this.isLoading = false
      this.isRefresh = false
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  padding-top: 20rpx;
  padding-bottom: 300rpx;
}
.page-item{
  padding-bottom: 20rpx;
}
</style>
