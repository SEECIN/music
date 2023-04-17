<template>
  <view class="playlist-detail">
    <view class="playlist-detail-info" :style="{
      backgroundImage: imgData?.coverImgUrl ? `url(${imgData?.coverImgUrl})` : 'url()'
    }">
      <view class="info-main--img">
        <PlayList :playListData="imgData" v-if="imgData" :needPlayBtn="false" :boxShadowColor="'rgba(255,255,255,.2)'" />
      </view>
      <view class="info-main--right">
        <u-text :lines="1" size="16px" color=" #fff" :text="imgData?.name"></u-text>
        <u-text size="10px" color=" rgba(255, 255, 255, .6)" :text="updateTime + '更新'"></u-text>
        <u-text :lines="1" size="12px" color=" rgba(255, 255, 255, .6)" :text="imgData?.description"></u-text>
      </view>
    </view>
    <view class="playlist-detail-list" v-if="renderPlayList.length > 0">
      <u-list @scrolltolower="scrolltolower" width="100vw" :height="realHeight">
        <u-list-item v-for="item, idx in renderPlayList" :key="idx">
          <u-cell @tap="handleListItemClick(item as songType, playList as songType[])">
            <template #icon>
              <u-image customStyle="margin-right: 4px" :showLoading="true" :src="item.al.picUrl" width="40px"
                height="40px" radius="4px"></u-image>
            </template>
            <template #title>
              <view>
                <u-text v-if="item.al.tns.length > 0" margin="0 0 2px" :lines="1" size="10px" color="#333333"
                  :text="item.name + '&nbsp;&nbsp;(' + item.al.tns + ')'"></u-text>
                <u-text v-else margin="0 0 2px" size="10px" color="#333333" :text="item.name"></u-text>
              </view>
              <view v-if="item.ar" class="song-artists">
                <view v-for="artist, idx in item.ar" :key="artist.id">
                  <view v-if="(item.ar.length !== 1 && idx === 0) || idx !== item.ar.length - 1">
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
    </view>
    <u-loading-icon v-if="renderPlayList.length === 0" show text="正在加载" color="#FE384F"
      textColor="#676D7D"></u-loading-icon>
    <PlayBar class="playbar" v-if="playListStore.playing.length > 0" />
  </view>
  <Notify ref="notify" />
</template>

<script setup lang='ts'>
import { ref, inject, computed, getCurrentInstance } from 'vue'
import { onLoad, onShow } from "@dcloudio/uni-app"
import PlayList from "@/components/PlayList.vue"
import type { songType, playListType } from '@/config/interface.d'
import { usePlayListStore } from "@/store/playList"
import Notify from "@/components/Notify.vue"
import PlayBar from '@/components/PlayBar.vue'


const playListStore = usePlayListStore()
const http = inject("$http") as Function

const notify = ref()
const playListId = ref('')
const playList = ref<songType[]>([])
const renderPlayList = ref<songType[]>([])
const imgData = ref<playListType>()
const pageHeight = ref(0)
const listHeight = ref(0)
const offset = ref(0)
const limit = ref(20)
const listLength = ref(0)
const playbarHeight = ref(0)

onLoad(async options => {
  if (playListStore.playing.length > 0) playbarHeight.value = 40
  uni.getSystemInfo({
    success: (res) => {
      pageHeight.value = res.windowHeight
    }
  })
  uni.createSelectorQuery().in(getCurrentInstance()).select(".playlist-detail-info").boundingClientRect().exec((data) => {
    listHeight.value = pageHeight.value - data[0].height - 10
  })
  playListId.value = options?.id
  await getPlayListData()
  renderPlayList.value.push(...playList.value.slice(0, limit.value))
})

onShow(() => {
  if (playListStore.playing.length > 0) playbarHeight.value = 40
})

const realHeight = computed(() => {
  return listHeight.value - playbarHeight.value
})

const handleListItemClick = (song: songType, data: songType[]): void => {
  uni.$u.route('pages/playAudio/index')
  playListStore.changePlaying(song)
  playListStore.setPlayList(data)
}

const updateTime = computed(() => {
  return uni.$u.date(imgData.value?.updateTime, 'mm-dd').replace('-', '月') + '日'
})

const getPlayListData = async () => {
  const result = await http({ requestName: 'getPlayListDetail', parmas: { id: playListId.value } })
  imgData.value = result.playlist
  playList.value = result.playlist.tracks
  listLength.value = result.playlist.tracks.length
}

const scrolltolower = () => {
  offset.value++
  if (offset.value > Math.ceil(listLength.value / limit.value) || offset.value === listLength.value / limit.value) {
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
  if (offset.value === Math.floor(listLength.value / limit.value)) {
    renderPlayList.value.push(...playList.value.slice(offset.value * limit.value, listLength.value))
  } else {
    renderPlayList.value.push(...playList.value.slice(offset.value * limit.value, (offset.value + 1) * limit.value))
  }
}
</script>

<style lang="scss" scoped>
.playlist-detail {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;

  .playbar {
    width: 100%;
    height: 40px;
  }

  .playlist-detail-info {
    display: flex;
    width: 100%;
    padding: 10px;
    background-position: top center;
    background-size: 16000%;
    border-radius: 0 0 10px 10px;
    box-sizing: border-box;


    .info-main--img {
      width: 100px;
      height: 110px;
      margin-right: 16px;
    }

    .info-main--right {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

  }

  .playlist-detail-list {
    padding-top: 10px;

    .song-artists {
      display: flex;
    }
  }

}
</style>
