<!--
    首页
    
    Created by CuiXg on 2026/05/23.
    Copyright ©2025深圳幸福社掌上科技有限公司. All rights reserved.
-->
<template>
  <div>
    <van-tabs v-model:active="tagActive" sticky shrink @click-tab="tagClickTab">
      <van-tab
        :title="item.t"
        :name="item.id"
        v-for="(item, index) in tagsList"
        :key="index"
      />
    </van-tabs>
    <pull-refresh-list
      class="pull-refresh-list"
      :is-empty="isEmpty"
      v-model:refreshing="isRefreshing"
      v-model:loading="isLoading"
      :has-more-data="isHasMoreData"
      @refresh="refreshList"
      @load-more="loadMore"
    >
      <div class="video-list">
        <movie-item
          :movie-item="item"
          v-for="(item, index) in recordList"
          :key="index"
          class="video-list-item"
          @to-detail="toMovieDetail"
        ></movie-item>
      </div>
    </pull-refresh-list>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import homeApi from "@/api/homeApi";
import PullRefreshList from "@/components/system/pull-refresh-list.vue";
import MovieItem from "@/components/home/movie-item.vue";
import router from "@/router";

const tagActive = ref(0);
const tagsList = ref();
var tagActiveId = "";

const isRefreshing = ref(false);
const isLoading = ref(false);
const isHasMoreData = ref(false);
const isEmpty = ref(false);
const recordList = ref<Array<Record<string, any>>>([]);
var pageNo = 1;

let staticDomian = import.meta.env.VITE_STATIC_DOMAIN;

onMounted(() => {
  homeApi.getConfig().then((result) => {
    console.log(result.config.tags);

    tagsList.value = [{ id: "0", t: "全部", s: "1" }].concat(
      result.config.tags,
    );
  });
  isRefreshing.value = true;
});

function tagClickTab(sender: Record<string, any>) {
  tagActiveId = sender.name;
  isRefreshing.value = true;
}

function refreshList() {
  pageNo = 1;
  homeApi.getVideoList(1, "hot", tagActiveId).then((pageInfo) => {
    recordList.value = pageInfo.list.map((item) => {
      item.cover = staticDomian + item.cover;
      return item;
    });
    isRefreshing.value = false;
    isEmpty.value = pageInfo.total == 0;
    isHasMoreData.value = pageInfo.hasMore;
  });
}
function loadMore() {
  pageNo = pageNo + 1;
  homeApi.getVideoList(pageNo, "hot", tagActiveId).then((pageInfo) => {
    let list = pageInfo.list.map((item) => {
      item.cover = staticDomian + item.cover;
      return item;
    });
    recordList.value = recordList.value.concat(list);
    isLoading.value = false;
    isEmpty.value = pageInfo.total == 0;
    isHasMoreData.value = pageInfo.hasMore;
  });
}

function toMovieDetail(id: string) {
  router.push({
    name: "MovieDetail",
    query: { id: id },
    params: { id: id },
  });
}
</script>

<style lang="scss" scoped>
.video-list {
  min-height: calc(100vh - 44px);
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
