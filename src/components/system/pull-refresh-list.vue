<!--
    下拉刷新列表
    
    Created by CuiXg on 2025/05/29.
    Copyright ©2026追光剧场. All rights reserved.
-->
<template>
  <div>
    <slot name="header"></slot>
    <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="isLoading"
        :finished="!hasMoreData"
        :finished-text="
          isEmpty || isRefreshing || isLoading ? '' : '没有更多内容'
        "
        @load="onLoadMore"
      >
        <slot v-if="!isEmpty"></slot>
        <van-empty v-if="isEmpty" description="暂无内容" />
      </van-list>
    </van-pull-refresh>
    <slot name="footer"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  refreshing: {
    type: Boolean,
    default: false,
  },

  loading: {
    type: Boolean,
    default: false,
  },

  hasMoreData: {
    type: Boolean,
    default: false,
  },
  isEmpty: {
    type: Boolean,
    default: false,
  },
});

const isRefreshing = ref(false);
const isLoading = ref(false);

watch(
  [() => props.refreshing, () => props.loading],
  ([refresh, loading]) => {
    if (isRefreshing.value != refresh) {
      isRefreshing.value = refresh;
      if (refresh) {
        onRefresh();
      }
    }
    if (isLoading.value != loading) {
      isLoading.value = loading;
      if (loading) {
        onLoadMore();
      }
    }
  },
  { immediate: true },
);

const emit = defineEmits([
  "refresh",
  "loadMore",
  "update:refreshing",
  "update:loading",
]);

function onRefresh() {
  emit("update:refreshing", true);
  emit("refresh");
}

function onLoadMore() {
  emit("update:loading", true);
  emit("loadMore");
}
</script>

<style lang="scss" scoped></style>
