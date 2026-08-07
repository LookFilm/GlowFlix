<!--
    首页
    
    Created by CuiXg on 2026/07/25.
    Copyright ©2026追光剧场. All rights reserved.
-->
<template>
  <div class="home-page">
    <van-tabs
      v-model:active="activeType"
      color="#6C47FF"
      title-active-color="#6C47FF"
      class="type-tabs"
      @change="typeChange"
    >
      <van-tab name="home" title="首页" />
      <van-tab
        v-for="typeItem in typeList"
        :key="typeItem.id"
        :name="typeItem.id"
        :title="typeItem.title"
      />
    </van-tabs>

    <div v-if="activeType === 'home'">
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

    <pull-refresh-list
      v-else
      v-model:refreshing="isRefreshing"
      v-model:loading="isLoading"
      :has-more-data="isHasMoreData"
      :is-empty="isEmpty"
      @refresh="refreshList"
      @load-more="loadMore"
      class="video-list-container"
    >
      <div class="video-list">
        <movie-item
          :movie-item="item"
          v-for="(item, index) in movieList"
          :key="index"
          class="video-list-item"
          @to-detail="toMovieDetail(item.path)"
        ></movie-item>
      </div>
    </pull-refresh-list>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import movieCrawler from "@/utils/crawler/movie";
import router from "@/router";
import PullRefreshList from "@/components/system/pull-refresh-list.vue";

const groupList = ref<Array<Record<string, any>>>([]);
const typeList = ref<Array<Record<string, any>>>([]);
const activeType = ref<string | number>("home");

const isRefreshing = ref(false);
const isLoading = ref(false);
const isHasMoreData = ref(true);
const isEmpty = ref(false);
var pageNo = 1;
const movieList = ref<Array<Record<string, any>>>([]);

onMounted(() => {
  Promise.all([movieCrawler.crawlIndex(), movieCrawler.crawlTypeList()]).then(
    ([indexInfo, typeInfo]) => {
      groupList.value = indexInfo;
      typeList.value = typeInfo;
    }
  );
});

function typeChange(name: string | number, title: string) {
  if (name !== "home") {
    isRefreshing.value = true;
    isEmpty.value = false;
    isHasMoreData.value = true;
  }
}

function refreshList() {
  movieList.value = [];
  movieCrawler
    .crawlListByType(Number(activeType.value), 1)
    .then((pageInfo) => {
      pageNo = parseInt(pageInfo.page);
      movieList.value = pageInfo.list;
      isRefreshing.value = false;
      isEmpty.value = pageInfo.count == 0;
      isHasMoreData.value = parseInt(pageInfo.page) < parseInt(pageInfo.pageCount);
    })
    .catch(() => {
      isRefreshing.value = false;
    });
}

function loadMore() {
  movieCrawler
    .crawlListByType(Number(activeType.value), pageNo + 1)
    .then((pageInfo) => {
      pageNo = parseInt(pageInfo.page);
      movieList.value = movieList.value.concat(pageInfo.list);
      isLoading.value = false;
      isEmpty.value = pageInfo.total == 0;
      isHasMoreData.value = parseInt(pageInfo.page) < parseInt(pageInfo.totalPage);
    })
    .catch(() => {
      isLoading.value = false;
    });
}

function toMovieDetail(path: string) {
  router.push({
    name: "MovieDetail",
    query: { path: path },
  });
}
</script>

<style lang="scss" scoped>
.home-page {
  padding-bottom: 16px;
  background-color: #f5f5f5;
}

.type-tabs {
  margin: 8px 0 0;
}

.group-title {
  margin: 16px 16px 0 16px;
  font-weight: 700;
  font-size: 18px;
  color: #101010;
}

.video-list-container {
  min-height: calc(100vh - 50px);
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
