<script setup>
import { useContentStore } from "~/stores/contentStore";
import LayoutHeader from "@/components/Layout/Header.vue";

const contentStore = useContentStore();
</script>

<template>
  <div :class="`lang-${contentStore.lang}`">
    <!-- <LayoutHeader /> -->
    <RouterView />
  </div>
</template>
