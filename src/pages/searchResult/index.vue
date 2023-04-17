<template>
  <view class="search-result">
    <u-sticky class="search-result--header" bgColor="#fff">
      <u-search v-model="searchVal" borderColor="#ececec" bgColor="#fff" placeholder="歌手、歌曲、歌单......" :show-action="true"
        @search="handleSearch" @custom="handleSearch" actionText="搜索"></u-search>
      <u-tabs lineColor="#FE384F" @change="handleTabsChange" :current="currTabIdx" :scrollable="false"
        :list="tabData"></u-tabs>
    </u-sticky>
    <view class="search-result--content">
      <u-loading-icon v-if="searchResult[currTabIdx].length === 0" show text="正在加载" color="#FE384F"
        textColor="#676D7D"></u-loading-icon>
      <switch-tabs :datas="searchResult" :switch="handleSwitchTab" :currTabIdx="currTabIdx">
        <template v-slot="{ data }">
          <u-list @scrolltolower="scrolltolower" :width="listWidth" :height="realHeight">
            <u-list-item v-for="item, idx in data" :key="idx">
              <u-cell @tap="handleListItemClick(item as songType, data as songType[])">
                <template #icon>
                  <u-image customStyle="margin-right: 4px" v-if="item.coverImgUrl || item.al?.picUrl" :showLoading="true"
                    :src="item.coverImgUrl || item.al?.picUrl" width="40px" height="40px" radius="4px"></u-image>
                  <u-image customStyle="margin-right: 4px" v-if="item.img1v1Url" :showLoading="true" :src="item.img1v1Url"
                    width="40px" height="40px" radius="50%"></u-image>
                </template>
                <template #title>
                  <u-text margin="0 0 2px" size="10px" color="#333333" :text="item.name"></u-text>
                  <view v-if="item.ar" class="search-cell--ar">
                    <view v-for="artist, idx in item.ar" :key="artist.id">
                      <view class="ar-artists" v-if="(item.ar.length !== 1 && idx === 0) || idx !== item.ar.length - 1">
                        <u-text size="8px" :text="artist.name + '/'" :iconStyle="{ fontSize: '8px' }"
                          color="#9C9C9C"></u-text>
                      </view>
                      <u-text v-else size="8px" :text="artist.name" color="#9C9C9C"></u-text>
                    </view>
                    <u-text size="8px" :text="'&nbsp;-&nbsp;' + item.al.name" color="#9C9C9C"></u-text>
                  </view>
                  <u-text margin="2px 0 0" v-if="item.alia && item.alia.length !== 0" v-for="alia, index in item.alia"
                    :key="index" size="8px" :text="alia" color="#9C9C9C"></u-text>
                  <view v-if="item.originSongSimpleData" class="search-cell--ar ">
                    <u-text margin="2px 0 0" :text="'原唱 - '" size="8px" color="#9C9C9C"></u-text>
                    <view v-for="originar, index in item.originSongSimpleData.artists" :key="originar.id">
                      <u-text
                        v-if="(item.originSongSimpleData.artists.length !== 1 && index === 0) || index !== item.originSongSimpleData.artists.length - 1"
                        margin="2px 0 0" :text="originar.name + '/'" size="8px" color="#9C9C9C"></u-text>
                      <u-text margin="2px 0 0" v-else size="8px" :text="originar.name" color="#9C9C9C"></u-text>
                    </view>
                  </view>
                  <u-text margin="2px 0 0" v-if="item.creator" size="8px"
                    :text="item.trackCount + '首 , by ' + item.creator.nickname + ', 播放' + bigNumberTransform(item.playCount) + '次'"
                    color="#9C9C9C"></u-text>
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

<script lang="ts" setup>
import { ref, inject, getCurrentInstance, computed } from 'vue'
import { usePlayListStore } from "@/store/playList"
import { onLoad, onShow } from "@dcloudio/uni-app"
import type { searchResultType, songType } from '@/config/interface.d'
import bigNumberTransform from "@/util/formatNumber"
import Notify from "@/components/Notify.vue"
import switchTabs from "@/components/switchTabs.vue"
import PlayBar from '@/components/PlayBar.vue'

const http = inject("$http") as Function
const playListStore = usePlayListStore()

