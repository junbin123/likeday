<script>
export default {
  globalData: {
    tabBarSelect: 0
  },
  onLaunch (options) {
    const systemInfo = uni.getSystemInfoSync()
    systemInfo.scene = options.scene
    systemInfo.titleBarHeight = /ios/.test(systemInfo.system.toLowerCase()) ? 44 : 48
    const model = systemInfo.model.toLowerCase().replace(/\s*/g, '')
    systemInfo.isIphoneX = ['iphonex', 'iphone11', 'iphone13'].some(item => model.includes(item))
    this.$store.dispatch('app/systemInfo', { ...systemInfo }) // 存储请求数据
  },
  onShow: function () {},
  methods: {},
  onHide: function () {
  }
}
</script>

<style lang="scss">
@import "./static/style/common/index.scss";
@import "./static/style/border.scss";
@import "./static/style/animation.scss";
@import "./static/style/iconfont.css";

</style>
