<template>
  <view class="topList">
    <view class="topList-item" v-for="item, idx in topList" :key="idx" @tap="handleItemTap(item.id)"
      :style="{ backgroundImage: `url(${item.coverImgUrl})` }">
      <view class="topList-item--name">{{ item.name }}</view>
      <view class="topList-item--line"></view>
      <view class="topList-item--update">{{ item.updateFrequency }}</view>
    </view>
    <PlayBar class="playbar" v-if="playListStore.playing.length > 0" />
  </view>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { onLoad } from "@dcloudio/uni-app"
import type { topListType } from '@/config/interface.d'
import PlayBar from '@/components/PlayBar.vue'
import { usePlayListStore } from "@/store/playList"

const playListStore = usePlayListStore()
const topList = ref<topListType[]>([])

onLoad(() => {
  uni.$once("transTopListData", data => {
    topList.value.push(...data)
  })
})

const handleItemTap = (id: string): void => {
  uni.$u.route('pages/playListDetail/index', {
    id
  })
}
</script>

<style lang="scss" scoped>
.topList {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto;
  justify-items: center;
  width: 100vw;
  height: 100vh;
  padding: 10px;
  color: #fff;
  box-sizing: border-box;
  overflow-y: auto;

  .playbar {
    width: 100%;
    height: 40px;
  }

  .topList-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 30vw;
    height: 30vw;
    margin-bottom: 10px;
    padding: 4px;
    border-radius: 8px;
    text-align: center;
    box-sizing: border-box;

    .topList-item--line {
      width: 22vw;
      height: 1px;
      background-color: rgba(255, 255, 255, .7);
      margin: 4px 0;
    }

    .topList-item--name {
      font-size: 14px;
      font-weight: 600;
    }

    .topList-item--update {
      font-size: 10px;
      color: rgba(255, 255, 255, .7);
    }
  }
}
</style>
