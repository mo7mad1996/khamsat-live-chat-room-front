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
const user = reactive({ email: "", password: "", name: "" });
const loading = ref(false);

// methods
const handleSubmit = () => {
  loading.value = true;
  authStore.register(
    user,
    () => router.push({ name: "home" }),
    () => (loading.value = false)
  );
};
</script>

<template>
  <div class="container">
    <h2 class="page-title">{{ contentStore.content.register }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="input">
        <label for="name">{{ contentStore.content.name }}</label>
        <input v-model="user.name" required />
      </div>
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
          {{ contentStore.content.register }}
        </span>
      </button>
    </form>

    <div>
      <router-link :to="{ name: 'login' }">
        {{ contentStore.content.login }}
      </router-link>
    </div>
  </div>
</template>

  
<style scoped lang="scss">
@import url("~/assets/css/auth_pages.scss");
</style>