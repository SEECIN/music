<template>
  <view class="switch-tabs">
    <view class="switch-tabs--item" v-for="data, idx in datas" :key="idx" @touchstart="touchstart" @touchmove="touchmove"
      @touchend="touchend">
      <slot :data="data"></slot>
    </view>
  </view>
</template>

<script setup lang='ts'>
import { ref, defineProps, onMounted, getCurrentInstance, watch } from 'vue'
import type { newSongListType, topListType, searchResultType, songType } from '@/config/interface.d'

const startPageX = ref(0)
const offsetX = ref("")
const currSequence = ref(0)
const transitionTime = ref("0s")
const switchWidth = ref(0)

const props = withDefaults(defineProps<{
  datas: Array<newSongListType | topListType | searchResultType | songType>,
  switch?: Function,
  currTabIdx?: number
}>(), {})

onMounted(() => {
  let ele = uni.createSelectorQuery().in(getCurrentInstance()).select(".switch-tabs--item")
  ele.boundingClientRect().exec((data) => {
    switchWidth.value = data[0].width
  })
})

watch(() => props.currTabIdx, (newVal, oldVal) => {
  currSequence.value = newVal as number
  transitionTime.value = "0.3s"
  offsetX.value = -(switchWidth.value * (newVal as number)) + 'px'

})

const touchstart = (e: any): void => {
  startPageX.value = e.changedTouches[0].pageX
  transitionTime.value = "0s"
}

const touchmove = (e: any) => {
  if ((e.changedTouches[0].pageX > startPageX.value && currSequence.value === 0) || (e.changedTouches[0].pageX < startPageX.value && currSequence.value === props.datas.length - 1)) return false
  offsetX.value = -(switchWidth.value * currSequence.value) + e.changedTouches[0].pageX - startPageX.value + 'px'
}

const touchend = (e: any) => {
  if (e.changedTouches[0].pageX === startPageX.value || (e.changedTouches[0].pageX > startPageX.value && currSequence.value === 0) || (e.changedTouches[0].pageX < startPageX.value && currSequence.value === props.datas.length - 1)) return false
  transitionTime.value = "0.3s"
  e.changedTouches[0].pageX > startPageX.value ? currSequence.value-- : currSequence.value++
  offsetX.value = -(switchWidth.value * currSequence.value) + 'px'
  props.switch && props.switch(currSequence.value)
}

</script>

<style lang="scss" scoped>
.switch-tabs {
  display: flex;
  flex-direction: row;
  transform: translateX(v-bind(offsetX));
  transition: transform v-bind(transitionTime);

  .switch-tabs--item {
    flex-shrink: inherit;
  }
}
</style>
