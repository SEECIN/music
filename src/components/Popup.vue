<template>
  <view class="popup-bg" v-if="show" @tap.stop="show = false"></view>
  <u-popup ref="uPopup" :overlay="false" :show="show" :round="10" @close="show = false" closeable>
    <view class="popup">
      <view class="popup-title">
        <u-text size="14px" bold text="当前播放"></u-text>
        <u-text size="14px" :text="'(' + playListStore.playList.length + ')'" color="rgba(0,0,0,.6)"></u-text>
      </view>
      <view class="popup-playlist">
        <view v-for="item, index in playListStore.playList" :key="index"
          @tap="handleChangePlaying(item, playListStore.playList)">
          <u-text :lines="1" size="12px" :text="item.name"
            :color="index === songInPlayList ? '#FE384F' : '#000'"></u-text>
          <view class="popup-playlist--artists">
            <view v-for="artist, idx in (item?.ar || item?.artists)" :key="artist.id">
              <u-text
                v-if="((item.ar?.length || item.artists?.length) !== 1 && idx === 0) || idx !== (item.ar?.length || item.artists?.length) - 1"
                size="10px" :text="artist.name + '/'" :iconStyle="{ fontSize: '10px' }"
                :color="index === songInPlayList ? '#FE384F' : '#9C9C9C'"></u-text>
              <u-text v-else size="10px" :text="artist.name"
                :color="index === songInPlayList ? '#FE384F' : '#9C9C9C'"></u-text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue'
import { usePlayListStore } from "@/store/playList"
import type { songType } from '@/config/interface.d'

const playListStore = usePlayListStore()

const show = ref(false)

const songInPlayList = computed(() => {
  return playListStore.playList.findIndex(
    (item) => item.id === playListStore.playing[0].id
  );
});

const handleChangePlaying = (song: songType, data: songType[]): void => {
  playListStore.changePlaying(song)
  playListStore.setPlayList(data)
}

defineExpose({
  show
})
</script>

<style lang="scss" scoped>
.popup-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, .5);
  overflow: hidden;
  z-index: 2;
}

.popup {
  width: 100vw;
  height: 50vh;
  padding: 10px;

  .popup-title {
    display: flex;
    align-items: center;
    padding-top: 4px;
  }

  .popup-playlist {
    width: 100%;
    height: 44vh;
    margin: 6px 0;
    overflow-y: auto;

    >view {
      display: flex;
      align-items: center;
      padding-top: 10px;

      .popup-playlist--artists {
        display: flex;
        margin-left: 16px;
      }
    }
  }
}
</style>
