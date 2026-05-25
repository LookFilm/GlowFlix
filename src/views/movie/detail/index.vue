<!--
    影片详情页
    
    Created by CuiXg on 2026/05/23.
    Copyright ©2025深圳幸福社掌上科技有限公司. All rights reserved.
-->
<template>
  <div class="content">
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
          :src="item.playUrl"
          :poster="movieDetail.cover"
          @play-completed="playNextMovie"
          @player-init-completed="
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
import movieApi from "@/api/movieApi";
import moviePlayer from "@/components/movie/movie-player.vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const playerSwipeRef = ref();
const movieDetail = ref();
const chapterList = ref<Array<Record<string, any>>>([]);

let staticDomian = import.meta.env.VITE_STATIC_DOMAIN;
let videoDomian = import.meta.env.VITE_VIDEO_DOMAIN;

onMounted(() => {
  movieApi.getMovieInfo(props.id).then((detail) => {
    let info = detail.info;
    info.cover = staticDomian + info.cover;
    movieDetail.value = info;
    chapterList.value = detail.info.setList.map((item: Record<string, any>) => {
      return { id: item.i, playUrl: "" };
    });
    getChapterPlayInfo(0);
  });
});

function getChapterPlayInfo(index: number) {
  return new Promise<void>((resolve, reject) => {
    if (!chapterList.value) {
      reject();
      return;
    }
    if (0 > index && index >= chapterList.value.length) {
      reject();
      return;
    }

    let chapterInfo = chapterList.value[index];
    if (chapterInfo.playUrl) {
      resolve();
    } else {
      movieApi
        .getChapterPlayInfo(props.id, chapterInfo.id)
        .then((playInfo) => {
          chapterInfo.playUrl = videoDomian + playInfo.info.url_m3u8;
          chapterList.value[index] = chapterInfo;
          resolve();
        })
        .catch(() => {
          reject();
        });
    }
  });
}

function playListChange(index: number) {
  getChapterPlayInfo(index).then(() => {
    for (let i = 0; i < chapterList.value.length; i++) {
      const chapterInfo = chapterList.value[i];
      if (index == i) {
        chapterInfo.player?.play();
      } else {
        chapterInfo.player?.pause();
      }
    }
  });
}

function childPlayerInitCompleted(index: number, player: any) {
  let chapterInfo = chapterList.value[index];
  chapterInfo.player = player;
  chapterList.value[index] = chapterInfo;
}

function playNextMovie() {
  playerSwipeRef.value.next();
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
}

.play-info {
  height: 100%;
}

.play-info-item {
  height: 100%;
}
</style>
