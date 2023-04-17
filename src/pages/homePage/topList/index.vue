<template>
  <view class="toplist-title" @tap="goTopListPage">
    <u-text size="14px" color="#3F475B" bold text="排行榜"></u-text>
    <u-icon top=".8px" bold name="arrow-right" color="#3F475B" :size="14"></u-icon>
  </view>
  <view class="topList-container">
    <switch-tabs v-if="topList.length > 0" :datas="topList">
      <template v-slot="{ data }">
        <view class="topList-item">
          <view class="topList-item--title" @tap="goTopListDetailPage((data as topListType).id)">
            <u-text size="14px" color="#3F475B" bold :text="(data as topListType).name"></u-text>
            <u-icon top=".8px" bold name="arrow-right" color="#3F475B" :size="14"></u-icon>
          </view>
          <view class="topList-item--main">
            <view class="topList-item--list" v-for="song, idx in (data as topListType).songs" :key="song.id"
              @tap="handleListItemClick(song, (data as topListType).songs)">
              <u-image :src="song.al.picUrl" width="40px" height="40px" radius="5px"></u-image>
              <view class="topList-list--detail">
                <u-text size="12px" color="#3F475B" bold :text="song.name"></u-text>
                <view class="list-arist">
                  <u-text v-for="ar in song.ar" color="#7E8490" :key="ar.id" class="list-artist--at" size="8px"
                    :text="ar.name"></u-text>
                </view>
              </view>
              <u-text class="list-ranking" size="16px" :color="color[idx as keyof typeof color]" block bold
                :text="idx + 1"></u-text>
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
import type { topListType } from '@/config/interface.d'
import switchTabs from "@/components/switchTabs.vue"
import { usePlayListStore } from "@/store/playList"

const playListStore = usePlayListStore()
const http = inject("$http") as Function

const topList = ref<topListType[]>([])
const transTopList = ref<topListType[]>([])
const color = <string[]>["#C4902A", "#7980A4", "#CA7B50"]

onLoad(() => {
  getTopList()
})

async function getTopList () {
  const result = await http({ requestName: "getTopList" })
  transTopList.value = result.list
  topList.value = result.list.splice(0, 6)
  topList.value.map(async (item: any) => {
    let songs = await http({ requestName: "getTopListSongs", parmas: { limit: 3, id: item.id } })
    item.songs = songs.songs
    return item
  })
}

const handleListItemClick = (song: any, data: any): void => {
  uni.$u.route('pages/playAudio/index')
  playListStore.changePlaying(song)
  playListStore.setPlayList(data)
}

const goTopListPage = (): void => {
  uni.$u.route('pages/topList/index')
  setTimeout(() => {
    uni.$emit('transTopListData', transTopList.value)
  }, 500)
}

const goTopListDetailPage = (id: string): void => {
  uni.$u.route('pages/playListDetail/index', {
    id
  })
}
</script>

<style lang="scss" scoped>
.toplist-title {
  display: flex;
  align-items: center;
  padding-left: 10px;
}

.topList-container {
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  padding: 10px 0 0 10px;

  .topList-item {
    width: calc(100vw - 30px);
    margin-right: 10px;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 0 1px 1px #e1e1e1;
    overflow: hidden;

    .topList-item--title {
      display: flex;
      align-items: center;
      padding: 5px 0;
    }

    .topList-item--main {
      .topList-item--list {
        display: flex;
        align-items: center;
        padding: 5px 0;

        .topList-list--detail {
          padding-left: 20px;

          .list-arist {
            display: flex;
            align-items: center;
            padding-top: 4px;

            .list-artist--at {
              margin-right: 10px;
            }
          }
        }

        .list-ranking {
          margin-left: auto;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
