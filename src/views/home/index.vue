<!--
    首页
    
    Created by CuiXg on 2026/07/25.
    Copyright ©2026追光剧场. All rights reserved.
-->
<template>
  <div>
    <div v-for="(groupItem, groupIndex) in groupList" :key="groupIndex">
      <div class="group-title">{{ groupItem.title }}</div>
      <div class="video-list">
        <movie-item
          :movie-item="item"
          v-for="(item, index) in groupItem.list"
          :key="index"
          class="video-list-item"
          @to-detail="toMovieDetail(item.path)"
        ></movie-item>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import movieCrawler from "@/utils/crawler/movie";
import router from "@/router";

const groupList = ref<Array<Record<string, any>>>([]);
onMounted(() => {
  movieCrawler.crawlIndex().then((info) => {
    groupList.value = info;
  });
});

function toMovieDetail(path: string) {
  router.push({
    name: "MovieDetail",
    query: { path: path },
  });
}
</script>

<style lang="scss" scoped>
.group-title {
  margin: 16px 16px 0 16px;
  font-weight: 700;
  font-size: 18px;
  color: #101010;
}

.video-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px 15px;
  &-item {
    width: calc(50% - 5px);
    margin: 5px 0;
  }
}
</style>
