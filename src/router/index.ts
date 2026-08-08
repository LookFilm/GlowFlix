import {  createMemoryHistory, createRouter, createWebHistory } from "vue-router";
import movieRouter from "@/router/modules/movie";
import HomeView from "@/views/home/index.vue";

declare module "vue-router" {
  /**
   * 自定义路由元信息
   */
  interface RouteMeta {
    // 导航标题
    title: string;

    keepAlive?: boolean;
  }
}

const routes = [
  { path: "/", meta: { title: "追光剧场", keepAlive: true }, component: HomeView },
  {
    path: "/movie",
    name: "Movie",
    children: movieRouter,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { left: 0, top: 0 };
    }
  }
});

router.beforeEach((to, _, next) => {
  const title = to.meta.title !== undefined ? to.meta.title : "";
  // 设置当前页面/文档的标题
  document.title = title;
  next();
});

export default router;
