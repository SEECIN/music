<template>
  <view class="playbar" @tap.stop="goPlayAudioPage">
    <u-image width="30" height="30" :src="img" shape="circle"></u-image>
    <view class="playbar-name">
      <u-text class="playbar-name--ar" :lines="1" size="10px" :text="playListStore.playing[0].name"></u-text>
      <u-text :lines="1" size="10px" :text="'- ' + artist[0].name" color="rgba(0,0,0,.3)"></u-text>
    </view>
    <view class="playbar-icon">
      <view class="iconfont control-play" :class="audioStore.isOnPlay ? 'icon-zanting' : 'icon-bofang'"
        @tap.stop="changePlayState"></view>
      <view class="iconfont icon-24gf-playlist" @tap.stop="changePopupState"></view>
    </view>
    <Popup ref="popup" :popupShow="popupShow" />
  </view>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue'
import { usePlayListStore } from "@/store/playList"
import { useAudioStore } from "@/store/audio"
import Popup from '@/components/Popup.vue'

const audioStore = useAudioStore()
const playListStore = usePlayListStore()

const popupShow = ref(false)
const popup = ref()

const img = computed(() => {
  return playListStore.playing[0].al?.picUrl || playListStore.playing[0].album?.picUrl
})

const artist = computed(() => {
  return playListStore.playing[0].ar || playListStore.playing[0].artists
})

const goPlayAudioPage = (e: Event): void => {
  e.stopPropagation()
  if (!popup.value.show) uni.$u.route('pages/playAudio/index')
}

const changePlayState = (e: Event): void => {
  e.stopPropagation()
  audioStore.isOnPlay ? audioStore.pauseAudio() : audioStore.playAudio()
}

const changePopupState = (e: Event): void => {
  e.stopPropagation()
  popup.value.show = true
}

</script>

<style lang="scss" scoped>
.playbar {
  position: relative;
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 40px;
  padding: 0 5px;
  background-color: #fff;
  box-sizing: border-box;
  border-top: 1px solid #eee;

  .playbar-name {
    display: flex;
    margin-left: 10px;

    .playbar-name--ar {
      margin-right: 4px;
    }
  }

  .playbar-icon {
    position: absolute;
    right: 0;
    display: flex;

    >view {
      font-size: 20px;
      margin-right: 20px;
      color: #000;
    }
  }
}
</style>
