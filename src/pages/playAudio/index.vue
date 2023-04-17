<template>
  <view class="play-audio-bg" :style="{ backgroundImage: album.picUrl ? `url(${album.picUrl})` : 'url()' }">
  </view>
  <view class="play-audio">
    <view class="play-audio-head">
      <u-notice-bar v-if="alias.length > 0" :text="playing.name + '(' + alias + ')'" speed="40" color="#fff"
        bgColor="transparent" icon=""></u-notice-bar>
      <u-notice-bar v-else :text="playing.name" speed="40" color="#fff" bgColor="transparent" icon=""></u-notice-bar>
      <view class="audio-head--ar">
        <view v-if="artists.length > 0" v-for="artist, idx in artists" :key="artist.id">
          <u-text v-if="(artists.length !== 1 && idx === 0) || idx !== artists.length - 1" size="8px"
            :text="artist.name + '/'" :iconStyle="{ fontSize: '8px' }" color="#fff"></u-text>
          <u-text v-else size="8px" :text="artist.name" color="#fff"></u-text>
        </view>
      </view>
    </view>
    <view class="play-audio-record" @tap="handleShowLyric">
      <!-- <view class="curr-lyric-bg">
          我用十年青春,赴你最后之约
        </view>
        <view class="curr-lyric" text="我用十年青春,赴你最后之约">我用十年青春,赴你最后之约</view> -->
      <scroll-view v-if="showLyric && playListStore.lyric.length > 0" class="play-radio-lyric" scroll-y
        scroll-with-animation :scroll-top="scrollTop">
        <view class="lyric"
          :class="{ 'curr-lyric': item.time <= formatSeconds(audioStore.currentTime).slice(3, 11) && formatSeconds(audioStore.currentTime).slice(3, 11) < item.prevTime }"
          v-for="item, idx in playListStore.lyric" :key="idx">{{ item.text }}
        </view>
      </scroll-view>
      <view class="play-radio-disc" v-else>
        <view class="audio-record--styli" :class="{ 'record-styli--rotate': audioStore.isOnPlay }"></view>
        <view class="audio-record--record">
          <view class="record-cover" :class="{ 'record-cover--rotate': audioStore.isOnPlay }"
            :style="{ backgroundImage: album.picUrl ? `url(${album.picUrl})` : 'url()', animationPlayState: audioStore.isOnPlay ? 'running' : 'paused' }">
          </view>
        </view>
      </view>
    </view>
    <view class="play-radio-control">
      <view class="radio-control-time">
        <view>{{ formatSeconds(audioStore.currentTime).slice(3, 8) }}</view>
        <u-line-progress class="radio-control--progress"
          :percentage="offestPercentage === 0 ? audioStore.percentage : offestPercentage" height="2" activeColor="#fff"
          inactiveColor="rgba(255,255,255,.3)">
          <view class="progress-dot" :class="{ 'progress-dot--touched': isDotTouch }" @touchstart="handleDotTouchStart"
            @touchmove="handleDotTouchMove" @touchend="handleDotTouchEnd"></view>
        </u-line-progress>
        <view>{{ formatSeconds(audioStore.duration).slice(3, 8) }}</view>
      </view>
      <view class="radio-control--btn">
        <i class="iconfont" :class="audioStore.playMode.iconName" @tap="handelePlayModeClick"></i>
        <i class="iconfont icon-shangyishoushangyige" @tap="audioStore.prev()"></i>
        <i class="iconfont control-play" :class="audioStore.isOnPlay ? 'icon-zanting' : 'icon-bofang'"
          @tap="changePlayState"></i>
        <i class="iconfont icon-xiayigexiayishou" @tap="audioStore.next()"></i>
        <i class="iconfont icon-24gf-playlist" @tap.stop="changePopupState"></i>
      </view>
    </view>
  </view>
  <Popup ref="popup" :popupShow="popupShow" />
  <Toast ref="toast" />
</template>

<script setup lang='ts'>
import { ref, computed, getCurrentInstance, watch } from 'vue'
import { usePlayListStore } from "@/store/playList"
import { useAudioStore } from "@/store/audio"
import formatSeconds from "@/util/formatSeconds";
import { onLoad } from "@dcloudio/uni-app"
import Toast from "@/components/Toast.vue"
import Popup from '@/components/Popup.vue'

const playListStore = usePlayListStore()
const audioStore = useAudioStore()

const popupShow = ref(false)
const popup = ref()
const toast = ref()
const dotInitPos = ref(0)
const progressWidth = ref(0)
const lyricHeight = ref('')
const lyricHeightTemp = ref(0)
const pageHeight = ref('')
const pageHeightTemp = ref(0)
const offsetTime = ref(0)
const initPercentage = ref(0)
const offestPercentage = ref(0)
const isDotTouch = ref(false)
const showLyric = ref(false)
const scrollTop = ref(0)
let nodeRef: any

const playing = computed(() => {
  return playListStore.playing[0]
})

const album = computed(() => {
  return playListStore.playing[0].al || playListStore.playing[0].album
})

const artists = computed(() => {
  return playListStore.playing[0].ar || playListStore.playing[0].artists
})

const alias = computed(() => {
  return playListStore.playing[0].alia || playListStore.playing[0].alias
})

onLoad(() => {
  nodeRef = uni.createSelectorQuery().in(getCurrentInstance())
  uni.getSystemInfo({
    success: (res) => {
      pageHeightTemp.value = res.windowHeight
      pageHeight.value = pageHeightTemp.value + 'px'
    }
  })
  uni.createSelectorQuery().in(getCurrentInstance()).select(".radio-control--progress").boundingClientRect().exec((data: any) => {
    progressWidth.value = data[0].width
  })
  uni.createSelectorQuery().in(getCurrentInstance()).select(".play-audio-head").boundingClientRect().exec((data: any) => {
    lyricHeightTemp.value = pageHeightTemp.value - data[0].height
  })
  uni.createSelectorQuery().in(getCurrentInstance()).select(".play-radio-control").boundingClientRect().exec((data: any) => {
    lyricHeightTemp.value = lyricHeightTemp.value - data[0].height
    lyricHeight.value = lyricHeightTemp.value + 'px'
  })
})

