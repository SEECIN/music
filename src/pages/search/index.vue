<template>
  <view class="search-page">
    <u-sticky bgColor="#fff"><u-search v-model="searchVal" @search="handleSearch" @custom="handleSearch"
        placeholder="歌手、歌曲、歌单......" borderColor="#ececec" bgColor="#fff" :show-action="true"
        actionText="搜索"></u-search></u-sticky>
    <view class="hot-search">
      <view class="hot-search-title">
        <u-text size="14px" color="#2A3249" bold text="热搜榜"></u-text>
      </view>
      <view class="hot-search-list">
        <view class="hot-search--item" v-for="item, idx in hotSearchList" :key="idx"
          @tap="(e: any) => { handleHotSearchClick(item.searchWord) }">
          <i v-if="idx <= 2" class="search-item--index font-color-theme">{{ idx + 1 }}</i>
          <u-text v-if="idx <= 2" class="search-item--name" size="10px" color="#2A3249" bold
            :text="item.searchWord"></u-text>
          <i v-if="idx > 2" class="search-item--index">{{ idx + 1 }}</i>
          <u-text v-if="idx > 2" class="search-item--name" size="10px" color="#2A3249" :text="item.searchWord"></u-text>
          <u-icon class="search-item--icon" top=".8px" v-if="item.iconUrl" bold :name="item.iconUrl" color="#3F475B"
            :size="12"></u-icon>
          <u-text class="search-item--detail" size="8px" color="#2A3249" :text="item.content"></u-text>
        </view>
      </view>
    </view>
    <PlayBar class="playbar" v-if="playListStore.playing.length > 0" />
  </view>
</template>

<script setup lang='ts'>
import { ref, inject } from 'vue'
import { onLoad } from "@dcloudio/uni-app"
import type { hotSearchListType } from '@/config/interface.d'
import PlayBar from '@/components/PlayBar.vue'
import { usePlayListStore } from "@/store/playList"

const playListStore = usePlayListStore()
const http = inject("$http") as Function

const searchVal = ref("")
const hotSearchList = ref<hotSearchListType[]>([])

onLoad(() => {
  getHotSearchList()
})

const handleSearch = () => {
  if (searchVal.value.length === 0) return false
  uni.$u.route('pages/searchResult/index', {
    searchVal: searchVal.value
  })
}

const handleHotSearchClick = (searchWord: string): void => {
  uni.$u.route('pages/searchResult/index', {
    searchVal: searchWord
  })
}

const getHotSearchList = async () => {
  const result = await http({ requestName: "getHotSearchList" })
  hotSearchList.value = result.data
}

</script>

<style lang="scss" scoped>
.search-page {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: #F7F8FC;
  overflow: auto;

  .playbar {
    width: 100%;
    height: 40px;
  }

  .hot-search {
    margin: 14px;
    padding: 10px;
    background-color: #fff;
    border-radius: 8px;

    .hot-search-title {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .hot-search--item {
      display: flex;
      align-items: center;
      padding: 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      .font-color-theme {
        color: #FE3A39
      }

      .search-item--index {
        font-size: 10px;
        font-style: normal;
        margin-right: 14px;
      }

      .search-item--icon {
        margin-left: 6px;
      }

      .search-item--detail {
        margin-left: 20px;
      }
    }
  }
}
</style>
