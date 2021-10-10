<template>
  <view
    class="loading-container flex-center flex-column"
    v-if="isShow"
    :style="[boxStyle]">
    <div class="sk-folding-cube">
      <div class="sk-cube1 sk-cube"></div>
      <div class="sk-cube2 sk-cube"></div>
      <div class="sk-cube4 sk-cube"></div>
      <div class="sk-cube3 sk-cube"></div>
    </div>
    <view class="font-size-16 font-color-grey loading-text">加载中<span style="width:20px">{{dot}}</span></view>
  </view>
</template>

<script>
// B6BDFF 929CFF 6D7BFF 495AFF
/**
 * Loading 组件
 */
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'fixed'
    },
    zIndex: {
      type: Number,
      default: 10
    }
  },
  components: {

  },
  data () {
    return {
      dot: '...'
    }
  },
  computed: {
    boxStyle () {
      return {
        position: this.position,
        zIndex: this.zIndex
      }
    },
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
    setInterval(() => {
      if (this.dot.length === 3) {
        this.dot = ''
      } else {
        this.dot += '.'
      }
    }, 700)
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.loading-container{
  background: #fff;
  width: 100%;
  height: 100%;
  transition: all 1s;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .sk-folding-cube {
  margin: 20px auto;
  width: 40px;
  height: 40px;
  position: relative;
  transform: rotateZ(45deg);
}
.sk-folding-cube .sk-cube {
  float: left;
  width: 50%;
  height: 50%;
  position: relative;
  transform: scale(1.1);
}
.sk-folding-cube .sk-cube:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #B6BDFF;
  animation: sk-foldCubeAngle 2.4s infinite linear both;
  transform-origin: 100% 100%;
}
.sk-folding-cube .sk-cube2 {
  transform: scale(1.1) rotateZ(90deg);
}
.sk-folding-cube .sk-cube3 {
  transform: scale(1.1) rotateZ(180deg);
}
.sk-folding-cube .sk-cube4 {
  transform: scale(1.1) rotateZ(270deg);
}
.sk-folding-cube .sk-cube2:before {
  animation-delay: 0.3s;
  background: #929CFF;
}
.sk-folding-cube .sk-cube3:before {
  animation-delay: 0.6s;
  background: #6D7BFF;
}
.sk-folding-cube .sk-cube4:before {
  animation-delay: 0.9s;
  background: #495AFF;
}
@keyframes sk-foldCubeAngle {
  0%,
  10% {
    transform: perspective(140px) rotateX(-180deg);
    opacity: 0;
  }
  25%,
  75% {
    transform: perspective(140px) rotateX(0deg);
    opacity: 1;
  }
  90%,
  100% {
    transform: perspective(140px) rotateY(180deg);
    opacity: 0;
  }
}
.loading-text{
  padding: 18px;
}

}
</style>
