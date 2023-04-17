<template>
  <u-scroll-list indicatorColor="#F7ECF0" indicatorActiveColor="#FD8284">
    <view class="ballList-item" v-for="item in ballList" :key="item.id">
      <view class="ballList-item--content">
        <u-icon class="ballList-item--icon" :name="item.iconUrl"></u-icon>
        <text color="#676D7D" class="ballList-item--text">{{ item.name }}</text>
      </view>
    </view>
  </u-scroll-list>
</template>

<script setup lang='ts'>
import { ref, inject } from 'vue'
import { onLoad } from "@dcloudio/uni-app"
import type { ballListType } from '@/config/interface.d'

const http = inject("$http") as Function

const ballList = ref<ballListType[]>([])

onLoad(() => {
  getBallList()
})

const getBallList = async () => {
  const result = await http({ requestName: "getBallList" })
  ballList.value.push(...result.data)
}
</script>

<style lang="scss" scoped>
.ballList-item {
  width: 50px !important;
  padding: 0 10px;
  box-sizing: content-box;

  .ballList-item--icon {
    position: relative;
  }

  .ballList-item--content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50px;

    // #FF235F   #FD8284   #F7ECF0

    .ballList-item--text {
      font-size: 10px;
      white-space: nowrap;
      color: #606266;
    }
  }

}
</style>
