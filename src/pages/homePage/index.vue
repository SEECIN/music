<template>
  <view class="content">
    <Search class="search" :class="{ 'change-color': addSearchBackGround }" />
    <Banner class="banner" :style="{ backgroundImage: `url(${imageUrl})` }" @changeBackGround="changeBackGround" />
    <Ball class="ball" />
    <Recommend class="recommend" />
    <NewSong class="newSong" />
    <TopList class="topList" />
    <PlayBar class="playbar" v-if="playListStore.playing.length > 0" />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onPageScroll } from "@dcloudio/uni-app"
import Search from "@/pages/homePage/search/index.vue"
import Banner from "@/pages/homePage/banner/index.vue"
import Ball from "@/pages/homePage/ball/index.vue"
import NewSong from "@/pages/homePage/newSong/index.vue"
import Recommend from "@/pages/homePage/recommend/index.vue"
import TopList from "@/pages/homePage/topList/index.vue"
import PlayBar from '@/components/PlayBar.vue'
import { usePlayListStore } from "@/store/playList"

const playListStore = usePlayListStore()

const imageUrl = ref<string>("")
const addSearchBackGround = ref(false)

const changeBackGround = (url: string): void => {
  imageUrl.value = url
}

onPageScroll((e): void => {
  e.scrollTop >= 140 ? addSearchBackGround.value = true : addSearchBackGround.value = false
})
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  background-color: #F8F9FD;

  .search {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
    transition: all .3s;

    ::v-deep .u-search {
      padding: 10px;
    }
  }

  .change-color {
    background-color: #F8F9FD;
  }

  .banner {
    box-sizing: border-box;
    width: 100%;
    padding: 54px 20px 10px;
    background-position: 10% top;
    background-size: 20000%;
  }

  .ball {
    width: 100%;
    padding-top: 10px;
  }

  .recommend {
    width: 100%;
    padding: 10px 0 10px 10px;
    box-sizing: border-box;
    border-top: 1px solid #ccc;
  }

  .newSong {
    width: 100%;
    padding: 10px 0 0 10px;
    box-sizing: border-box;
    border-top: 1px solid #ccc;
  }

  .topList {
    width: 100%;
    padding-top: 10px;
    box-sizing: border-box;
    border-top: 1px solid #ccc;
  }

  .playbar {
    width: 100%;
    height: 40px;
  }
}
</style>
