<!--
    电影
    
    Created by CuiXg on 2026/05/23.
    Copyright ©2025深圳幸福社掌上科技有限公司. All rights reserved.
-->
<template>
  <div class="content" @click.stop="toMovieDetail">
    <img :src="movieItem.cover" class="cover" />
    <div class="introduce">
      <div class="title">{{ movieItem.title }}</div>
      <div class="summary">{{ movieItem.summary }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  movieItem: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["toDetail"]);

function toMovieDetail() {
  emit("toDetail", props.movieItem.id);
}
</script>

<style lang="scss" scoped>
.content {
  background-color: #eee;
  border-radius: 10px;
  overflow: hidden;
}

.cover {
  width: 100%;
  object-fit: fill;
  aspect-ratio: 5 / 6;
  background-color: #1c1c1e;
  display: block;
}

.introduce {
  padding: 10px;
}

.title {
  color: #333;
  font-weight: 600;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.summary {
  margin-top: 8px;
  color: #666;
  font-size: 14px;
  line-height: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
