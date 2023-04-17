<template>
  <view class="newSong">
    <u-sticky class="newSong--header" bgColor="#fff">
      <u-tabs lineColor="#FE384F" :current="currTabIdx" @change="handleTabsChange" :scrollable="false"
        :list="tabData"></u-tabs>
    </u-sticky>
    <view class="newSong-content">
      <u-loading-icon v-if="newSongList[currTabIdx].length === 0" show text="正在加载" color="#FE384F"
        textColor="#676D7D"></u-loading-icon>
      <switch-tabs :datas="newSongList" :switch="handleSwitchTab" :currTabIdx="currTabIdx">
        <template v-slot="{ data }">
          <u-list @scrolltolower="scrolltolower" :width="listWidth" :height="realHeight">
            <u-list-item v-for="item, idx in data" :key="idx">
              <u-cell @tap="handleListItemClick(item as songType, data as songType[])">
                <template #icon>
                  <u-image customStyle="margin-right: 4px" :showLoading="true"
                    :src="item.album.blurPicUrl || item.album.picUrl" width="40px" height="40px" radius="4px"></u-image>
                </template>
                <template #title>
                  <view>
                    <u-text v-if="item.alias.length === 0" margin="0 0 2px" size="10px" color="#333333"
                      :text="item.name"></u-text>
                    <u-text v-else margin="0 0 2px" :lines="1" size="10px" color="#333333"
                      :text="item.name + '&nbsp;&nbsp;(' + item.alias + ')'"></u-text>
                  </view>
                  <view v-if="item.artists" class="song-artists">
                    <view v-for="artist, idx in item.artists" :key="artist.id">
                      <view v-if="(item.artists.length !== 1 && idx === 0) || idx !== item.artists.length - 1">
                        <u-text size="8px" :text="artist.name + '/'" :iconStyle="{ fontSize: '8px' }"
                          color="#9C9C9C"></u-text>
                      </view>
                      <u-text v-else size="8px" :text="artist.name" color="#9C9C9C"></u-text>
                    </view>
                  </view>
                </template>
              </u-cell>
            </u-list-item>
          </u-list>
        </template>
      </switch-tabs>
    </view>
    <PlayBar class="playbar" v-if="playListStore.playing.length > 0" />
    <Notify ref="notify" />
  </view>
</template>

<script setup lang='ts'>
import { ref, inject, computed, getCurrentInstance } from 'vue'
import { onLoad, onShow } from "@dcloudio/uni-app"
import type { songType } from '@/config/interface.d'
import switchTabs from "@/components/switchTabs.vue"
import Notify from "@/components/Notify.vue"
import { usePlayListStore } from "@/store/playList"
import PlayBar from '@/components/PlayBar.vue'

const playListStore = usePlayListStore()
const http = inject("$http") as Function

const notify = ref()
const newSongData = ref<songType[][]>([[], [], [], [], []])
const newSongList = ref<songType[][]>([[], [], [], [], []])
const currTabIdx = ref(0)
const listHeight = ref(0)
const pageHeight = ref(0)
const playbarHeight = ref(0)
const tabData = [{
  name: "推荐",
  type: 0,
  offset: 0,
  total: 0,
  func: () => getNewSong(0)
}, {
  name: "华语",
  type: 7,
  offset: 0,
  total: 0,
  func: () => getNewSong(7)
}, {
  name: "欧美",
  type: 96,
  offset: 0,
  total: 0,
  func: () => getNewSong(96)
}, {
  name: "日本",
  type: 8,
  offset: 0,
  total: 0,
  func: () => getNewSong(8)
}, {
  name: "韩国",
  type: 16,
  offset: 0,
  total: 0,
  func: () => getNewSong(16)
}]

onLoad(async () => {
  if (playListStore.playing.length > 0) playbarHeight.value = 40
  uni.createSelectorQuery().in(getCurrentInstance()).select(".newSong--header").boundingClientRect().exec((data) => {
    listHeight.value = pageHeight.value - data[0].height - playbarHeight.value
  })
  uni.$once("transNewSongListData", data => {
    newSongData.value[currTabIdx.value].push(...data)
    tabData[currTabIdx.value].total = data.length
    newSongList.value[currTabIdx.value].push(...data.splice(0, 30))
  })
})

onShow(() => {
  if (playListStore.playing.length > 0) playbarHeight.value = 40
})

const realHeight = computed(() => {
  return listHeight.value - playbarHeight.value
})

const listWidth = computed(() => {
  let width
  uni.getSystemInfo({
    success: (res) => {
      width = res.windowWidth
      pageHeight.value = res.windowHeight
    }
  })
  return width
})

async function getNewSong (type: number) {
  const result = await http({ requestName: "getNewSongList", parmas: { type } })
  newSongData.value[currTabIdx.value].push(...result.data)
  tabData[currTabIdx.value].total = result.data.length
  return result.data.splice(0, 30)
}

const handleListItemClick = (song: songType, data: songType[]): void => {
  uni.$u.route('pages/playAudio/index')
  playListStore.changePlaying(song)
  playListStore.setPlayList(data)
}

const handleSwitchTab = async (index: number) => {
  currTabIdx.value = index
  if (newSongList.value[index].length === 0) {
    newSongList.value[index].push(...await tabData[index].func())
  }
}

const handleTabsChange = async (curr: { index: number, func: Function }) => {
  currTabIdx.value = curr.index
  if (newSongList.value[curr.index].length === 0) {
    newSongList.value[curr.index].push(...await curr.func())
  }
}

const scrolltolower = () => {
  tabData[currTabIdx.value].offset++
  if (tabData[currTabIdx.value].offset > Math.ceil(tabData[currTabIdx.value].total / 30) || tabData[currTabIdx.value].offset === tabData[currTabIdx.value].total / 30) {
    notify.value.$refs.uNotify.show({
      message: '没有更多数据了',
      bgColor: 'rgba(0,0,0,.5)',
      duration: 1000
    })
    return false
  }
  notify.value.$refs.uNotify.show({
    message: '正在加载',
    bgColor: 'rgba(0,0,0,.5)',
    duration: 1000
  })
  if (tabData[currTabIdx.value].offset === Math.floor(tabData[currTabIdx.value].total / 30)) {
    newSongList.value[currTabIdx.value].push(...newSongData.value[currTabIdx.value].slice(tabData[currTabIdx.value].offset * 30, tabData[currTabIdx.value].total))
  } else {
    newSongList.value[currTabIdx.value].push(...newSongData.value[currTabIdx.value].slice(tabData[currTabIdx.value].offset * 30, (tabData[currTabIdx.value].offset + 1) * 30))
  }
}
</script>

<style lang="scss" scoped>
.newSong {
  width: 100vw;
  height: 100vh;

  .newSong-content {
    .song-artists {
      display: flex;
      align-items: center;
    }
  }

  .playbar {
    width: 100%;
    height: 40px;
  }
}
</style>
