import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "Home" */ "../views/Home.vue"),
  },
  {
    path: "/calc",
    name: "Calc",
    component: () => import(/* webpackChunkName: "Home" */ "../views/Calc.vue"),
  },
  {
    path: "/funds",
    name: "Funds",
    component: () => import(/* webpackChunkName: "Home" */ "../views/Funds.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
