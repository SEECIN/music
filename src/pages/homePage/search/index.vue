<template>
  <u-search disabled :show-action="false" bgColor="#fff" placeholder="歌手、歌曲、歌单......" @tap="focus"></u-search>
</template>

<script setup lang='ts'>

const focus = () => {
  uni.$u.route('pages/search/index')
}
</script>

<style lang="scss" scoped>
</style>
