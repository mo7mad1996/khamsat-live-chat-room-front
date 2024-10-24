<script setup>
// utils
import { watch } from "vue";
import { useContentStore } from "~/stores/contentStore";
import { useAuthStore } from "~/stores/authStore";
import { useRouter } from "vue-router";

// assets
import logo from "~/assets/images/logo.svg";

// config
const contentStore = useContentStore();
const authStore = useAuthStore();
const router = useRouter();

// methods
const handel_logout = () => {
  authStore.logout();
  router.push({ name: "login" });
};

// watcher for language change
watch(
  () => contentStore.lang,
  (v) => contentStore.setLang(v)
);
</script>

<template>
  <header class="container">
    <div class="row">
      <router-link :to="{ name: 'home' }" class="logo">
        <img :src="logo" alt="Logo" />
      </router-link>

      <nav class="row">
        <select v-model="contentStore.lang" class="select">
          <option
            v-for="l in contentStore.languages"
            :key="l.key"
            :value="l.key"
          >
            {{ l.value }}
          </option>
        </select>

        <button
          @click="handel_logout"
          class="user"
          v-if="authStore.isAuthenticated"
        >
          <span>
            {{ contentStore.content.logout }}
            <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" />
          </span>
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped lang="scss">
header {
  margin: 1em auto;
  backdrop-filter: blur(20px);
  background: rgba(75, 101, 153, 0.24);
  padding: 1.2em 2em;
  border-radius: 1em;
  position: fixed;
  top: 1em;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
  // box-shadow: var(--shadow-color) 0px 0px 20px 10px;
  border: 2px solid var(--shadow-color);

  .logo img {
    display: block;
    height: 30px;
  }

  .select {
    background: transparent;
    color: inherit;
    border: none;
    border-radius: 5px;
    padding: 0.5em 1em;
    cursor: pointer;
    appearance: none; /* Remove default arrow */
    text-align: end;
    outline: none; /* Remove outline */
    transition: border-color 0.3s ease;

    option {
      background: inherit;
      color: black;
    }
  }

  nav {
    margin-inline-start: auto;
  }
}
</style>
