<template>
  <view class="auth-info-container" v-if="!userInfo.isAuth">
    <button  @click="handleClick" class="auth-info-btn" />
  </view>
</template>

<script>
import { updateUserInfo } from '@/app/service/user.js'
import { mapState } from 'vuex'
export default {
  name: 'AuthInfo',
  components: {
  },
  props: {},
  data () {
    return {
    }
  },
  mounted () {

  },
  computed: {
    ...mapState('app', {
      userInfo: 'userInfo'
    })
  },
  methods: {
    async handleClick () {
      await updateUserInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
  .auth-info-container .auth-info-btn{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

</style>
