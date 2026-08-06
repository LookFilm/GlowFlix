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
      v-model:refreshing="refreshing"
      v-model:loading="loading"
      :has-more-data="hasMoreData"
      :is-empty="categoryList.length === 0"
      @refresh="handleRefresh"
      @load-more="handleLoadMore"
    >
      <div class="video-list">
        <movie-item
          :movie-item="item"
          v-for="(item, index) in categoryList"
          :key="index"
          class="video-list-item"
          @to-detail="toMovieDetail(item.path)"
        ></movie-item>
      </div>
    </pull-refresh-list>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import movieCrawler from "@/utils/crawler/movie";
import router from "@/router";

const groupList = ref<Array<Record<string, any>>>([]);
const typeList = ref<Array<Record<string, any>>>([]);
const categoryList = ref<Array<Record<string, any>>>([]);
const activeType = ref<string | number>("home");
const refreshing = ref(false);
const loading = ref(false);
const hasMoreData = ref(true);
const currentPage = ref(1);

onMounted(() => {
  Promise.all([movieCrawler.crawlIndex(), movieCrawler.crawlTypeList()]).then(
    ([indexInfo, typeInfo]) => {
      groupList.value = indexInfo;
      typeList.value = typeInfo;
    }
  );
});

watch(activeType, (newType) => {
  if (newType === "home") {
    return;
  }

  currentPage.value = 1;
  hasMoreData.value = true;
  categoryList.value = [];
  loading.value = false;
  refreshing.value = false;
  loadCategoryList(true);
});

async function loadCategoryList(reset = false) {
  if (activeType.value === "home") {
    return;
  }

  const page = reset ? 1 : currentPage.value;
  try {
    const info = await movieCrawler.crawlListByType(Number(activeType.value), page);
    const list = Array.isArray(info?.list) ? info.list : [];

    if (reset) {
      categoryList.value = list;
    } else {
      categoryList.value = [...categoryList.value, ...list];
    }

    hasMoreData.value = parseInt(info.page) < parseInt(info.totalPage);
    currentPage.value = reset ? 2 : page + 1;
  } catch (error) {
    hasMoreData.value = false;
    // categoryList.value = [];
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
}

function handleRefresh() {
  loadCategoryList(true);
}

function handleLoadMore() {
  if (!hasMoreData.value) {
    loading.value = false;
    return;
  }
  loadCategoryList(false);
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
