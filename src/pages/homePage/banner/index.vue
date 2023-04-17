<template>
  <u-swiper :displayMultipleItems=0 indicator indicatorMode="dot" :circular=true :list="bannerList"
    @change="changeBanner"></u-swiper>
</template>

<script setup lang='ts'>
import { ref, inject, defineEmits } from 'vue'
import { onLoad } from "@dcloudio/uni-app"
import type { bannerResType, currentBannerType, bannerListType } from '@/config/interface.d'

const http = inject("$http") as Function
const emit = defineEmits(['changeBackGround'])

const bannerList = ref<bannerListType[]>([])

onLoad(() => {
  getBannerList()
})

const changeBanner = (index: currentBannerType) => {
  emit('changeBackGround', bannerList.value[index.current])
}

async function getBannerList () {
  const result = await http({ requestName: "getBannerList" })
  result.banners.map((item: bannerResType) => bannerList.value.push(item["imageUrl"]))
  Object.freeze(bannerList)
  emit('changeBackGround', bannerList.value[0])
}
</script>

<style lang="scss" scoped>
</style>
