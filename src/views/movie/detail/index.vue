<!--
    影片详情页
    
    Created by CuiXg on 2026/05/23.
    Copyright ©2026追光剧场. All rights reserved.
-->
<template>
  <div class="content">
    <van-sticky>
      <van-nav-bar
        :title="movieDetail?.name"
        left-arrow
        @click-left="back"
        class="nav-bar"
      />
    </van-sticky>
    <van-swipe
      ref="playerSwipeRef"
      class="play-info"
      :show-indicators="false"
      vertical
      :loop="false"
      lazy-render
      @change="playListChange"
    >
      <van-swipe-item
        v-for="(item, index) in chapterList"
        :key="index"
        class="play-info-item"
      >
        <movie-player
          :src="item.url"
          :poster="movieDetail.cover"
          @completed="playNextMovie"
          @error="playError"
          @init-completed="
            (player) => {
              childPlayerInitCompleted(index, player);
            }
          "
        />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import moviePlayer from "@/components/movie/movie-player.vue";
import movieCrawler from "@/utils/crawler/movie";
import router from "@/router";
import { showToast } from "vant";

const playerSwipeRef = ref();
const movieDetail = ref();
const chapterList = ref<Array<Record<string, any>>>([]);

onMounted(() => {
  const path = router.currentRoute.value.query.path?.toString();
  if (path) {
    movieCrawler
      .crawlDetail(path)
      .then((info) => {
        movieDetail.value = info;
        chapterList.value = info.videos;
      })
      .catch((err) => {
        showToast(err.message);
      });
  }
});

function back() {
  router.back();
}

function playListChange(index: number) {
  for (let i = 0; i < chapterList.value.length; i++) {
    const chapterInfo = chapterList.value[i];
    if (index == i) {
      chapterInfo.player?.play();
    } else {
      chapterInfo.player?.pause();
    }
  }
}

function childPlayerInitCompleted(index: number, player: any) {
  let chapterInfo = chapterList.value[index];
  chapterInfo.player = player;
  chapterList.value[index] = chapterInfo;
}

function playNextMovie() {
  playerSwipeRef.value.next();
}

function playError() {
  showToast("视频加载失败,即将播放下一视频");
  setTimeout(() => {
    playerSwipeRef.value.next();
  }, 3000);
}
</script>

<style lang="scss" scoped>
.content {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: env(safe-area-inset-bottom);
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  -ms-overflow-style: none; /* IE 和 Edge */
  scrollbar-width: none; /* Firefox */
}

/* 隐藏滚动条 */
.content::-webkit-scrollbar {
  display: none; /* 对于 Webkit 浏览器 */
}

.play-info {
  flex-grow: 1;
}

.play-info-item {
  height: 100%;
}
</style>
