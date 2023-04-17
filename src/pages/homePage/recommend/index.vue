<template>
  <view class="recommend-title" @tap="gpPlayListPage">
    <u-text size="14px" color="#3E465B" bold text="推荐歌单"></u-text>
    <u-icon name="arrow-right" bold top=".8px" color="#3E465B" :size="14"></u-icon>
  </view>
  <u-scroll-list :indicator=false>
    <view v-for="item in recommendList" :key="item.id" class="recommend-item" @tap="goTopListDetailPage(item.id)">
      <PlayList :playListData="item" :width="'120px'" :height="'120px'" :iconSize=20 :addCountBackground="false" />
      <u-text class="recommend-item--name" color="#3E4658" size="10" :text="item.name"></u-text>
    </view>
  </u-scroll-list>
</template>

<script setup lang='ts'>
import { ref, inject } from 'vue'
import { onLoad } from "@dcloudio/uni-app"
import type { playListType } from '@/config/interface.d'
import PlayList from "@/components/PlayList.vue"
const http = inject("$http") as Function

const recommendList = ref<playListType[]>([])

onLoad(() => {
  getRecommendList()
})

const gpPlayListPage = (): void => {
  uni.$u.route('pages/playList/index')
}

const goTopListDetailPage = (id: string): void => {
  uni.$u.route('pages/playListDetail/index', {
    id
  })
}

async function getRecommendList () {
  const result = await http({ requestName: "getRecommendList", parmas: { limit: 6 } })
  recommendList.value = result.result
}
</script>

<style lang="scss" scoped>
.recommend-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #3E465B;
}
</style>
