import { createRouter, createWebHistory } from "vue-router";
import Ranking from "@/components/ranking.vue";
import Login from "@/components/login.vue";

const routes = [
  { path: "/", redirect: "/login" }, // Redirect to login
  { path: "/login", component: Login }, // Login page
  { path: "/ranking", component: Ranking }, // Ranking page
];

const router = createRouter({
  history: createWebHistory(), // Use HTML5 history mode
  routes,
});

export default router;
