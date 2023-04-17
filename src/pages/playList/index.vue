<template>
  <view class="playlist">
    <scroll-view class="scroll-playList" scroll-y @scrolltolower="loadMore">
      <view v-if="playList.length > 0" class="playList-content">
        <view v-for="item, idx in playList" :key="idx" class="playList-content--item" @tap="goTopListDetailPage(item.id)">
          <PlayList :playListData="item" />
          <u-text class="recommend-item--name" color="#3E4658" size="10" :text="item.name"></u-text>
        </view>
      </view>
    </scroll-view>
    <PlayBar class="playbar" v-if="playListStore.playing.length > 0" />
    <Notify ref="notify" />
  </view>
</template>

<script setup lang='ts'>
import { ref, inject } from 'vue'
import { onLoad, onShow } from "@dcloudio/uni-app"
import type { playListType } from '@/config/interface.d'
import PlayList from "@/components/PlayList.vue"
import Notify from "@/components/Notify.vue"
import PlayBar from '@/components/PlayBar.vue'
import { usePlayListStore } from "@/store/playList"

const playListStore = usePlayListStore()
const http = inject("$http") as Function

const notify = ref()
const playList = ref<playListType[]>([])
const total = ref(0)
const offset = ref(0)
const playbarHeight = ref('0px')

onLoad(async () => {
  if (playListStore.playing.length > 0) playbarHeight.value = '40px'
  const result = await getPlayList()
  total.value = result.total
  playList.value.push(...result)
})

onShow(() => {
  if (playListStore.playing.length > 0) playbarHeight.value = '40px'
})

const goTopListDetailPage = (id: string): void => {
  uni.$u.route('pages/playListDetail/index', {
    id
  })
}

const loadMore = async () => {
  let message = '正在加载'
  offset.value++
  if (offset.value > Math.ceil(total.value / 30)) {
    message = '没有更多数据了'
    notify.value.$refs.uNotify.show({
      message,
      bgColor: 'rgba(0,0,0,.5)',
      duration: 1000
    })
    return false
  }
  notify.value.$refs.uNotify.show({
    message,
    bgColor: 'rgba(0,0,0,.5)',
    duration: 1000
  })
  playList.value.push(...await getPlayList())
}

const getPlayList = async () => {
  const result = await http({
    requestName: 'getPlayList', parmas: {
      limit: 30,
      offset: offset.value
    }
  })
  return result.playlists
}
</script>

<style lang="scss" scoped>
.playlist {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100vw;
  height: 100vh;

  .scroll-playList {
    width: 100%;
    height: calc(100vh - v-bind(playbarHeight));

    .playList-content {
      display: grid;
      grid-template-columns: auto auto auto;
      grid-template-rows: auto;
      justify-items: center;
      padding: 10px;
      box-sizing: border-box;

      .playList-content--item {
        width: 110px;
      }
    }
  }

  .playbar {
    width: 100vw;
    height: 40px;
  }
}
</style>
