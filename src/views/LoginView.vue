<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useContentStore } from "@/stores/contentStore";

// config
const authStore = useAuthStore();
const contentStore = useContentStore();
const router = useRouter();

// data
const user = reactive({ email: "", password: "" });
const loading = ref(false);

// methods
const handleLogin = () => {
  loading.value = true;
  authStore.login(
    user,
    () => router.push({ name: "home" }),
    () => (loading.value = false)
  );
};
</script>

<template>
  <div class="container">
    <h2 class="page-title">{{ contentStore.content.login }}</h2>
    <form @submit.prevent="handleLogin">
      <div class="input">
        <label for="email">{{ contentStore.content.email }}</label>
        <input v-model="user.email" required />
      </div>
      <div class="input">
        <label for="email">{{ contentStore.content.password }}</label>
        <input type="password" v-model="user.password" required />
      </div>
      <button type="submit" :disabled="loading">
        <span v-if="loading">
          {{ contentStore.content.loading }}
          <font-awesome-icon :icon="['fas', 'spinner']" spin-pulse />
        </span>
        <span v-else>
          {{ contentStore.content.login }}
          <font-awesome-icon :icon="['fas', 'arrow-right-to-bracket']" />
        </span>
      </button>
    </form>

    <div>
      <router-link :to="{ name: 'register' }">
        {{ contentStore.content.register }}
      </router-link>
    </div>
  </div>
</template>

  
<style scoped lang="scss">
@import url("~/assets/css/auth_pages.scss");
</style>