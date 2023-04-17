<template>
  <view class="playList">
    <span class="playList-playCount " :style="{
      backgroundImage: addCountBackground ? `url(${playListData.coverImgUrl || playListData.picUrl})` : ''
    }" :class="{ addBackground: addCountBackground }">
      <u-icon name="play-right-fill" color="#fff" size="10"></u-icon>
      {{ bigNumberTransform(playListData.playCount) }}
    </span>
    <image class="playList-img" :src="playListData.coverImgUrl || playListData.picUrl"></image>
    <u-icon v-if="needPlayBtn" class="playList-play" name="play-right-fill" color="#fff" :size="iconSize || 16"></u-icon>
  </view>
</template>

<script setup lang='ts'>
import { defineProps } from 'vue'
import type { playListType } from '@/config/interface.d'
import bigNumberTransform from "@/util/formatNumber"
withDefaults(defineProps<{
  playListData: playListType,
  width?: string,
  height?: string,
  iconSize?: number,
  addCountBackground?: boolean,
  boxShadowColor?: string,
  needPlayBtn?: boolean
}>(), {
  width: "100px",
  height: "100px",
  iconSize: 16,
  addCountBackground: true,
  boxShadowColor: '#EBECF0',
  needPlayBtn: true
}) 
</script>

<style lang="scss" scoped>
.playList {
  position: relative;

  .playList-playCount {
    display: flex;
    align-items: center;
    position: absolute;
    top: 16px;
    right: 10px;
    padding: 2px 5px;
    color: #f9f9f9;
    font-size: 10px;
  }

  .addBackground {
    background-position: center 10%;
    background-size: 20000%;
    border-radius: 10px;
  }

  .playList-img {
    width: v-bind(width);
    height: v-bind(height);
    margin: 20rpx 10rpx 0;
    border-radius: 20rpx;
    box-shadow: 0 -20rpx 0 -10rpx v-bind(boxShadowColor);
  }

  .playList-play {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
}
</style>
