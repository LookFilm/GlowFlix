export default [
  {
    path: "detail/:href",
    name: "MovieDetail",
    props: true,
    meta: {
      title: "影片详情",
    },
    component: () => import("@/views/movie/detail/index.vue"),
  },
];
