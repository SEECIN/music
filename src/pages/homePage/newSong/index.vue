<template>
  <view class="recommend-title" @tap="goNewSongPage">
    <u-text size="14px" color="#3F475B" bold text="新歌新碟"></u-text>
    <u-icon top=".8px" bold name="arrow-right" color="#3F475B" :size="14"></u-icon>
  </view>
  <view class="newSong-container">
    <switch-tabs v-if="newSongList.length > 0" :datas="newSongList">
      <template v-slot="{ data }">
        <view class="newSong-list--list">
          <view class="newSong-list--item" @tap="handleListItemClick(item as songType, data as songType[])"
            v-for="item in data" :key="item.id">
            <u-image :src="item.album.picUrl" width="50px" height="50px" radius="5px"></u-image>
            <view class="list-item--detail">
              <u-text size="12px" color="#3F475B" bold :text="item.name"></u-text>
              <view class="detail-arist">
                <view v-for="ar, idx in item.artists" color="#7E8490" :key="ar.id">
                  <u-text v-if="(item.artists.length !== 1 && idx === 0) || idx !== item.artists.length - 1" size="8px"
                    :text="ar.name + '&nbsp;/&nbsp;'" :iconStyle="{ fontSize: '8px' }"></u-text>
                  <u-text v-else size="8px" :text="ar.name"></u-text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
    </switch-tabs>
  </view>
</template>

<script setup lang='ts'>
import { ref, inject } from 'vue'
import { onLoad } from "@dcloudio/uni-app"
import { usePlayListStore } from "@/store/playList"
import type { newSongListType, songType } from '@/config/interface.d'
import switchTabs from "@/components/switchTabs.vue"

const http = inject("$http") as Function
const playListStore = usePlayListStore()

const newSongList = ref<newSongListType[]>([])
const transNewSongList = ref<newSongListType[]>([])

onLoad(async () => {
  newSongList.value = await getNewSongList()
})

const goNewSongPage = (): void => {
  uni.$u.route('pages/newSong/index')
  setTimeout(() => {
    uni.$emit('transNewSongListData', transNewSongList.value)
  }, 500)
}

function handleListItemClick (song: songType, data: songType[]) {
  uni.$u.route('pages/playAudio/index')
  playListStore.changePlaying(song)
  playListStore.setPlayList(data)
}

async function getNewSongList () {
  const result = await http({ requestName: "getNewSongList", parmas: { type: 0 } })
  transNewSongList.value = result.data
  return result.data.splice(0, 24).reduce((acc: any, item: object, idx: number, arr: any) => {
    if (!acc[Math.floor(idx / 3)]) acc[Math.floor(idx / 3)] = [arr[3 * Math.floor(idx / 3)], arr[3 * Math.floor(idx / 3) + 1], arr[3 * Math.floor(idx / 3) + 2]]
    return acc
  }, [])
}
</script>

<style lang="scss" scoped>
.recommend-title {
  display: flex;
  align-items: center;
}

.newSong-container {
  padding: 10px 0;

  .newSong-list--list {
    width: calc(100vw - 30px);
    margin-right: 10px;

    .newSong-list--item {
      display: flex;
      align-items: center;
      margin-bottom: 6px;

      .list-item--detail {
        padding-left: 10px;

        .detail-arist {
          padding-top: 4px;
          display: flex;
          align-items: center;
        }
      }
    }
  }

}
</style>
