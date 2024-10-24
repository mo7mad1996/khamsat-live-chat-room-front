<script setup>
// utils
import { watch } from "vue";
import { useContentStore } from "~/stores/contentStore";
import { useAuthStore } from "~/stores/authStore";
import { useRouter } from "vue-router";

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
  <div class="div">
    <div class="row">
      <span>{{ contentStore.content.language }}</span>
      <select v-model="contentStore.lang" class="select">
        <option v-for="l in contentStore.languages" :key="l.key" :value="l.key">
          {{ l.value }}
        </option>
      </select>
    </div>

    <button @click="handel_logout" v-if="authStore.isAuthenticated">
      <span>
        {{ contentStore.content.logout }}
        <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" />
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.div {
  padding: 1em;

  .row {
    justify-content: space-between;
  }

  button {
    display: block;
    width: 100%;
    margin-top: 1em;
  }
}
</style>
