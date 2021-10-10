<template>
  <view class="container">{{ title }}</view>
</template>

<script lang="ts">
import Vue from 'vue'
import { sum } from './index'
export default Vue.extend({
  data () {
    return {
      title: 'Hello TypeScript',
      name: 'lottery'
    }
  },
  onLoad () {
    console.log(sum(12, 45), '----')

    // 联合类型
    let name: string | number
    name = 'seven'
    name = 7
    console.log(name)

    // 接口interfaces
    interface Person {
      name: string;
      age: number;
      [propName: string]: any;
    }
    const tom: Person = {
      name: 'Tom',
      age: 25,
      height: 234
    }
    console.log(tom)

    // 数组
    const list1: number[] = [1, 2, 3]
    const list2: any[] = ['wujunbin', 25, { office: 'tuyoung' }]
    console.log(list1, list2)
  },
  onShow () {
    console.log('123')
  }
})
</script>

<style lang="scss" scoped></style>
