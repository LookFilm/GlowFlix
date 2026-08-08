<!--
    播放器
    
    Created by CuiXg on 2026/05/24.
    Copyright ©2026追光剧场. All rights reserved.
-->
<template>
  <div class="video-container">
    <video ref="videoRef" playsinline class="video" :src="src" :poster="poster"></video>
    <div v-show="isShowLoading" class="loading-overlay">
      <van-loading type="spinner" vertical> 加载中... </van-loading>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import "plyr/dist/plyr.css";
import Plyr from "plyr";

const emit = defineEmits(["initCompleted", "completed", "error"]);

const props = defineProps({
  src: { type: String, required: true },
  poster: { type: String, default: "" },
});

const isShowLoading = ref(false);
const videoRef = ref(null);

let player: any = null;

onMounted(() => {
  initPlayer();
});

onBeforeUnmount(() => {
  if (player) {
    player.destroy();
    player = null;
  }
});

function initPlayer() {
  if (!videoRef.value) return;

  const playerConfig = {
    controls: [
      "play-large",
      "play",
      "progress",
      "current-time",
      "mute",
      "airplay",
      "fullscreen",
      "pip",
    ],
    autoplay: true,
  };

  player = new Plyr(videoRef.value, playerConfig);
  player.on("ended", (event: any) => {
    // 播放完成
    emit("completed");
  });
  player.on("loadstart", (event: any) => {
    // 加载开始
    isShowLoading.value = true;
  });
  player.on("canplay", (event: any) => {
    // 可播放
    isShowLoading.value = false;
  });
  player.on("error", (event: any) => {
    emit("error");
  });
  emit("initCompleted", player);
}
</script>

<style lang="scss" scoped>
.video-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #000;
  overflow: hidden;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000000ba;
}

:deep(.plyr) {
  height: 100%;
}
</style>