watch(() => audioStore.currentTime, (newVal, oldVal) => {
  if (showLyric.value) {
    playListStore.lyric.map((item) => {
      if (item.time && item.time !== "" && item.time <= formatSeconds(newVal).slice(3, 11) && formatSeconds(newVal).slice(3, 11) < item.prevTime) {
        scrollTop.value = item.scrollTop - lyricHeightTemp.value / 2
      }
    })
  }
})

watch(() => playListStore.lyric, (newVal, oldVal) => {
  if (showLyric.value) {
    setTimeout(() => {
      nodeRef.selectAll(".lyric").boundingClientRect().exec((data: any) => {
        data[0].map((item: { top: number }, idx: number) => newVal[idx].scrollTop = item.top)
      })
    }, 0);
  }
  scrollTop.value = 0
})

const handleShowLyric = () => {
  showLyric.value = !showLyric.value
  if (showLyric.value) {
    setTimeout(() => {
      nodeRef.selectAll(".lyric").boundingClientRect().exec((data: any) => {
        data[0].map((item: { top: number }, idx: number) => playListStore.lyric[idx].scrollTop = item.top)
      })
    }, 0);
  }
}

const changePlayState = (): void => {
  audioStore.isOnPlay ? audioStore.pauseAudio() : audioStore.playAudio()
}

const changePopupState = (): void => {
  popup.value.show = true
}

const handelePlayModeClick = (): void => {
  audioStore.changePlayMode()
  toast.value.$refs.uToast.show({
    message: audioStore.playMode.message,
    duration: 200
  })
}

const handleDotTouchStart = (e: any): void => {
  dotInitPos.value = e.changedTouches[0].pageX
  initPercentage.value = audioStore.percentage
  isDotTouch.value = true
}

const handleDotTouchMove = (e: any): void => {
  offsetTime.value = (e.changedTouches[0].pageX - dotInitPos.value) / progressWidth.value * audioStore.duration
  offestPercentage.value = (e.changedTouches[0].pageX - dotInitPos.value) / progressWidth.value * 100 + initPercentage.value
  audioStore.setSeek(audioStore.currentTime + offsetTime.value)
}

const handleDotTouchEnd = (): void => {
  offestPercentage.value = 0
  isDotTouch.value = false
}
</script>

<style lang="scss" scoped>
.play-audio-bg {
  position: fixed;
  width: 100vw;
  height: v-bind(pageHeight);
  background-color: rgba(0, 0, 0, .3);
  background-position: 50% 40%;
  background-size: 200%;
  filter: blur(30px);
  transform: scale(1.2);
}

.play-audio {
  position: relative;
  width: 100vw;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;

  .play-audio-head {
    padding: 0 20%;

    .audio-head--ar {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .play-audio-record {
    width: 100%;
    margin-top: 10px;

    .play-radio-lyric {
      width: 100%;
      height: v-bind(lyricHeight);
      padding: 10px;
      box-sizing: border-box;

      .lyric {
        padding: 10px;
        color: #fff;
        font-size: 12px;
        text-align: center;
        opacity: .3;
      }

      .curr-lyric {
        font-size: 14px;
        opacity: 1;
      }

      //逐字歌词染色效果

      // .curr-lyric-bg {
      //   position: absolute;
      //   top: 0;
      //   background: linear-gradient(to right, #fff, #fff) no-repeat 0 0;
      //   background-clip: text;
      //   color: transparent;
      //   animation: fill_text 5s linear infinite;
      // }

      // @keyframes fill_text {
      //   0% {
      //     background-size: 0 100%
      //   }

      //   100% {
      //     background-size: 100% 100%
      //   }
      // }
    }

    .play-radio-disc {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .audio-record--styli {
        width: 76px;
        height: 124px;
        background-color: aqua;
        background: url("@/static/images/needle-ab.png") no-repeat;
        background-size: 100%;
        transform-origin: 11px 11px;
        transform: translateX(50%) rotate(-30deg);
        margin-left: -20px;
        transition: transform .4s linear;
        z-index: 1;
      }

      .record-styli--rotate {
        transform: translateX(50%) rotate(0);
      }

      .audio-record--record {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200px;
        height: 200px;
        background: url("@/static/images/turntable.png") no-repeat;
        background-size: 100%;
        border-radius: 50%;
        transform: translateY(-56px);

        .record-cover {
          width: 120px;
          height: 120px;
          background-size: 100%;
          border-radius: 50%;
          animation: cover_rotate 12s linear infinite;
        }

        @keyframes cover_rotate {
          0% {
            transform: rotate(0);
          }

          100% {
            transform: rotate(360deg);
          }
        }

        .record-cover--rotate {
          transform: rotate(360deg);
        }
      }

    }

  }

  .play-radio-control {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 0;
    left: 10px;
    width: calc(100% - 20px);
    padding: 20px 0;
    color: #fff;
    box-sizing: border-box;

    .radio-control-time {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      font-size: 10px;
      color: rgba(255, 255, 255, .6);

      .radio-control--progress {
        width: 78vw;

        ::v-deep .u-line-progress {
          overflow: visible;
        }

        .progress-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #fff;
        }

        .progress-dot--touched {
          width: 10px;
          height: 10px;
        }
      }
    }

    .radio-control--btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10%;

      .control-play {
        font-size: 40px !important;
      }
    }

  }
}
</style>
