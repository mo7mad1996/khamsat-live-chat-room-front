import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

// views || Pages
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ChatView from "@/views/ChatView.vue";
import GroupChatView from "@/views/GroupChatView.vue";

const routes = [
  { path: "/login", name: "login", component: LoginView },
  { path: "/register", name: "register", component: RegisterView },
  {
    path: "/",
    name: "home",
    component: HomeView,
    children: [
      {
        path: "chat/:id",
        component: ChatView,
        name: "chat",
      },
      {
        path: "group/:id",
        component: GroupChatView,
        name: "groupChat",
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.checkAuth(); // Check authentication state

  const isAuthenticated = authStore.isAuthenticated;
  if (to.name !== "login" && to.name !== "register" && !isAuthenticated)
    next({ name: "login" });
  else next();
});

export default router;