const notify = ref()
const searchVal = ref("")
const searchResult = ref<searchResultType[][]>([[], [], []])
const currTabIdx = ref(0)
const pageHeight = ref(0)
const listHeight = ref(0)
const playbarHeight = ref(0)

const tabData = [{
  name: "单曲",
  keyword: "songs",
  offset: 0,
  count: {
    name: "songCount",
    total: 0
  },
  func: (offset: number) => getSearchSongs(1, "songs", offset)
}, {
  name: "歌单",
  keyword: "playlists",
  offset: 0,
  count: {
    name: "playlistCount",
    total: 0
  },
  func: (offset: number) => getSearchSongs(1000, "playlists", offset)
}, {
  name: "歌手",
  keyword: "artists",
  offset: 0,
  count: {
    name: "artistCount",
    total: 0
  },
  func: (offset: number) => getSearchSongs(100, "artists", offset)
}]

onLoad(async options => {
  searchVal.value = options?.searchVal
  if (playListStore.playing.length > 0) playbarHeight.value = 40
  uni.createSelectorQuery().in(getCurrentInstance()).select(".search-result").boundingClientRect().exec((data) => {
    pageHeight.value = data[0].height
  })
  uni.createSelectorQuery().in(getCurrentInstance()).select(".search-result--header").boundingClientRect().exec((data) => {
    listHeight.value = pageHeight.value - data[0].height
  })
  searchResult.value[currTabIdx.value].push(...await tabData[currTabIdx.value].func(tabData[currTabIdx.value].offset))
})

onShow(() => {
  if (playListStore.playing.length > 0) playbarHeight.value = 40
})

const realHeight = computed(() => {
  return listHeight.value - playbarHeight.value
})

const handleSearch = async () => {
  searchResult.value = [[], [], []]
  searchResult.value[currTabIdx.value].push(...await tabData[currTabIdx.value].func(tabData[currTabIdx.value].offset))
}

const listWidth = computed(() => {
  let width
  uni.getSystemInfo({
    success: (res) => {
      width = res.windowWidth
    }
  })
  return width
})

async function getSearchSongs (type: number, keyword: string, offset: number) {
  const result = await http({
    requestName: "search",
    parmas: {
      offset: offset,
      type,
      keywords: searchVal.value
    }
  })
  tabData[currTabIdx.value].count.total = result.result[tabData[currTabIdx.value].count.name]
  return result.result[keyword]
}

async function handleSwitchTab (index: number) {
  currTabIdx.value = index
  if (searchResult.value[index].length === 0) {
    searchResult.value[index].push(...await tabData[index].func(tabData[index].offset))
  }
}

async function handleTabsChange (curr: { index: number, keyword: string, func: Function }) {
  currTabIdx.value = curr.index
  if (searchResult.value[curr.index].length === 0) {
    searchResult.value[curr.index].push(...await curr.func(tabData[curr.index].offset))
  }
}

function handleListItemClick (song: songType, data: songType[]) {
  uni.$u.route('pages/playAudio/index')
  playListStore.changePlaying(song)
  playListStore.setPlayList(data)
}

async function scrolltolower () {
  tabData[currTabIdx.value].offset++
  if (tabData[currTabIdx.value].offset > Math.ceil(tabData[currTabIdx.value].count.total / 30) || tabData[currTabIdx.value].offset === tabData[currTabIdx.value].count.total / 30) {
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
  let data = await tabData[currTabIdx.value].func(tabData[currTabIdx.value].offset)
  if (tabData[currTabIdx.value].offset === Math.floor(tabData[currTabIdx.value].count.total / 30)) {
    searchResult.value[currTabIdx.value].push(...data.slice(0, tabData[currTabIdx.value].count.total - 30 * Math.floor(tabData[currTabIdx.value].count.total / 30)))
  } else {
    searchResult.value[currTabIdx.value].push(...data)
  }
}
</script>

<style scoped lang="scss">
.search-result {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.playbar {
  width: 100%;
  height: 40px;
}

.search-result--content {
  padding: 0 10px;

  .search-cell--ar {
    display: flex;
    align-items: center;
    vertical-align: middle;
    color: #9C9C9C;

    .ar-artists {
      display: flex;
      align-items: center;
      font-size: 8px;
    }
  }
}
</style>
